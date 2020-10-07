/**
 * `core/user` isValidDateString utility.
 *
 * Site Kit by Google, Copyright 2020 Google LLC
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
 * Internal dependencies
 */
import { isValidDateInstance } from './is-valid-date-instance';

/**
 * Asserts whether a given date string is valid or invalid.
 *
 * @since n.e.x.t
 *
 * @param {string} dateString Date string to be asserted against. Defaults to an empty string.
 * @return {boolean}          True if the given date string is valid.
 */
export const isValidDateString = ( dateString = '' ) => {
	const isString = typeof dateString === 'string';

	if ( ! isString ) {
		return false;
	}

	const dateArray = dateString.split( '-' );

	return dateArray.length === 3 && isValidDateInstance( new Date( dateString ) );
};