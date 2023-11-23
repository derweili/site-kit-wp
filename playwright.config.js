import { devices } from '@playwright/test';

// settings
const viewport = { width: 1280, height: 800 };
const deviceScaleFactor = 2;
const locale = 'en-us';

const config = {
	testDir: 'tests/playwright',
	// note: full options are specified because `devices`
	// have inconsistent viewports, etc.
	projects: [
		{
			name: 'chromium desktop',
			use: {
				userAgent: devices[ 'Desktop Chrome' ].userAgent,
				viewport,
				deviceScaleFactor,
				isMobile: false,
				hasTouch: false,
				defaultBrowserType:
					devices[ 'Desktop Chrome' ].defaultBrowserType,
				locale,
			},
		},
		{
			name: 'chromium tablet',
			use: {
				userAgent: devices[ 'Desktop Chrome' ].userAgent,
				viewport: { width: 868, height: 1124 },
				deviceScaleFactor,
				isMobile: false,
				hasTouch: false,
				defaultBrowserType:
					devices[ 'Desktop Chrome' ].defaultBrowserType,
				locale,
			},
		},
		{
			name: 'chromium mobile',
			use: {
				userAgent: devices[ 'Desktop Chrome' ].userAgent,
				viewport: { width: 420, height: 580 },
				deviceScaleFactor,
				isMobile: true,
				hasTouch: false,
				defaultBrowserType:
					devices[ 'Desktop Chrome' ].defaultBrowserType,
				locale,
			},
		},
	],
};

export default config;
