import {withTemplateWrapper} from '../templates';
import getWindowData from '../utilities/getWindowData';
import type {GoalType} from '@givewp/forms/propTypes';
import amountFormatter from '@givewp/blocks/form/app/utilities/amountFormatter';
import getFormDesign from '@givewp/blocks/form/app/utilities/getFormDesign';

const {form} = getWindowData();
const formDesign = getFormDesign();

const HeaderTemplate = withTemplateWrapper(formDesign.layouts.header);
const HeaderTitleTemplate = withTemplateWrapper(formDesign.layouts.headerTitle);
const HeaderDescriptionTemplate = withTemplateWrapper(formDesign.layouts.headerDescription);
const GoalTemplate = withTemplateWrapper(formDesign.layouts.goal);

/**
 * @unreleased
 */
const formatGoalAmount = (amount: number) => {
    return amountFormatter(form.currency, {
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * @unreleased
 */
export default function Header() {
    return (
        <HeaderTemplate
            Title={() => form.settings?.showHeading && <HeaderTitleTemplate text={form.settings.heading} />}
            Description={() =>
                form.settings?.showDescription && <HeaderDescriptionTemplate text={form.settings.description} />
            }
            Goal={() =>
                form.goal?.show && (
                    <GoalTemplate
                        currency={form.currency}
                        type={form.goal.type as GoalType}
                        goalLabel={form.goal.label}
                        progressPercentage={form.goal.progressPercentage}
                        currentAmount={form.goal.currentAmount}
                        currentAmountFormatted={
                            form.goal.typeIsMoney
                                ? formatGoalAmount(form.goal.currentAmount)
                                : form.goal.currentAmount.toString()
                        }
                        targetAmount={form.goal.targetAmount}
                        targetAmountFormatted={
                            form.goal.typeIsMoney
                                ? formatGoalAmount(form.goal.targetAmount)
                                : form.goal.targetAmount.toString()
                        }
                        totalRevenue={form.stats.totalRevenue}
                        totalRevenueFormatted={formatGoalAmount(form.stats.totalRevenue)}
                        totalCountValue={form.stats.totalCountValue}
                        totalCountLabel={form.stats.totalCountLabel}
                    />
                )
            }
        />
    );
}
