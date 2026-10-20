'use strict';

var GetIntrinsic = require('get-intrinsic');
var callBound = require('call-bound');

var $Map = GetIntrinsic('%Map%', true);

/** @type {<K, V>(thisArg: Map<K, V>, key: K) => V} */
var $mapGet = callBound('Map.prototype.get', true);
/** @type {<K, V>(thisArg: Map<K, V>, key: K, value: V) => void} */
var $mapSet = callBound('Map.prototype.set', true);
/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
var $mapHas = callBound('Map.prototype.has', true);
/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
var $mapDelete = callBound('Map.prototype.delete', true);
/** @type {<K, V>(thisArg: Map<K, V>) => number} */
var $mapSize = callBound('Map.prototype.size', true);

/**
 * @template K, V
 * @returns {{ 'delete': (key: K) => boolean, get: (key: K) => V | undefined, has: (key: K) => boolean, set: (key: K, value: V) => void }}
 */
var createStorage = function getStorage() {
	/** @typedef {{ 'delete': (key: K) => boolean, get: (key: K) => V | undefined, has: (key: K) => boolean, set: (key: K, value: V) => void }} Channel */

	/** @type {Map<K, V> | undefined} */ var $m;

	/** @type {Channel} */
	var channel = {
		'delete': function (key) {
			if ($m) {
				var result = $mapDelete($m, key);
				if ($mapSize($m) === 0) {
					$m = void undefined;
				}
				return result;
			}
			return false;
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($m) {
				return $mapGet($m, key);
			}
		},
		has: function (key) {
			if ($m) {
				return $mapHas($m, key);
			}
			return false;
		},
		set: function (key, value) {
			if (!$m) {
				// @ts-expect-error TS can't handle narrowing a variable inside a closure
				$m = new $Map();
			}
			$mapSet($m, key, value);
		}
	};

	return channel;
};

module.exports = !!$Map && createStorage;
