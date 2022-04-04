/**
 * ActivateAnalyticsCTA component.
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
 * External dependencies
 */
import PropTypes from 'prop-types';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useActivateModuleCallback from '../hooks/useActivateModuleCallback';
import Button from './Button';

export default function ActivateAnalyticsCTA( { children } ) {
	const activateModuleCallback = useActivateModuleCallback( 'analytics' );

	if ( ! activateModuleCallback ) {
		return null;
	}

	return (
		<div className="googlesitekit-analytics-cta">
			<div className="googlesitekit-analytics-cta__preview-graphs">
				{ children }
			</div>
			<div className="googlesitekit-analytics-cta__details">
				<p className="googlesitekit-analytics-cta--description">
					{ __(
						'See how many people visit your site from Search and track how you’re achieving your goals.',
						'google-site-kit'
					) }
				</p>
				<Button onClick={ activateModuleCallback }>
					{ __( 'Set up Google Analytics', 'google-site-kit' ) }
				</Button>
			</div>
		</div>
	);
}

ActivateAnalyticsCTA.propTypes = {
	children: PropTypes.node.isRequired,
};
