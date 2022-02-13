const {validationResult} = require('express-validator')
const fs = require('fs')
const fsPromise = fs.promises
const cheerio = require('cheerio')


exports.uploadGetController = (req, res, next)=>{
    res.render('upload', {title: 'Upload your theme', errors: false})
}

exports.uploadPostController = (req, res, next)=>{
    const formatter = error => error.msg
    const errors = validationResult(req).formatWith(formatter)
    
    if(!errors.isEmpty()){
        res.render('upload', {title: "Upload Error", errors: errors.mapped()})
    }else{
        res.render('convert')
    }
}

exports.convertController = async (req, res, next)=>{
    const {folderName} = req.params
    const directory = `wordpress-theme/${folderName}`
    const html_directory = `html-theme-uploads/${folderName}`

    // Read index.html
    const html = await fsPromise.readFile(`html-theme-uploads/${folderName}/index.html`)
    const $ = cheerio.load(html)
    await fsPromise.mkdir(directory, { recursive: true })


    // Write header.php

    var chunk = `<!DOCTYPE html><html <?php language_attributes(); ?> lang="en">
    ${$('head')}
    <body <?php body_class();?> >
        <?php wp_body_open(); ?>
    `
    await fsPromise.appendFile(`${directory}/header.php`, chunk)


    var chunk = $('header').prevAll().toString()
    await fsPromise.appendFile(`${directory}/header.php`, chunk)
    await fsPromise.appendFile(`${directory}/header.php`, '\n' + $('header').toString())
    

    // Write home.php
    var chunk = `<?php get_header(); ?>
    ${$('header').nextUntil('footer').toString()}
    <?php get_footer(); ?>
    `
    await fsPromise.appendFile(`${directory}/home.php`, chunk)


    // Wirte footer.php
    var chunk = `${$('footer').toString()}
            ${$('footer').nextAll().toString()}
            <?php wp_footer(); ?>
        </body>
    </html>
    `
    await fsPromise.appendFile(`${directory}/footer.php`, chunk)


    // Write index.php
    var chunk = `
    <?php get_header(); ?>
        <?php
        if ( have_posts() ) {
        
            // Load posts loop.
            while ( have_posts() ) {
                the_post();
            }

        } else {
        
            // If no content, include the "No posts found" template.
            echo("<h3 style='text-align:center;'>No post available!</h3>");
        
        }

        get_footer();
    `

    await fsPromise.appendFile(`${directory}/index.php`, chunk)




    // Create style.css file

    var chunk = `
         /*
        Theme Name: Test Theme
        Theme URI: https://wordpress.org/themes/twentytwentyone/
        Author: the WordPress team
        Author URI: https://wordpress.org/
        Description: Twenty Twenty-One is a blank canvas for your ideas and it makes the block editor your best brush. With new block patterns, which allow you to create a beautiful layout in a matter of seconds, this theme’s soft colors and eye-catching — yet timeless — design will let your work shine. Take it for a spin! See how Twenty Twenty-One elevates your portfolio, business website, or personal blog.
        Requires at least: 5.3
        Tested up to: 5.9
        Requires PHP: 5.6
        Version: 1.5
        License: GNU General Public License v2 or later
        License URI: http://www.gnu.org/licenses/gpl-2.0.html
        Text Domain: twentytwentyone
        Tags: one-column, accessibility-ready, custom-colors, custom-menu, custom-logo, editor-style, featured-images, footer-widgets, block-patterns, rtl-language-support, sticky-post, threaded-comments, translation-ready

        Twenty Twenty-One WordPress Theme, (C) 2020 WordPress.org
        Twenty Twenty-One is distributed under the terms of the GNU GPL.
        */
    `
    await fsPromise.appendFile(`${directory}/style.css`, chunk)

    
    if(fs.existsSync(`${html_directory}/style.css`)){

        chunk = await fsPromise.readFile(`${html_directory}/style.css`)
        await fsPromise.appendFile(`${directory}/style.css`, chunk)

    }


    res.redirect('/upload')
}