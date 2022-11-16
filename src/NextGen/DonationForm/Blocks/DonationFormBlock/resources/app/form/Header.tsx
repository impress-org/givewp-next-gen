import {getDescriptionTemplate, getGoalTemplate, getHeaderTemplate, getTitleTemplate} from '../templates';
import {__} from '@wordpress/i18n';

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
            Title={() => <TitleTemplate text={__('Support Our Cause', 'give')} />}
            Description={() => (
                <DescriptionTemplate
                    text={__(
                        'Help our organization by donating today! All donations go directly to making a difference for our cause.',
                        'give'
                    )}
                />
            )}
            Goal={() => (
                <GoalTemplate currency="USD" type="amount" currentValue={900} goalValue={1000} totalValue={129} />
            )}
        />
    );
}
