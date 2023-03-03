import {createInterpolateElement} from "@wordpress/element";
import {__} from "@wordpress/i18n";

/**
 * @unreleased
 */
export default function FixedAmountRecurringMessage({
                                                        isFixed,
                                                        fixedAmount,
                                                        period,
                                                        frequency,
                                                        installments
                                                    }: { isFixed: boolean, fixedAmount: string, period: string, frequency: number, installments: number }) {
    const translatableString = !installments
        ? __('This donation <amount /> every <period />.', 'give')
        : __('This donation <amount /> every <period /> for <count /> <payments />.', 'give');

    const message = createInterpolateElement(translatableString, {
        amount: isFixed ? <span>is <strong>{fixedAmount}</strong></span> : <span>occurs</span>,
        period: <strong>{frequency > 1 ? `${frequency} ${period}s` : period}</strong>,
        count: <strong>{installments}</strong>,
        payments: <strong>payments</strong>,
    });

    return (
        <div className="givewp-fields-amount__fixed-message">
            {message}
        </div>
    )
}