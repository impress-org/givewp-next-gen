import {__, _n} from '@wordpress/i18n';

import LevelGrid from './level-grid';
import LevelButton from './level-buttons';
import Inspector from './inspector';
import {CurrencyControl, formatCurrencyAmount} from '../../../common/currency';
import {createInterpolateElement} from '@wordpress/element';
import {RadioControl} from '@wordpress/components';
import Notice from './notice';
import {useState} from 'react';

const periodLookup = {
    day: {
        singular: __('day', 'give'),
        plural: __('days', 'give'),
        adjective: __('Daily', 'give'),
    },
    week: {
        singular: __('week', 'give'),
        plural: __('weeks', 'give'),
        adjective: __('Weekly', 'give'),
    },
    month: {
        singular: __('month', 'give'),
        plural: __('months', 'give'),
        adjective: __('Monthly', 'give'),
    },
    quarter: {
        singular: __('quarter', 'give'),
        plural: __('quarters', 'give'),
        adjective: __('Quarterly', 'give'),
    },
    year: {
        singular: __('year', 'give'),
        plural: __('years', 'give'),
        adjective: __('Yearly', 'give'),
    },
};

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
        recurringPeriod,
        recurringBillingInterval,
        recurringBillingPeriod,
        recurringBillingPeriodOptions,
        recurringLengthOfTime,
        recurringOptInDefault,
    } = attributes;

    const isMultiLevel = priceOption === 'multi';
    const isFixedAmount = priceOption === 'set';
    const isRecurringAdmin = recurringEnabled && 'admin' === recurringDonationChoice;
    const isRecurringDonorPreset =
        recurringEnabled && 'donor' === recurringDonationChoice && 'preset' === recurringPeriod;
    const isRecurringDonorChoice =
        recurringEnabled && 'donor' === recurringDonationChoice && 'donor' === recurringPeriod;
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

    const RecurringPeriod = ({count, label}) => {
        const interval = count ?? recurringBillingInterval;

        const singular = !isRecurringDonorChoice
            ? periodLookup[recurringBillingPeriod].singular
            : periodLookup[recurringBillingPeriodOptions[0]].singular;

        const plural = !isRecurringDonorChoice
            ? periodLookup[recurringBillingPeriod].plural
            : periodLookup[recurringBillingPeriodOptions[0]].plural;

        return (
            <strong>
                {1 === interval && <>{label ?? singular}</>}
                {1 !== interval && (
                    <>
                        {interval} {label ?? plural}
                    </>
                )}
            </strong>
        );
    };

    const RecurringMessage = () => {
        const interval = parseInt(recurringBillingInterval);

        const periodPlaceholder = <strong>{'[' + _n('period', 'periods', interval, 'give') + ']'}</strong>;

        const periodElement = !isRecurringDonorChoice ? (
            <RecurringPeriod count={interval} label={periodPlaceholder} />
        ) : (
            <RecurringPeriod count={interval} label={periodPlaceholder} />
        );

        const count = parseInt(recurringLengthOfTime);
        const countElement = <strong>{count}</strong>;

        const translatableString = !count
            ? __('This donation occurs every <period />.', 'give')
            : __('This donation occurs every <period /> for <count /> <strong>payments</strong>.', 'give');

        return (
            <Notice>
                {createInterpolateElement(translatableString, {
                    period: periodElement,
                    count: countElement,
                    strong: <strong />, // Required to interpolate the strong tag around the "payments" text.
                })}
            </Notice>
        );
    };

    const FixedRecurringMessage = () => (
        <Notice>
            {createInterpolateElement(__('This donation is <amount/> every <period/>. ', 'give'), {
                amount: <strong>{amountFormatted}</strong>,
                period: <RecurringPeriod count={parseInt(recurringBillingInterval)} label={undefined} />,
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
            {isRecurringDonorChoice && <BillingPeriodControl options={recurringBillingPeriodOptions} />}
            {isRecurringDonorPreset && <BillingPeriodControl options={[recurringBillingPeriod]} />}

            {isMultiLevel && <DonationLevels />}
            {customAmount && <CustomAmount />}

            {isMultiLevel && recurringEnabled && <RecurringMessage />}

            {isFixedAmount && isRecurringAdmin && <FixedRecurringMessage />}
            {isFixedAmount && isRecurringDonorChoice && <FixedRecurringMessage />}
            {isFixedAmount && !isRecurringAdmin && !isRecurringDonorChoice && !customAmount && <FixedPriceMessage />}

            <Inspector attributes={attributes} setAttributes={setAttributes} />
        </div>
    );
};

export default Edit;
