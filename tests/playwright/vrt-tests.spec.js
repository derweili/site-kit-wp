import { test, expect } from '@playwright/test';
import path from 'path';

// import storiesData from '../../dist/stories.json';

import scenarios from './scenarios.json';

// turn storiesData.stories object into array
// const stories = Object.keys( storiesData.stories );

const basePath = path.resolve( __dirname, '../../' );

test.describe.configure( { mode: 'parallel' } );

scenarios.forEach( ( story ) => {
	const [ , storyID ] = story.url.split( '?id=' );
	test( `VRT ${ storyID }`, async ( { page } ) => {
		//open local file in playwright
		// cut story.url path on "="

		global.console.log( 'open', `file://${ basePath }${ story.url }` );
		await page.goto( `file://${ basePath }${ story.url }` );

		// await page.goto( `/iframe?id=${ story }` );
		await expect( page ).toHaveScreenshot();
	} );
} );
