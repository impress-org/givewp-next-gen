import {useDonationSummaryContext, useDonationSummaryDispatch} from '@givewp/forms/app/store/donation-summary';
import {
    addAmountToTotal,
    addItem,
    addItems,
    removeAmountFromTotal,
    removeItem,
    updateItem,
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
        addItems: (items) => dispatch(addItems(items)),
        addItem: (item) => dispatch(addItem(item)),
        addToTotal: (itemId, amount) => dispatch(addAmountToTotal(itemId, amount)),
        removeFromTotal: (itemId) => dispatch(removeAmountFromTotal(itemId)),
        removeItem: (itemId) => dispatch(removeItem(itemId)),
        updateItem: (itemId, item) => dispatch(updateItem(itemId, item)),
    };
}
