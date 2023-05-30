import {DonationSummaryLineItem} from '@givewp/forms/app/store/donation-summary/index';

const ADD_ITEMS = 'add_items';
const ADD_ITEM = 'add_item';
const REMOVE_ITEM = 'remove_item';
const UPDATE_ITEM = 'update_item';
const ADD_AMOUNT_TO_TOTAL = 'add_amount_to_total';
const SUBTRACT_AMOUNT_FROM_TOTAL = 'subtract_amount_from_total';

/**
 * @unreleased
 */
export default function reducer(draft, action) {
    switch (action.type) {
        case ADD_ITEM:
            const addItemIndex = draft.items.findIndex((item) => item.id === action.item.id);
            if (addItemIndex !== -1) draft.items.splice(addItemIndex, 1);

            draft.items.push(action.item);
            break;

        case ADD_AMOUNT_TO_TOTAL:
            draft.totals[action.itemId] = action.amount;
            break;
        case SUBTRACT_AMOUNT_FROM_TOTAL:
            delete draft.totals[action.itemId];
            break;
        case REMOVE_ITEM:
            const removeItemIndex = draft.items.findIndex((item) => item.id === action.itemId);
            if (removeItemIndex !== -1) draft.items.splice(removeItemIndex, 1);
            break;

        case UPDATE_ITEM:
            const updateItemIndex = draft.items.findIndex((item) => item.id === action.itemId);
            if (updateItemIndex !== -1){
                draft.items[updateItemIndex] = {...draft.items[updateItemIndex], ...action.item};
            }
            break;
        default:
            break;
    }
}

/**
 * @unreleased
 */
export function addItems(items: DonationSummaryLineItem[]) {
    return {
        type: ADD_ITEMS,
        items,
    };
}

/**
 * @unreleased
 */
export function addItem(item: DonationSummaryLineItem) {
    return {
        type: ADD_ITEM,
        item,
    };
}

/**
 * @unreleased
 */
export function addAmountToTotal(itemId: string, amount: number) {
    return {
        type: ADD_AMOUNT_TO_TOTAL,
        itemId,
        amount,
    };
}

/**
 * @unreleased
 */
export function removeAmountFromTotal(itemId: string) {
    return {
        type: SUBTRACT_AMOUNT_FROM_TOTAL,
        itemId,
    };
}

/**
 * @unreleased
 */
export function removeItem(itemId: string) {
    return {
        type: REMOVE_ITEM,
        itemId,
    };
}

/**
 * @unreleased
 */
export function updateItem(itemId: string, item: Partial<DonationSummaryLineItem>) {
    return {
        type: UPDATE_ITEM,
        itemId,
        item,
    };
}
