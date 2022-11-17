import {getDescriptionTemplate, getGoalTemplate, getHeaderTemplate, getTitleTemplate} from '../templates';
import getWindowData from '../utilities/getWindowData';

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
            Title={() => form.settings.showHeading && <TitleTemplate text={form.settings.heading}/>}
            Description={() => form.settings.showDescription && <DescriptionTemplate text={form.settings.description}/>}
            Goal={() => form.goal.show &&
                <GoalTemplate
                    currency={form.currency}
                    type={form.goal.type}
                    goalLabel={form.goal.label}
                    progressPercentage={form.goal.progressPercentage}
                    currentValue={form.goal.currentValue}
                    currentValueFormatted={form.goal.currentValueFormatted}
                    targetValue={form.goal.targetValue}
                    targetValueFormatted={form.goal.targetValueFormatted}
                    totalRevenue={form.stats.totalRevenue}
                    totalRevenueFormatted={form.stats.totalRevenueFormatted}
                    totalNumber={form.stats.totalNumber}
                    totalNumberLabel={form.stats.totalNumberLabel}
                />
            }
        />
    );
}
