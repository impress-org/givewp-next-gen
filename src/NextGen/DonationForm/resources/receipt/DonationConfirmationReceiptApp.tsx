import {render} from '@wordpress/element';
import {withTemplateWrapper} from '@givewp/forms/app/templates';

const formTemplates = window.givewp.form.templates;
const DonationReceiptTemplate = withTemplateWrapper(formTemplates.layouts.receipt);

/**
 * Get data from the server
 */
const {receipt} = window.givewpDonationConfirmationReceiptExports

function DonationConfirmationReceiptApp() {
    return (
        <DonationReceiptTemplate
            heading={receipt.settings.heading}
            description={receipt.settings.description}
            donorDashboardUrl={receipt.settings.donorDashboardUrl}
            donorDetails={receipt.donorDetails}
            donationDetails={receipt.donationDetails}
            subscriptionDetails={receipt.subscriptionDetails}
            additionalDetails={receipt.additionalDetails}
        />
    );
}

const root = document.getElementById('root-givewp-donation-confirmation-receipt');

render(<DonationConfirmationReceiptApp />, root);

root.scrollIntoView({
    behavior: 'smooth',
});
