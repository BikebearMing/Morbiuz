<?php
/**
 * One-time seed for the "Home Content" ACF group.
 *
 * HOW TO RUN (admin-only, no shell needed):
 *  1. Import wp-acf/home-content.acf.json first (ACF -> Tools -> Import Field Groups).
 *  2. Install the free "Code Snippets" plugin.
 *  3. Add New snippet, paste this file's contents.
 *  4. Set it to "Run once" and click "Save Changes and Execute Once".
 *  5. Delete the snippet afterwards.
 *
 * Images are NOT set here (upload them in Media, then pick them in the Home
 * page editor — Mobius BG, Services image, Our Team bg/people images).
 */

$home = get_page_by_path( 'home' ); // change 'home' if your front page uses another slug

if ( $home ) {
	$id = $home->ID;

	update_field( 'servicesIntro', 'WE Deliver eye-catching motion graphics and campaigns, spark emotion and increase conversions.', $id );

	update_field( 'videoZoom', array(
		'title1'  => 'strategy',
		'title2'  => 'imagination',
		'video'   => 'https://streamable.com/l/4wsqgh/mp4-high.mp4#t=0.001',
		'caption' => 'We designs infinite creative experiences where strategy and imagination flow as one.',
	), $id );

	update_field( 'ourTeam', array(
		'title'       => 'THE <span class="cursive">minds</span> <br /> BEHIND MOBIUS',
		'buttonLabel' => 'About Us',
		'buttonUrl'   => '/about',
		// bgImage / peopleImage: set in the UI after uploading.
	), $id );

	update_field( 'featuredProject', array(
		'projectName' => '室内高人 MV',
		'client'      => 'NICOLE LAI',
		'year'        => '2025',
		'video1'      => 'https://streamable.com/l/vcx2gh/mp4.mp4',
		'video2'      => 'https://streamable.com/l/pb93s5/mp4.mp4',
	), $id );

	echo 'Home Content seeded on post ' . $id;
} else {
	echo 'Could not find the "home" page — check the slug.';
}
