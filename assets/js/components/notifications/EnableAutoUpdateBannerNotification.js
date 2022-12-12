/**
 * EnableAutoUpdateBannerNotification component.
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
import BannerNotification from './BannerNotification';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useCallback, useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import API from 'googlesitekit-api';
import { CORE_SITE } from '../../googlesitekit/datastore/site/constants';
import { getTimeInSeconds } from '../../util';
import useQueryArg from '../../hooks/useQueryArg';
import {
	CORE_USER,
	PERMISSION_UPDATE_PLUGINS,
} from '../../googlesitekit/datastore/user/constants';
import SpinnerButton from '../SpinnerButton';
import CTA from './CTA';

const { useSelect, useDispatch } = Data;

const NOTIFICATION_ID = 'enable-plugin-auto-update-notification';
const HIDE_NOTIFICATION_ON_FIRST_SETUP =
	'auto-update-banner-hide-notification-on-first-setup';

const EnableAutoUpdateBannerNotification = () => {
	const hasUpdatePluginCapacity = useSelect( ( select ) =>
		select( CORE_USER ).hasCapability( PERMISSION_UPDATE_PLUGINS )
	);
	const autoUpdatesEnabled = useSelect( ( select ) =>
		select( CORE_SITE ).getAutoUpdatesEnabled()
	);
	const isDoingEnableAutoUpdate = useSelect( ( select ) =>
		select( CORE_SITE ).isDoingEnableAutoUpdate()
	);
	const error = useSelect( ( select ) =>
		select( CORE_SITE ).getErrorForAction( 'enableAutoUpdate', [] )
	);

	const { enableAutoUpdate } = useDispatch( CORE_SITE );

	const [ notification ] = useQueryArg( 'notification' );
	const [ slug ] = useQueryArg( 'slug' );

	const [ isInitialPluginSetup, setIsFirstPluginSetup ] = useState( true );

	const setFirstPluginSetup = useCallback(
		async ( isFirstSetup = true ) => {
			if ( isFirstSetup ) {
				await API.setItem( HIDE_NOTIFICATION_ON_FIRST_SETUP, true, {
					ttl: getTimeInSeconds() * 10,
				} );
				setIsFirstPluginSetup( isFirstSetup );
			} else {
				const { value } = await API.getItem(
					HIDE_NOTIFICATION_ON_FIRST_SETUP
				);
				setIsFirstPluginSetup( !! value );
			}
		},
		[ setIsFirstPluginSetup ]
	);

	/**
	 * If the user just set up Site Kit (eg. just returned from the
	 * initial OAuth sign-in flow) and is seeing the dashboard
	 * for the first time, we want to hide the notification for 10
	 * minutes so they aren't immediately bothered by
	 * CTA notifications.
	 */
	useEffect( () => {
		if ( ! hasUpdatePluginCapacity || ! autoUpdatesEnabled ) {
			return;
		}
		setFirstPluginSetup(
			notification === 'authentication_success' && ! slug
		);
	}, [
		notification,
		slug,
		hasUpdatePluginCapacity,
		autoUpdatesEnabled,
		setFirstPluginSetup,
	] );

	// Don't render anything if the user has no permission to update plugin or plugin auto-updates are disabled.
	if ( ! hasUpdatePluginCapacity || ! autoUpdatesEnabled ) {
		return null;
	}

	// Don't show this banner if the user just came from the initial Site Kit setup
	// flow less than 10 minutes ago.
	if ( isInitialPluginSetup ) {
		return null;
	}

	return (
		<BannerNotification
			id={ NOTIFICATION_ID }
			title={ __( 'Keep Site Kit up-to-date', 'google-site-kit' ) }
			description={ __(
				'Turn on auto-updates so you always have the latest version of Site Kit. We constantly introduce new features to help you get the insights you need to be successful on the web.',
				'google-site-kit'
			) }
			ctaComponent={
				<SpinnerButton
					onClick={ enableAutoUpdate }
					isSaving={ isDoingEnableAutoUpdate }
				>
					{ isDoingEnableAutoUpdate }
					{ __( 'Enable auto-updates', 'google-site-kit' ) }
				</SpinnerButton>
			}
			dismiss={ __( 'Dismiss', 'google-site-kit' ) }
			isDismissible
			dismissExpires={ 0 }
			dismissOnCTAClick={ false }
			footer={ error && <CTA title={ error } error></CTA> }
		/>
	);
};

export default EnableAutoUpdateBannerNotification;
