import {__} from "@wordpress/i18n";
import {createInterpolateElement} from "@wordpress/element";

/**
 * @unreleased
 */
export default function FixedAmountMessage({amount}: { amount: string }) {
    return <div className="givewp-fields-amount__fixed-message">
        {createInterpolateElement(
            __('You are about to donate <amount/> to this campaign.', 'give'),
            {
                amount: <strong>{amount}</strong>
            }
        )}
    </div>
}