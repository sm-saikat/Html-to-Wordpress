const fs = require('fs')
const cheerio = require('cheerio')
  
    const directory = `wordpress-theme/Html-Theme.zip`

    // Read index.html
    const html = fs.readFileSync(`html-theme-uploads/aj.zip/index.html`)
    const $ = cheerio.load(html)
   


    // Write header.php

    var chunk = `<?php
    <!DOCTYPE html><html <?php language_attributes(); ?> lang="en">
    ${$('head')}
    <body <?php body_class();>
    <?php wp_body_open(); ?>
    `
    // await fs.appendFile(`${directory}/header.php`, chunk)

    
    var chunk = `${$('footer').toString()}
    ${$('footer').nextAll().toString()}
    `
    console.log(chunk);
