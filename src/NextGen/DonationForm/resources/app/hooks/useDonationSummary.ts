import {useDonationSummaryContext, useDonationSummaryDispatch} from '@givewp/forms/app/store/donation-summary';
import {
    addAmountToTotal,
    addItem,
    removeAmountFromTotal,
    removeItem,
} from '@givewp/forms/app/store/donation-summary/reducer';

/**
 * @unreleased
 */
export default function useDonationSummary() {
    const {items, totals} = useDonationSummaryContext();
    const dispatch = useDonationSummaryDispatch();

    return {
        items,
        totals,
        addItem: (item) => dispatch(addItem(item)),
        removeItem: (itemId) => dispatch(removeItem(itemId)),
        addToTotal: (itemId, amount) => dispatch(addAmountToTotal(itemId, amount)),
        removeFromTotal: (itemId) => dispatch(removeAmountFromTotal(itemId)),
    };
}
