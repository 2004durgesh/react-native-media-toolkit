const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {() => Promise<import('metro-config').MetroConfig>}
 */
module.exports = (() => {
    const config = getDefaultConfig(__dirname, {
        dirname: __dirname,
    });


    return config;
})();
