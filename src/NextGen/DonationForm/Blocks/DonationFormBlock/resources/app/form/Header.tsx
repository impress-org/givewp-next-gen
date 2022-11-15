import {getDescriptionTemplate, getGoalTemplate, getHeaderTemplate, getTitleTemplate} from '../templates';

const HeaderTemplate = getHeaderTemplate();
const TitleTemplate = getTitleTemplate();
const DescriptionTemplate = getDescriptionTemplate();
const GoalTemplate = getGoalTemplate();

/**
 * @unreleased
 */
export default function Header()
{
    return (
        <HeaderTemplate
            Title={() => <TitleTemplate  text="Title"/>}
            Description={() => <DescriptionTemplate text="Description" />}
            Goal={() => <GoalTemplate type='amount' currentValue={100} goalValue={1000} />}
        />
    )
}
