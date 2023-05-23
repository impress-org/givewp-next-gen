/**
 * External Dependencies
 */
const path = require('path');

/**
 * WordPress Dependencies
 */
const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');

/**
 * Custom config
 */
module.exports = {
    ...defaultConfig,
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve.alias,
            '@givewp/forms/types': path.resolve(__dirname, 'src/NextGen/DonationForm/resources/types.ts'),
            '@givewp/forms/propTypes': path.resolve(__dirname, 'src/NextGen/DonationForm/resources/propTypes.ts'),
            '@givewp/forms/app': path.resolve(__dirname, 'src/NextGen/DonationForm/resources/app'),
            '@givewp/form-builder': path.resolve(__dirname, 'packages/form-builder/src'),
        },
    },
    entry: {
        donationFormBlock: srcPath('NextGen/DonationForm/Blocks/DonationFormBlock/resources/block.ts'),
        donationFormBlockStyle: srcPath(
            'NextGen/DonationForm/Blocks/DonationFormBlock/resources/editor/styles/index.scss'
        ),
        donationFormApp: srcPath('NextGen/DonationForm/resources/app/DonationFormApp.tsx'),
        donationFormRegistrars: srcPath('NextGen/DonationForm/resources/registrars/index.ts'),
        donationFormEmbed: srcPath('NextGen/DonationForm/resources/embed.ts'),
        donationFormEmbedInside: srcPath('NextGen/DonationForm/resources/embedInside.ts'),
        nextGenStripeGateway: srcPath('NextGen/Gateways/Stripe/NextGenStripeGateway/nextGenStripeGateway.tsx'),
        nextGenTestGateway: srcPath('NextGen/Gateways/NextGenTestGateway/nextGenTestGateway.tsx'),
        payPalStandardGateway: srcPath('NextGen/Gateways/PayPal/PayPalStandardGateway/payPalStandardGateway.tsx'),
        payPalCommerceGateway: srcPath('NextGen/Gateways/PayPalCommerce/payPalCommerceGateway.tsx'),
        classicFormDesignCss: srcPath('NextGen/DonationForm/FormDesigns/ClassicFormDesign/css/main.scss'),
        classicFormDesignJs: srcPath('NextGen/DonationForm/FormDesigns/ClassicFormDesign/js/main.ts'),
        multiStepFormDesignCss: srcPath('NextGen/DonationForm/FormDesigns/MultiStepFormDesign/css/main.scss'),
        multiStepFormDesignJs: srcPath('NextGen/DonationForm/FormDesigns/MultiStepFormDesign/js/main.ts'),
        donationConfirmationReceiptApp: srcPath(
            'NextGen/DonationForm/resources/receipt/DonationConfirmationReceiptApp.tsx'
        ),
        baseFormDesignCss: srcPath('NextGen/DonationForm/resources/styles/base.scss'),
        formBuilderApp: path.resolve(process.cwd(), 'packages/form-builder/src/index.tsx'),
        formBuilderRegistrars: srcPath('FormBuilder/resources/js/registrars/index.ts'),
    },
};

/**
 * Helper for getting the path to the src directory.
 *
 * @param {string} relativePath
 * @returns {string}
 */
function srcPath(relativePath) {
    return path.resolve(process.cwd(), 'src', relativePath);
}
