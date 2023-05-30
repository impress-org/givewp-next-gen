import {
    DonationSummaryLineItem,
    useDonationSummaryContext,
    useDonationSummaryDispatch,
} from '@givewp/forms/app/store/donation-summary';
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
        addItem: (item: DonationSummaryLineItem) => dispatch(addItem(item)),
        removeItem: (itemId: string) => dispatch(removeItem(itemId)),
        addToTotal: (itemId: string, amount: number) => dispatch(addAmountToTotal(itemId, amount)),
        removeFromTotal: (itemId: string) => dispatch(removeAmountFromTotal(itemId)),
    };
}
