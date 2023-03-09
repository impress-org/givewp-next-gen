import {__, _n} from '@wordpress/i18n';

import LevelGrid from './level-grid';
import LevelButton from './level-buttons';
import Inspector from './inspector';
import periodLookup from './period-lookup';
import {CurrencyControl, formatCurrencyAmount} from '../../../common/currency';
import {createInterpolateElement} from '@wordpress/element';
import {RadioControl} from '@wordpress/components';
import Notice from './notice';
import {useState} from 'react';
import {getFormBuilderData} from "@givewp/form-builder/common/getWindowData";



const Edit = ({attributes, setAttributes}) => {
    const {
        levels,
        priceOption,
        setPrice,
        customAmount,
        customAmountMin,
        customAmountMax,
        recurringEnabled,
        recurringDonationChoice,
        recurringBillingInterval,
        recurringBillingPeriod,
        recurringBillingPeriodOptions,
        recurringLengthOfTime,
        recurringOptInDefaultBillingPeriod,
    } = attributes;

    const {gateways} = getFormBuilderData();
    const isRecurringSupported = gateways.some((gateway) => gateway.supportsSubscriptions);
    const isRecurring = isRecurringSupported && recurringEnabled;

    const isMultiLevel = priceOption === 'multi';
    const isFixedAmount = priceOption === 'set';
    const isRecurringAdmin = isRecurring && 'admin' === recurringDonationChoice;
    const isRecurringDonor = isRecurring && 'donor' === recurringDonationChoice;
    const amountFormatted = formatCurrencyAmount(setPrice);

    const DonationLevels = () => (
        <LevelGrid>
            {levels.map((level, index) => {
                const levelAmount = formatCurrencyAmount(level);

                return <LevelButton key={index}>{levelAmount}</LevelButton>;
            })}
        </LevelGrid>
    );

    const CustomAmount = () => (
        <CurrencyControl value={setPrice} label={__('Custom amount', 'give')} hideLabelFromVision />
    );

    const FixedPriceMessage = () => (
        <Notice>
            {createInterpolateElement(__('This donation is set to <amount/> for this form.', 'give'), {
                amount: <strong>{amountFormatted}</strong>,
            })}
        </Notice>
    );

    const RecurringPeriod = ({count}) => {
        const interval = count ?? recurringBillingInterval;

        const singular = !isRecurringDonor
            ? periodLookup[recurringBillingPeriod].singular
            : periodLookup[recurringOptInDefaultBillingPeriod ?? 'month'].singular;

        const plural = !isRecurringDonor
            ? periodLookup[recurringBillingPeriod].plural
            : periodLookup[recurringOptInDefaultBillingPeriod ?? 'month'].plural;

        return (
            <strong>
                {1 === interval && <>{singular}</>}
                {1 !== interval && (
                    <>
                        {interval} {plural}
                    </>
                )}
            </strong>
        );
    };

    const RecurringMessage = () => {

        const interval = parseInt(recurringBillingInterval);

        const periodPlaceholder = <strong>{'[' + _n('period', 'periods', interval, 'give') + ']'}</strong>;

        const count = parseInt(recurringLengthOfTime);
        const countElement = <strong>{count}</strong>;

        const translatableString = !count
            ? __('This donation occurs every <period />.', 'give')
            : __('This donation occurs every <period /> for <count /> <strong>payments</strong>.', 'give');

        return (
            <Notice>
                { 'one-time' === recurringOptInDefaultBillingPeriod
                    ? __('You have chosen to make this donation one-time.', 'give')
                    : createInterpolateElement(translatableString, {
                        period: <RecurringPeriod count={interval} />,
                        count: countElement,
                        strong: <strong />, // Required to interpolate the strong tag around the "payments" text.
                    })
                }
            </Notice>
        );
    };

    const FixedRecurringMessage = () => (
        <Notice>
            {createInterpolateElement(__('This donation is <amount/> every <period/>. ', 'give'), {
                amount: <strong>{amountFormatted}</strong>,
                period: <RecurringPeriod count={parseInt(recurringBillingInterval)} />,
            })}
        </Notice>
    );

    const BillingPeriodControl = ({options}) => {
        const [option, setOption] = useState(options[0]);
        return (
            <RadioControl
                className={'give-billing-period-control'}
                label={__('Billing Period', 'give')}
                hideLabelFromVision={true}
                selected={option}
                options={['one-time'].concat(options).map((option) => {
                    return {
                        label: 'one-time' === option ? __('One Time', 'give') : periodLookup[option].adjective,
                        value: option,
                    };
                })}
                onChange={(value) => setOption(value)}
            />
        );
    };

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            {isRecurringDonor && <BillingPeriodControl options={recurringBillingPeriodOptions} />}

            {isMultiLevel && <DonationLevels />}
            {customAmount && <CustomAmount />}

            {isMultiLevel && isRecurring && <RecurringMessage />}

            {isFixedAmount && isRecurring && <FixedRecurringMessage />}
            {isFixedAmount && !isRecurring && !customAmount && <FixedPriceMessage />}

            <Inspector attributes={attributes} setAttributes={setAttributes} />
        </div>
    );
};

export default Edit;
