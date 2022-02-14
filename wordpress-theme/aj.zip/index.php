
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
    