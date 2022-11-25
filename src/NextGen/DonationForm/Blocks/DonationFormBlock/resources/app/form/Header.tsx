import {TemplateWrapper} from '../templates';
import getWindowData from '../utilities/getWindowData';
import type {GoalType} from '@givewp/forms/propTypes';
import amountFormatter from '@givewp/blocks/form/app/utilities/amountFormatter';

const {form} = getWindowData();

const formDesign = window.givewp.form.designs.get();

const HeaderTemplate = formDesign.layouts.header;
const HeaderTitleTemplate = formDesign.layouts.headerTitle;
const HeaderDescriptionTemplate = formDesign.layouts.headerDescription;
const GoalTemplate = formDesign.layouts.goal;

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
        <TemplateWrapper>
            <HeaderTemplate
                Title={() =>
                    form.settings?.showHeading && (
                        <TemplateWrapper>
                            <HeaderTitleTemplate text={form.settings.heading} />
                        </TemplateWrapper>
                    )
                }
                Description={() =>
                    form.settings?.showDescription && (
                        <TemplateWrapper>
                            <HeaderDescriptionTemplate text={form.settings.description} />
                        </TemplateWrapper>
                    )
                }
                Goal={() =>
                    form.goal?.show && (
                        <TemplateWrapper>
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
                        </TemplateWrapper>
                    )
                }
            />
        </TemplateWrapper>
    );
}
