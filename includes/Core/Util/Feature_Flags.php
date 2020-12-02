<?php
/**
 * Class Google\Site_Kit\Core\Util\Feature_Flags
 *
 * @package   Google\Site_Kit\Core\Util
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://sitekit.withgoogle.com
 */

namespace Google\Site_Kit\Core\Util;

use ArrayAccess;

/**
 * Class for interacting with feature flag configuration.
 *
 * @since n.e.x.t
 * @access private
 * @ignore
 */
class Feature_Flags {

	const MODE_PRODUCTION = 'production';

	/**
	 * Feature flag mode.
	 *
	 * @since n.e.x.t
	 * @var string
	 */
	private static $mode = self::MODE_PRODUCTION;

	/**
	 * Feature flag definitions.
	 *
	 * @since n.e.x.t
	 * @var array|ArrayAccess
	 */
	private static $features = array();

	/**
	 * Checks if the given feature is enabled in the current mode on the main instance.
	 *
	 * @since n.e.x.t
	 *
	 * @param string $feature Feature key path to check.
	 * @return bool
	 */
	public static function enabled( $feature ) {
		if ( ! $feature || ! is_string( $feature ) || empty( static::$features ) ) {
			return false;
		}

		$feature_path  = explode( '.', "$feature.enabled" );
		$feature_modes = array_reduce(
			$feature_path,
			function ( $value, $key ) {
				if ( isset( $value[ $key ] ) ) {
					return $value[ $key ];
				}
				return null;
			},
			static::$features
		);

		return in_array( static::get_mode(), (array) $feature_modes, true );
	}

	/**
	 * Sets the feature configuration.
	 *
	 * @since n.e.x.t
	 *
	 * @param array|ArrayAccess $features Feature configuration.
	 */
	public static function set_features( $features ) {
		if ( is_array( $features ) || $features instanceof ArrayAccess ) {
			static::$features = $features;
		}
	}

	/**
	 * Sets the feature flag mode.
	 *
	 * @since n.e.x.t
	 *
	 * @param string $mode Feature flag mode.
	 */
	public static function set_mode( $mode ) {
		if ( $mode && is_string( $mode ) ) {
			static::$mode = $mode;
		}
	}

	/**
	 * Gets the current feature flag mode.
	 *
	 * @since n.e.x.t
	 *
	 * @return string Current mode.
	 */
	private static function get_mode() {
		/**
		 * Filter the feature flag mode.
		 *
		 * @since n.e.x.t
		 *
		 * @param string $mode The current feature flag mode.
		 */
		return (string) apply_filters( 'googlesitekit_flag_mode', static::$mode ) ?: self::MODE_PRODUCTION;
	}
}
