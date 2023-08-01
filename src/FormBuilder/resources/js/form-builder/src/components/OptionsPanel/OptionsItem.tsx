import cn from 'classnames';
import {__} from '@wordpress/i18n';
import {Button, Icon} from '@wordpress/components';

import {draggable, minusCircle} from './icons';
import styles from './editor.module.scss';
import {OptionsItemProps} from './types';

export default function OptionsItem({
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
        <div className={styles.optionsListItem} ref={provided.innerRef} {...provided.draggableProps}>
            <span className={styles.optionsListItemDraggable} {...provided.dragHandleProps}>
                <Icon icon={draggable} />
            </span>
            <input
                type={multiple ? 'checkbox' : 'radio'}
                checked={option.checked}
                className={styles.optionsListItemChecked}
                onClick={() => handleUpdateOptionChecked(!option.checked)}
            />
            <div
                className={cn(styles.optionsListItemInputs, {
                    [styles.optionsListItemInputsOpen]: showValues,
                })}
            >
                <input
                    type={'text'}
                    value={option.label}
                    placeholder={__('Label', 'give-form-field-manager')}
                    onChange={(event) => handleUpdateOptionLabel(event.target.value)}
                />
                {showValues && (
                    <input
                        type={'text'}
                        value={option.value}
                        placeholder={__('Value', 'give-form-field-manager')}
                        onChange={(event) => handleUpdateOptionValue(event.target.value)}
                    />
                )}
            </div>
            <Button icon={minusCircle} className={styles.optionsListItemButton} onClick={() => handleRemoveOption()} />
        </div>
    );
}
