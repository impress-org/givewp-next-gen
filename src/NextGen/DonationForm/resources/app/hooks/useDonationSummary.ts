import {useDonationFormState, useDonationFormStateDispatch} from '@givewp/forms/app/store';
import {
    addDonationSummaryItem,
    addDonationSummaryItems,
    removeDonationSummaryItem
} from '@givewp/forms/app/store/reducer';

/**
 * @unreleased
 */
export default function useDonationSummary() {
    const {donationSummary} = useDonationFormState();
    const dispatch = useDonationFormStateDispatch();

    return {
        donationSummary,
        addDonationSummaryItems: (items) => dispatch(addDonationSummaryItems(items)),
        addDonationSummaryItem: (item) => dispatch(addDonationSummaryItem(item)),
        removeDonationSummaryItem: (itemId) => dispatch(removeDonationSummaryItem(itemId))
    }
}