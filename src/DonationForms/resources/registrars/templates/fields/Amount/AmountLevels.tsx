import {useMemo} from 'react';
import classNames from 'classnames';
import {CurrencySetting} from '@givewp/forms/types';
import {getFloatAmount} from './index';

/**
 * @since 0.2.0
 */
export default function AmountLevels({
    name,
    currency,
    levels,
    onLevelClick,
    currencySettings,
}: {
    name: string;
    currency: string;
    levels: number[];
    currencySettings: CurrencySetting[];
    onLevelClick?: (amount: number) => void;
}) {
    const {useWatch} = window.givewp.form.hooks;
    const amount = useWatch({name});
    const formatter = useMemo(
        () =>
            new Intl.NumberFormat(navigator.language, {
                style: 'currency',
                currency: currency,
            }),
        [currency, navigator.language]
    );

    // Convert level amounts to the selected currency and fallback to original values if no currency setting is found or exchange rate is 0.
    const amountLevels = useMemo(
        () =>
            levels.map((levelAmount) => {
                const currencySetting = currencySettings.find(({id}) => id === currency);

                if (currencySetting !== undefined && currencySetting.exchangeRate !== 0) {
                    levelAmount = getFloatAmount(levelAmount * currencySetting.exchangeRate);
                }

                return getFloatAmount(levelAmount);
            }),
        [currency, levels]
    );

    return (
        <div className="givewp-fields-amount__levels--container">
            {amountLevels.map((levelAmount, index) => {
                const label = formatter.format(Number(levelAmount));
                const selected = levelAmount === amount;
                return (
                    <button
                        className={classNames('givewp-fields-amount__level', {
                            'givewp-fields-amount__level--selected': selected,
                        })}
                        type="button"
                        onClick={() => {
                            onLevelClick(levelAmount);
                        }}
                        key={index}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
}