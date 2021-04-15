/**
 * User Input Select Options.
 *
 * Site Kit by Google, Copyright 2021 Google LLC
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
import { useCallback, useEffect, useState, useRef } from '@wordpress/element';
import { ENTER } from '@wordpress/keycodes';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Data from 'googlesitekit-data';
import { CORE_USER } from '../../googlesitekit/datastore/user/constants';
import Radio from '../Radio';
import Checkbox from '../Checkbox';
import { Cell, Input, TextField } from '../../material-components';
const { useSelect, useDispatch } = Data;

export default function UserInputSelectOptions( { slug, options, max, next, isActive } ) {
	const values = useSelect( ( select ) => select( CORE_USER ).getUserInputSetting( slug ) || [] );
	const [ other, setOther ] = useState( values.filter( ( value ) => ! options[ value ] )[ 0 ] || '' );
	const { setUserInputSetting } = useDispatch( CORE_USER );
	const inputRef = useRef();
	const optionsRef = useRef();
	const [ disabled, setDisabled ] = useState( false );

	// Need to make sure that dependencies list always has the same number of elements.
	const dependencies = values.concat( Array( max ) ).slice( 0, max );

	useEffect( () => {
		if ( optionsRef && optionsRef.current && isActive ) {
			focusRadioOrCheckbox( max === 1 ? 'radio' : 'checkbox' );
		}
	}, [ isActive, max ] );

	const focusRadioOrCheckbox = ( optionType = 'radio' ) => {
		const checkedEls = optionsRef.current.querySelectorAll( `input[type="${ optionType }"]:checked` );

		if ( checkedEls.length > 0 ) {
			focusOption( checkedEls[ 0 ] );
		} else {
			const els = optionsRef.current.querySelectorAll( `input[type="${ optionType }"]` );
			focusOption( els[ 0 ] );
		}
	};

	const focusOption = ( element ) => {
		if ( element ) {
			setTimeout( () => {
				element.focus();
			}, 50 );
		}
	};

	const onClick = useCallback( ( event ) => {
		const { target } = event;
		const { value, checked, name, type, id } = target;

		const newValues = new Set( [ value, ...values ] );
		if ( ! checked ) {
			newValues.delete( value );
		}

		if ( name === `${ slug }-other` && checked === true ) {
			if ( inputRef.current ) {
				inputRef.current.inputElement.focus();
			}
			setDisabled( false );
		}

		if ( type === 'radio' && id === `${ slug }-other` ) {
			if ( inputRef.current ) {
				inputRef.current.inputElement.focus();
			}
			setDisabled( false );
		}

		if (
			type !== 'radio' &&
			newValues.size === max &&
			! newValues.has( '' ) &&
			! newValues.has( other )
		) {
			setDisabled( true );
		} else {
			setDisabled( false );
		}

		setUserInputSetting( slug, Array.from( newValues ).slice( 0, max ) );
	}, dependencies );

	const onOtherChange = useCallback( ( { target } ) => {
		const newValues = [
			target.value,
			...values.filter( ( value ) => !! options[ value ] ),
		];

		setOther( target.value );
		setUserInputSetting( slug, newValues.slice( 0, max ) );
	}, dependencies );

	const onClickProps = {
		[ max > 1 ? 'onChange' : 'onClick' ]: onClick,
	};

	const ListComponent = max === 1 ? Radio : Checkbox;

	const items = Object.keys( options ).map( ( optionSlug ) => {
		const props = {
			id: `${ slug }-${ optionSlug }`,
			value: optionSlug,
			checked: values.includes( optionSlug ),
			tabIndex: ! isActive ? '-1' : undefined,
			...onClickProps,
		};

		if ( max > 1 ) {
			props.disabled = values.length >= max && ! values.includes( optionSlug );
			props.name = `${ slug }-${ optionSlug }`;
		} else {
			props.name = slug;
		}

		return (
			<div key={ optionSlug } className="googlesitekit-user-input__select-option">
				<ListComponent { ...props }>
					{ options[ optionSlug ] }
				</ListComponent>
			</div>
		);
	} );

	const handleKeyDown = useCallback( ( event ) => {
		if ( event.keyCode === ENTER && other.trim().length > 0 && next && typeof next === 'function' ) {
			next();
		}
	} );

	return (
		<Cell lgStart={ 6 } lgSize={ 6 } mdSize={ 8 } smSize={ 4 }>
			<div className="googlesitekit-user-input__select-options" ref={ optionsRef }>
				{ items }

				<div className="googlesitekit-user-input__select-option">
					<ListComponent
						id={ `${ slug }-other` }
						name={ max === 1 ? slug : `${ slug }-other` }
						value={ other }
						checked={ values.includes( other.trim() ) }
						disabled={ max > 1 && values.length >= max && ! values.includes( other.trim() ) }
						tabIndex={ ! isActive ? '-1' : undefined }
						{ ...onClickProps }
					>
						{ __( 'Other:', 'google-site-kit' ) }
					</ListComponent>

					<TextField
						label={ __( 'Type your own answer', 'google-site-kit' ) }
						noLabel
					>
						<Input
							id={ `${ slug }-select-options` }
							value={ other }
							onChange={ onOtherChange }
							ref={ inputRef }
							disabled={ disabled }
							tabIndex={ ! values.includes( other.trim() ) || ! isActive ? '-1' : undefined }
							onKeyDown={ handleKeyDown }
						/>
					</TextField>
					<label htmlFor={ `${ slug }-select-options` } className="screen-reader-text">
						{ __( 'Enter your own answer here', 'google-site-kit' ) }
					</label>
				</div>
			</div>

			<p className="googlesitekit-user-input__note">
				{ max === 1 && __( 'Choose up to one (1) answer', 'google-site-kit' ) }
				{ max === 2 && __( 'Choose up to two (2) answers', 'google-site-kit' ) }
				{ max === 3 && __( 'Choose up to three (3) answers', 'google-site-kit' ) }
			</p>
		</Cell>
	);
}

UserInputSelectOptions.propTypes = {
	slug: PropTypes.string.isRequired,
	options: PropTypes.shape( {} ).isRequired,
	max: PropTypes.number,
	next: PropTypes.func,
	isActive: PropTypes.bool,
};

UserInputSelectOptions.defaultProps = {
	max: 1,
};
