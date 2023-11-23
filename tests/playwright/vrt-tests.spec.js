import { test, expect } from '@playwright/test';
import path from 'path';

// import storiesData from '../../dist/stories.json';

import scenarios from './scenarios.json';

const basePath = path.resolve( __dirname, '../../' );

/**
 * Run tests in parallel
 *
 * By default, Playwright runs tests from the same file serially.
 */
test.describe.configure( { mode: 'parallel' } );

scenarios.forEach( ( story ) => {
	const [ , storyID ] = story.url.split( '?id=' );
	test( `VRT ${ storyID }`, async ( { page } ) => {
		const clickSelector = story.clickSelector || null;

		//open local file in playwright
		// cut story.url path on "="

		global.console.log( 'open', `file://${ basePath }${ story.url }` );

		await page.goto( `file://${ basePath }${ story.url }` );

		// wait for fonts to load
		await page.evaluate( () => document.fonts.ready );

		if ( story.readySelector ) {
			await page.waitForSelector( story.readySelector );
		}

		if ( clickSelector ) {
			await page.click( clickSelector );
			await page.waitForTimeout( story.postInteractionWait || 0 );
		}

		// await page.goto( `/iframe?id=${ story }` );
		await expect( page ).toHaveScreenshot();
	} );
} );
