import {getDescriptionTemplate, getGoalTemplate, getHeaderTemplate, getTitleTemplate} from '../templates';
import getWindowData from '../utilities/getWindowData';
import {GoalType} from '@givewp/blocks/form/app/templates/layouts/Goal';

const {form} = getWindowData();

const HeaderTemplate = getHeaderTemplate();
const TitleTemplate = getTitleTemplate();
const DescriptionTemplate = getDescriptionTemplate();
const GoalTemplate = getGoalTemplate();

/**
 * @unreleased
 */
export default function Header() {
    return (
        <HeaderTemplate
            Title={() => (form.settings?.showHeading ? <TitleTemplate text={form.settings.heading} /> : <></>)}
            Description={() =>
                form.settings?.showDescription ? <DescriptionTemplate text={form.settings.description} /> : <></>
            }
            Goal={() =>
                form.goal?.show ? (
                    <GoalTemplate
                        currency={form.currency}
                        type={form.goal.type as GoalType}
                        goalLabel={form.goal.label}
                        progressPercentage={form.goal.progressPercentage}
                        currentAmount={form.goal.currentAmount}
                        currentAmountFormatted={form.goal.currentAmountFormatted}
                        targetAmount={form.goal.targetAmount}
                        targetAmountFormatted={form.goal.targetAmountFormatted}
                        totalRevenue={form.stats.totalRevenue}
                        totalRevenueFormatted={form.stats.totalRevenueFormatted}
                        totalNumberOfDonationsOrDonors={form.stats.totalNumberOfDonationsOrDonors}
                        totalNumberOfDonationsOrDonorsLabel={form.stats.totalNumberOfDonationsOrDonorsLabel}
                    />
                ) : (
                    <></>
                )
            }
        />
    );
}
