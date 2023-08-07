import {__} from '@wordpress/i18n';
import {useEffect} from '@wordpress/element';
import {Button, Popover} from '@wordpress/components';
import {close} from '@wordpress/icons';

import './styles.scss';

type Props = {
    title: string;
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export default function StyledPopover({title, visible, onClose, children}: Props) {
    if (!visible) {
        return null;
    }

    useEffect(() => {
        return onClose;
    }, []);

    return (
        <Popover placement="left-end" variant={'unstyled'} focusOnMount={false}>
            <div className={'give-ffm-popover__box'}>
                <div className={'give-ffm-popover__header'}>
                    <h1>{title}</h1>
                    <Button onClick={onClose} icon={close} label={__('Close', 'give')} />
                </div>
                <div className={'give-ffm-popover__content'}>{children}</div>
            </div>
        </Popover>
    );
}
