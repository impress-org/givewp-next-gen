import {__} from '@wordpress/i18n';
import {Button} from '@wordpress/components';
import {close} from '@wordpress/icons';

export default function PopoverHeader({onClose}) {
    return (
        <div className={'givewp-conditional-logic__popover-header'}>
            <h1>{__('Add logic statement', 'give')}</h1>
            <Button onClick={onClose} icon={close} label={__('Close', 'give')} />
        </div>
    );
}
