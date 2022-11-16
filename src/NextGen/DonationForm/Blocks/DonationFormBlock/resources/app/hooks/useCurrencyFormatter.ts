import {useMemo} from 'react';

/**
 * @unreleased
 */
export default function useCurrencyFormatter(currency: string, options?: Intl.NumberFormatOptions) {
    return useMemo(
        () =>
            new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: currency,
                ...options
            }),
        [currency, navigator.language]
    );
}

