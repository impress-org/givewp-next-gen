import {DonationSummaryLineItem} from '../../registrars/templates/elements/DonationSummary';

const UPDATE_DEFAULT_VALUES = 'update_default_values';
const ADD_DONATION_SUMMARY_ITEMS = 'add_donation_summary_items';
const ADD_DONATION_SUMMARY_ITEM = 'add_donation_summary_item';
const REMOVE_DONATION_SUMMARY_ITEM = 'remove_donation_summary_item';

/**
 * @unreleased
 */
export default function reducer(state, action) {
    switch (action.type) {
        case UPDATE_DEFAULT_VALUES:
            return {
                ...state,
                defaultValues: {
                    ...state.values,
                    ...action.values,
                },
            };

        case ADD_DONATION_SUMMARY_ITEMS:
            return {
                ...state,
                donationSummary: [
                    ...state.donationSummary.filter((item) => !action.items.find((i) => i.id === item.id)),
                    ...action.items,
                ],
            };

        case ADD_DONATION_SUMMARY_ITEM:
            return {
                ...state,
                donationSummary: [...state.donationSummary.filter((item) => action.item.id !== item.id), action.item],
            };

        case REMOVE_DONATION_SUMMARY_ITEM:
            return {
                ...state,
                donationSummary: state.donationSummary.filter((item) => action.itemId !== item.id),
            };

        default:
            return state;
    }
}

/**
 * @unreleased
 */
export function setFormDefaultValues(values: object) {
    return {
        type: UPDATE_DEFAULT_VALUES,
        values,
    };
}

/**
 * @unreleased
 */
export function addDonationSummaryItems(items: DonationSummaryLineItem[]) {
    return {
        type: ADD_DONATION_SUMMARY_ITEMS,
        items,
    };
}

/**
 * @unreleased
 */
export function addDonationSummaryItem(item: DonationSummaryLineItem) {
    return {
        type: ADD_DONATION_SUMMARY_ITEM,
        item,
    };
}

/**
 * @unreleased
 */
export function removeDonationSummaryItem(itemId: string) {
    return {
        type: REMOVE_DONATION_SUMMARY_ITEM,
        itemId,
    };
}