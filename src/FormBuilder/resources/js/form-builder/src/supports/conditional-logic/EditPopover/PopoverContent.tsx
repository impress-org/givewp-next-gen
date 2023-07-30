import {Button, SelectControl, TextControl} from '@wordpress/components';
import {__} from '@wordpress/i18n';

import {labels} from '@givewp/form-builder/supports/conditional-logic/constants';
import {minusCircle, plusCircle} from '@givewp/form-builder/supports/conditional-logic/icons';

export default function PopoverContent({
    conditionalLogic,
    handleAddRule,
    handleUpdateRule,
    handleRemoveRule,
    fieldOptions,
}) {
    return (
        <div className={'givewp-conditional-logic__popover-content'}>
            <div className={'givewp-conditional-logic__popover-content__add-rule'}>
                <p>{__('Logic statement', 'give')}</p>
                <Button icon={plusCircle} onClick={handleAddRule} />
            </div>
            <div className={'givewp-conditional-logic__popover-content__rules'}>
                {conditionalLogic.rules.length > 0 ? (
                    conditionalLogic.rules.map((rule, index) => (
                        <div key={index} className={'givewp-conditional-logic__popover-content__rule'}>
                            <SelectControl
                                options={fieldOptions}
                                value={rule.field}
                                onChange={(newValue) => handleUpdateRule(index)('field', newValue)}
                            />
                            <SelectControl
                                value={rule.operator}
                                onChange={(newValue) => handleUpdateRule(index)('operator', newValue)}
                                options={Object.keys(labels.operators).map((operator) => ({
                                    label: labels.operators[operator],
                                    value: operator,
                                }))}
                            />
                            <TextControl
                                placeholder={__('Enter a value', 'give')}
                                value={rule.value}
                                onChange={(newValue) => handleUpdateRule(index)('value', newValue)}
                            />
                            <Button icon={minusCircle} onClick={handleRemoveRule(index)} />
                        </div>
                    ))
                ) : (
                    <p className={'givewp-conditional-logic__popover-content__no-rule'}>
                        {__('No logic statement added yet.', 'give')}{' '}
                        <Button variant={'link'} onClick={handleAddRule}>
                            {__('Add', 'give')}
                        </Button>
                    </p>
                )}
            </div>
        </div>
    );
}
