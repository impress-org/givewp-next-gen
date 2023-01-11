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
            heading="Hey Jonathan, thanks for your donation!"
            description="Jonathan, your contribution means a lot and will be put to good use in making a difference. We’ve sent your donation receipt to jpwaldstein@gmail.com."
            donorDetails={receipt.donorDetails}
            donationDetails={receipt.donationDetails}
            subscriptionDetails={receipt.subscriptionDetails}
            additionalDetails={receipt.additionalDetails}
         />
    );
}

render(<DonationConfirmationReceiptApp />, document.getElementById('root-givewp-donation-confirmation-receipt'));
