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
            '@givewp/forms/types': path.resolve(__dirname, 'src/DonationForm/resources/types.ts'),
            '@givewp/forms/propTypes': path.resolve(__dirname, 'src/DonationForm/resources/propTypes.ts'),
            '@givewp/forms/app': path.resolve(__dirname, 'src/DonationForm/resources/app'),
            '@givewp/form-builder': path.resolve(__dirname, 'packages/form-builder/src'),
        },
    },
    entry: {
        donationFormBlock: srcPath('DonationForm/Blocks/DonationFormBlock/resources/block.ts'),
        donationFormBlockStyle: srcPath('DonationForm/Blocks/DonationFormBlock/resources/editor/styles/index.scss'),
        donationFormApp: srcPath('DonationForm/resources/app/DonationFormApp.tsx'),
        donationFormRegistrars: srcPath('DonationForm/resources/registrars/index.ts'),
        donationFormEmbed: srcPath('DonationForm/resources/embed.ts'),
        donationFormEmbedInside: srcPath('DonationForm/resources/embedInside.ts'),
        stripePaymentElementGateway: srcPath(
            'PaymentGateways/Gateways/Stripe/StripePaymentElementGateway/stripePaymentElementGateway.tsx'
        ),
        nextGenTestGateway: srcPath('PaymentGateways/Gateways/NextGenTestGateway/nextGenTestGateway.tsx'),
        payPalStandardGateway: srcPath(
            'PaymentGateways/Gateways/PayPal/PayPalStandardGateway/payPalStandardGateway.tsx'
        ),
        payPalCommerceGateway: srcPath('PaymentGateways/Gateways/PayPalCommerce/payPalCommerceGateway.tsx'),
        classicFormDesignCss: srcPath('DonationForm/FormDesigns/ClassicFormDesign/css/main.scss'),
        classicFormDesignJs: srcPath('DonationForm/FormDesigns/ClassicFormDesign/js/main.ts'),
        multiStepFormDesignCss: srcPath('DonationForm/FormDesigns/MultiStepFormDesign/css/main.scss'),
        multiStepFormDesignJs: srcPath('DonationForm/FormDesigns/MultiStepFormDesign/js/main.ts'),
        donationConfirmationReceiptApp: srcPath('DonationForm/resources/receipt/DonationConfirmationReceiptApp.tsx'),
        baseFormDesignCss: srcPath('DonationForm/resources/styles/base.scss'),
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
