/**
 * AdSense Setup Account Site Requires Review component.
 *
 * Site Kit by Google, Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * WordPress dependencies
 */
import { useCallback, useContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import ViewContextContext from '../../../../../components/Root/ViewContextContext';
import { trackEvent } from '../../../../../util';
import { MODULES_ADSENSE } from '../../../datastore/constants';
import SetupAccountSiteUI from './common/SetupAccountSiteUI';
const { useSelect } = Data;

export default function SetupAccountSiteRequiresReview() {
	const viewContext = useContext( ViewContextContext );

	const reviewSiteURL = useSelect( ( select ) =>
		select( MODULES_ADSENSE ).getServiceAccountManageSitesURL()
	);

	const reviewSiteHandler = useCallback(
		( event ) => {
			event.preventDefault();
			trackEvent(
				`${ viewContext }_adsense`,
				'review_site_state',
				'requires_review'
			);
			global.open( reviewSiteURL, '_blank' );
		},
		[ reviewSiteURL, viewContext ]
	);

	const heading = __( 'Your site requires review', 'google-site-kit' );

	const description = __(
		'To start serving ads, your site needs to be approved first. Go to AdSense to request the review.',
		'google-site-kit'
	);

	const primaryButton = {
		label: __( 'Request review in AdSense', 'google-site-kit' ),
		href: reviewSiteURL,
		onClick: reviewSiteHandler,
	};

	return (
		<SetupAccountSiteUI
			heading={ heading }
			description={ description }
			primaryButton={ primaryButton }
		/>
	);
}
