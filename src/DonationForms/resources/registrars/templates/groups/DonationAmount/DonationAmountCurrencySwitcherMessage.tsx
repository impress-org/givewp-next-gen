import {CurrencySwitcherSetting} from '@givewp/forms/types';
import {__} from '@wordpress/i18n';

type CurrencySwitcherMessageProps = {
    message: string;
    baseCurrency: string;
    newCurrencyRate: string;
    newCurrency: string;
};
type DonationAmountCurrencySwitcherMessageProps = {
    currencySettings: CurrencySwitcherSetting[];
    message: string;
};

/**
 * @unreleased
 */
const CurrencySwitcherMessage = ({
    message,
    baseCurrency,
    newCurrencyRate,
    newCurrency,
} : CurrencySwitcherMessageProps) => {
    if (baseCurrency === newCurrency) {
        return;
    }

    const templateTags = {
        base_currency: baseCurrency,
        new_currency_rate: newCurrencyRate,
        new_currency: newCurrency,
    };

    Object.keys(templateTags).forEach((key) => {
        message = message.replace(`{${key}}`, templateTags[key]);
    });

    return <div className="givewp-fields-amount__currency-switcher-message">{__(message, 'give')}</div>;
}

/**
 * @unreleased
 */
export default function DonationAmountCurrencySwitcherMessage({
    currencySettings,
    message,

}: DonationAmountCurrencySwitcherMessageProps ) {
    const {useWatch, useCurrencyFormatter} = window.givewp.form.hooks;
    const currency = useWatch({name: 'currency'});
    const newCurrencyFormatter = useCurrencyFormatter(currency);

    // TODO: add base currency identifier to currencySettings
    const baseCurrency = currencySettings.find((setting) => setting.exchangeRate === 0)?.id ?? 'USD';

    const baseCurrencyFormatter = useCurrencyFormatter(baseCurrency);

    const newCurrencyRate =
        currencySettings.find((setting) => setting.id === currency)?.exchangeRate.toFixed(2) ?? '1.00';

    return (
        <CurrencySwitcherMessage
            baseCurrency={baseCurrency}
            message={message.replace('1.00', baseCurrencyFormatter.format(1))}
            newCurrency={currency}
            newCurrencyRate={newCurrencyFormatter.format(Number(newCurrencyRate))}
        />
    );
}