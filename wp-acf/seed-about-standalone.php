<?php
/**
 * One-off About seeder — runs ONLY when you visit its URL, never on normal page loads,
 * so it cannot take the site down the way a Code Snippets snippet did.
 *
 * HOW TO RUN (cPanel, no Code Snippets needed):
 *  1. Import wp-acf/about-content.acf.json first (ACF -> Tools -> Import Field Groups).
 *  2. cPanel -> File Manager -> open your WordPress ROOT (the folder that contains
 *     wp-load.php and wp-config.php — usually public_html).
 *  3. Upload THIS file there.
 *  4. Make sure you are logged into wp-admin in the same browser, then visit:
 *        https://morbiuz.mydemobb.com/seed-about-standalone.php
 *  5. You should see "About Content seeded...".
 *  6. DELETE this file from File Manager immediately afterwards.
 *
 * Images are NOT set here — set them in Pages -> About after running:
 *   Banner: mobiuz-about-banner.webp | Cards: sliding-card.png, img.png, img-1.png | Culture: our-culture.jpg
 */

require __DIR__ . '/wp-load.php';

// Only a logged-in administrator can run this.
if ( ! current_user_can( 'manage_options' ) ) {
	exit( 'Log into wp-admin as an administrator first, then reload this URL.' );
}

if ( ! function_exists( 'update_field' ) ) {
	exit( 'ACF not loaded — make sure Advanced Custom Fields is active.' );
}

$about = get_page_by_path( 'about' ); // change 'about' if your page slug differs
if ( ! $about ) {
	exit( 'Could not find the "about" page — check the slug.' );
}
$id = $about->ID;

update_field( 'bannerSubhead', 'ABOUT US', $id );
update_field( 'bannerTitle', 'STRATEGY <br /> AND IMAGINATION <br /> LOOP <span class="cursive has-underline">ENDLESSLY</span>', $id );

update_field( 'introSubhead', 'ABOUT US', $id );
update_field( 'introHeading', 'Creativity is often treated like a straight line. A beginning, a process, an end. We never believed in that.', $id );
update_field( 'introBody', 'Mobiuz Studio was inspired by the Mobius strip, a form with no clear start or finish. A continuous surface that loops into itself, where every point connects and evolves into the next. It is a quiet reminder that the best ideas are not created once and left behind. They are revisited, refined, and reshaped over time.', $id );

update_field( 'teamSubhead', 'WHO WE ARE', $id );
update_field( 'teamTitle', 'MEET THE <br /> TEAM', $id );

update_field( 'cultureSubhead', 'OUR CULTURE', $id );
update_field( 'cultureHeading', 'Great things happen when different <span class="cursive">minds</span> collide. At Mobiuz, we embrace the <span class="cursive">messy</span>, the <span class="cursive">imperfect</span>, and the unexpected.', $id );

update_field( 'cultureParagraphs', array(
	array( 'text' => 'Our team thrives on collaboration, pushing boundaries, and bouncing ideas back and forth. Everyone’s voice matters, and that’s where the magic happens. We’re not just co-workers; we’re creators, challengers, and problem solvers together.' ),
	array( 'text' => 'At Mobiuz, everyone is encouraged to take charge of their work. We give our team the space to experiment and the responsibility to drive their ideas forward. If you’ve got a concept, we’ve got your back. Own it, refine it, and bring it to life.' ),
), $id );

// Pre-create 3 empty sliding-card rows so you only need to attach images.
update_field( 'slidingCards', array(
	array( 'image' => '' ),
	array( 'image' => '' ),
	array( 'image' => '' ),
), $id );

echo 'About Content seeded on post ' . $id . '. NOW DELETE THIS FILE.';
