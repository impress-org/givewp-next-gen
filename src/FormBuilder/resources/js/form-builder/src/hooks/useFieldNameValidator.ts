import {useSelect} from '@wordpress/data';

/**
 * @since 0.1.0
 *
 * @returns {*}
 */
export const getFieldNameFrequency = (fieldName: string, fieldNames: string[]) => {
    return fieldNames.filter((name) => name === fieldName).length;
};

export const hasFieldNameConflict = (fieldName: string, fieldNames: string[]) => {
    return fieldNames.some((name) => name === fieldName);
};

/**
 * @unreleased switch hyphens to underscores
 * @since 0.1.0
 *
 * @returns {`${*}-${number|number}`}
 */
export const getFieldNameSuggestion = (name, names) => {
    const [prefix] = name.split(/^(.*)_([0-9]*)$/g).filter(Boolean);
    const similarFieldNames = names.filter((fieldName) => fieldName.startsWith(prefix));
    const increments = similarFieldNames.flatMap((fieldName) => fieldName.split(/^.*_([0-9]*)$/g).filter(Number)) || [
        0,
    ];
    const nextIncrement = increments.length ? Math.max(...increments) + 1 : 1;
    return `${prefix}_${nextIncrement}`;
};

/**
 * @since 0.1.0
 */
export const flattenBlocks = (block) => [block, ...block.innerBlocks.flatMap(flattenBlocks)];

/**
 * @unreleased
 */
const donationModelProperties = [
    'id',
    'formId',
    'formTitle',
    'purchaseKey',
    'donorIp',
    'createdAt',
    'updatedAt',
    'status',
    'type',
    'mode',
    'amount',
    'feeAmountRecovered',
    'exchangeRate',
    'gatewayId',
    'donorId',
    'firstName',
    'lastName',
    'email',
    'subscriptionId',
    'billingAddress',
    'anonymous',
    'levelId',
    'gatewayTransactionId',
    'company',
    'comment',
];

/**
 * @unreleased
 */
const subscriptionModelProperties = [
    'id',
    'donationFormId',
    'createdAt',
    'renewsAt',
    'donorId',
    'period',
    'frequency',
    'installments',
    'transactionId',
    'mode',
    'amount',
    'feeAmountRecovered',
    'status',
    'gatewaySubscriptionId',
    'gatewayId',
];

/**
 * @unreleased
 */
const donorModelProperties = [
    'id',
    'userId',
    'createdAt',
    'name',
    'firstName',
    'lastName',
    'email',
    'prefix',
    'additionalEmails',
    'totalAmountDonated',
    'totalNumberOfDonations',
];

/**
 * @unreleased
 */
const builtInFieldNamesAndMeta = [
    'login',
    'consent',
    'donation-summary',
    'additional_email',
    'subscription_id',
    'fund_id',
];

/**
 * @unreleased
 */
const disallowedFieldNames = [
    ...new Set([
        ...builtInFieldNamesAndMeta,
        ...donationModelProperties,
        ...subscriptionModelProperties,
        ...donorModelProperties,
    ]),
];

/**
 * A hook for validating uniqueness of the 'fieldName' attribute.
 * When a conflict has been found, a new name suggestion will be generated and returned within the array
 *
 * @unreleased name issue with name uniqueness not being reliable; switch hyphens to underscores
 * @since 0.1.0
 *
 * @return {function(fieldName: string): [isUnique: boolean, suggestedName: string]}
 */
const useFieldNameValidator = () => {
    const blocks = useSelect((select) => select('core/block-editor').getBlocks(), []);

    const fieldNames = blocks
        .flatMap(flattenBlocks)
        .map((block) => block.attributes.fieldName)
        .filter((name) => name);

    /**
     * Returns a function that validates a given name against other field names.
     *
     * @param {string} n The name to validate
     * @param {boolean} allowOne Whether to allow a single instance of the name — useful for when a field name is being edited
     */
    return (n, allowOne = false): ValidationSet => {
        if (disallowedFieldNames.includes(n)) {
            return [false, getFieldNameSuggestion(n, fieldNames ?? [])];
        }

        const frequency = getFieldNameFrequency(n, fieldNames ?? []);
        const isUnique = allowOne ? frequency <= 1 : frequency === 0;

        return [isUnique, isUnique ? null : getFieldNameSuggestion(n, fieldNames ?? [])];
    };
};

type ValidationSet = [
    boolean, // validated name is unique
    string // suggested name if not unique
];

export default useFieldNameValidator;
