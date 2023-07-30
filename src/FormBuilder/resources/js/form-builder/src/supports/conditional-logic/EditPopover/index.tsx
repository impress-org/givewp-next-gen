import {useEffect} from '@wordpress/element';
import {Popover} from '@wordpress/components';

import PopoverContent from '@givewp/form-builder/supports/conditional-logic/EditPopover/PopoverContent';
import PopoverHeader from '@givewp/form-builder/supports/conditional-logic/EditPopover/PopoverHeader';
import {labels} from '@givewp/form-builder/supports/conditional-logic/constants';

export default function EditPopover({visible, onClose, setConditionalLogicAttributes, conditionalLogic, fieldOptions}) {
    if (!visible) {
        return null;
    }

    useEffect(() => {
        return onClose;
    }, []);

    const handleAddRule = (): void => {
        setConditionalLogicAttributes({
            rules: [
                ...conditionalLogic.rules,
                {field: fieldOptions[0].value, operator: Object.keys(labels.operators)[0], value: ''},
            ],
        });
    };

    const handleRemoveRule = (index: number) => (): void => {
        setConditionalLogicAttributes({rules: conditionalLogic.rules.filter((rule, ruleIndex) => ruleIndex !== index)});
    };

    const handleUpdateRule =
        (index: number) =>
        (key: 'field' | 'operator' | 'value', value: string): void => {
            const rules = [...conditionalLogic.rules];

            rules[index][key] = value;
            setConditionalLogicAttributes({rules});
        };

    return (
        <Popover placement="left-end" offset={28} variant={'unstyled'} focusOnMount={false}>
            <div className={'givewp-conditional-logic__popover-box'}>
                <PopoverHeader onClose={onClose} />
                <PopoverContent
                    {...{conditionalLogic, handleAddRule, handleUpdateRule, handleRemoveRule, fieldOptions}}
                />
            </div>
        </Popover>
    );
}
