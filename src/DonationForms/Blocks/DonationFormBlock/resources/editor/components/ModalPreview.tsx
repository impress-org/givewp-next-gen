import React, {Fragment, useState} from 'react';
import {__} from '@wordpress/i18n';
import {createPortal} from 'react-dom';
import IframeResizer from 'iframe-resizer-react';

/**
 * @unreleased
 */
export default function ModalPreview({enableIframe, formId}) {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Fragment>
            <button onClick={openModal} className={'givewp-form-block__display-button'}>
                {__('Donate now', 'give')}
            </button>
            {isOpen &&
                createPortal(
                    <dialog
                        open={true}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'transparent',
                            zIndex: 999,
                        }}
                    >
                        <IframeResizer
                            src={`/?givewp-route=donation-form-view&form-id=${formId}`}
                            checkOrigin={false}
                            style={{
                                width: '1px',
                                minWidth: '100%',
                                border: '0',
                                pointerEvents: enableIframe,
                            }}
                        />
                    </dialog>,
                    document.body
                )}
        </Fragment>
    );
}
