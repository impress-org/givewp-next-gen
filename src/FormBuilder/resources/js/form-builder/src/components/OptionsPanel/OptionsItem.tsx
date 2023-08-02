import cn from 'classnames';
import {__} from '@wordpress/i18n';
import {Button, Icon} from '@wordpress/components';

import {draggable, minusCircle} from './icons';
//import styles from './editor.module.scss';
import {OptionsItemProps} from './types';
import {CurrencyControl} from '@givewp/form-builder/common/currency';

export default function OptionsItem({
    currency,
    provided,
    option,
    showValues,
    multiple,
    handleUpdateOptionLabel,
    handleUpdateOptionValue,
    handleUpdateOptionChecked,
    handleRemoveOption,
}: OptionsItemProps) {
    return (
        <div className={'optionsListItem'} ref={provided.innerRef} {...provided.draggableProps}>
            <span className={'optionsListItemDraggable'} {...provided.dragHandleProps}>
                <Icon icon={draggable} />
            </span>
            <input
                type={multiple ? 'checkbox' : 'radio'}
                checked={option.checked}
                className={'optionsListItemChecked'}
                onClick={() => handleUpdateOptionChecked(!option.checked)}
            />
            <div
                className={cn('optionsListItemInputs', {
                    ['optionsListItemInputsOpen']: showValues,
                })}
            >
                {currency ? (
                    <CurrencyControl
                        label={__('Donation amount level', 'give')}
                        hideLabelFromVision
                        value={option.value}
                        onValueChange={(value) => {
                            handleUpdateOptionLabel(value);
                            handleUpdateOptionValue(value);
                        }}
                    />
                ) : (
                    <>
                        <input
                            type={'text'}
                            value={option.label}
                            placeholder={__('Label', 'give')}
                            onChange={(event) => handleUpdateOptionLabel(event.target.value)}
                        />

                        {showValues && (
                            <input
                                type={'text'}
                                value={option.value}
                                placeholder={__('Value', 'give')}
                                onChange={(event) => handleUpdateOptionValue(event.target.value)}
                            />
                        )}
                    </>
                )}
            </div>
            <Button icon={minusCircle} className={'optionsListItemButton'} onClick={() => handleRemoveOption()} />
        </div>
    );
}
