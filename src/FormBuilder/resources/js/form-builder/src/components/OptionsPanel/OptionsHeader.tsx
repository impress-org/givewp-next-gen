import {__} from '@wordpress/i18n';
import {BaseControl, Button} from '@wordpress/components';

import {plusCircle} from './icons';
import styles from './editor.module.scss';

export default function OptionsHeader({handleAddOption}: {handleAddOption: () => void}) {
    return (
        <div className={styles.optionsHeader}>
            <BaseControl.VisualLabel className={styles.optionsHeaderLabel}>
                {__('Options', 'give-form-field-manager')}
            </BaseControl.VisualLabel>
            <Button icon={plusCircle} className={styles.optionsHeaderButton} onClick={handleAddOption} />
        </div>
    );
}
