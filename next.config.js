const sourcebit = require('sourcebit');
const crypto = require('crypto');

const sourcebitConfig = require('./sourcebit.js');

sourcebit.fetch(sourcebitConfig);

module.exports = {
    trailingSlash: true,
    env: {
        STACKBIT_CONTACT_FORM_SECRET: process.env.STACKBIT_CONTACT_FORM_SECRET
    },
    devIndicators: {
        autoPrerender: false
    },
    webpack: (config, { webpack }) => {
        // Tell webpack to ignore watching content files in the content folder.
        // Otherwise webpack receompiles the app and refreshes the whole page.
        // Instead, the src/pages/[...slug].js uses the "withRemoteDataUpdates"
        // function to update the content on the page without refreshing the
        // whole page
        config.plugins.push(new webpack.WatchIgnorePlugin([["/\/content\//"]]));
        return config;
    }
};
