<?php
/**
 * One-off Contact seeder — runs ONLY when you visit its URL, never on normal page loads.
 *
 * HOW TO RUN (cPanel, no Code Snippets):
 *  1. Import wp-acf/contact-content.acf.json first (ACF -> Tools -> Import Field Groups).
 *  2. cPanel -> File Manager -> WordPress ROOT (folder with wp-load.php) -> upload this file.
 *  3. Logged into wp-admin in the same browser, visit:
 *        https://morbiuz.mydemobb.com/seed-contact-standalone.php
 *  4. You should see "Contact Content seeded...".
 *  5. DELETE this file from File Manager immediately afterwards.
 *
 * Images are NOT set here — set them in Pages -> Contact after running:
 *   Banner: contact-banner.png | FAQ Image 1: faq-img-1.png | FAQ Image 2: faq-img-2-1.png
 *
 * The FAQs below are the old placeholder items so the page looks unchanged —
 * replace them with real questions/answers in the Contact editor.
 */

require __DIR__ . '/wp-load.php';

if ( ! current_user_can( 'manage_options' ) ) {
	exit( 'Log into wp-admin as an administrator first, then reload this URL.' );
}

if ( ! function_exists( 'update_field' ) ) {
	exit( 'ACF not loaded — make sure Advanced Custom Fields is active.' );
}

$contact = get_page_by_path( 'contact' ); // change 'contact' if your page slug differs
if ( ! $contact ) {
	exit( 'Could not find the "contact" page — check the slug.' );
}
$id = $contact->ID;

update_field( 'bannerSubhead', 'CONTACT US', $id );
update_field( 'bannerTitle', 'LET’S <span class="cursive has-underline">talk</span>', $id );

update_field( 'messageSubhead', 'SEND A MESSAGE', $id );
update_field( 'messageTitle', 'WE’RE HERE <br /> FOR THE <br /> NEXT <span class="cursive">loop</span>', $id );

update_field( 'contactIntro', 'We believe in collaboration that flows and ideas that never stop evolving. If you’re ready to take your brand to the next level, we’re ready to make it happen. Reach out, and let’s start the cycle of creativity together.', $id );
update_field( 'email', 'enquiry@mobiuzstudio.com', $id );
update_field( 'address', 'E-35-3, 3 Two Square, 2, Jalan 19/1, Seksyen 19, 46300 Petaling Jaya, Selangor.', $id );

update_field( 'faqSubhead', 'ASK US', $id );
update_field( 'faqTitle', 'FAQs', $id );

update_field( 'faqs', array(
	array(
		'question' => 'Who is Mobiuz?',
		'answer'   => 'Lorem ipsum dolor sit amet consectetur. Amet ac in auctor elementum ullamcorper. Porttitor nullam vulputate vivamus vulputate. Tristique morbi hendrerit sed tincidunt nec ullamcorper in. Commodo at vitae quis facilisi. In vel sit mauris nec egestas convallis mattis a facilisi.',
	),
	array( 'question' => 'Lorem ipsum dolor sit amet?', 'answer' => 'Lorem ipsum dolor sit amet consectetur.' ),
	array( 'question' => 'Lorem ipsum dolor sit amet?', 'answer' => 'Lorem ipsum dolor sit amet consectetur.' ),
	array( 'question' => 'Lorem ipsum dolor sit amet?', 'answer' => 'Lorem ipsum dolor sit amet consectetur.' ),
	array( 'question' => 'Lorem ipsum dolor sit amet?', 'answer' => 'Lorem ipsum dolor sit amet consectetur.' ),
), $id );

echo 'Contact Content seeded on post ' . $id . '. NOW DELETE THIS FILE.';
