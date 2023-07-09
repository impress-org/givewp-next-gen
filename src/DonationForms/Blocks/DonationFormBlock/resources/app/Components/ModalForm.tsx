import React, {Fragment} from 'react';
import {useEffect, useRef, useState} from '@wordpress/element';
import {createPortal} from 'react-dom';
import IframeResizer from 'iframe-resizer-react';

import '../../editor/styles/index.scss';

/**
 * @unreleased
 */
export default function ModalForm({dataSrc, embedId, openFormButton}) {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const {current: el} = modalRef;
        if (isOpen) el.showModal();
    }, [isOpen]);

    return (
        <Fragment>
            <button className={'givewp-form-block__display-button'} onClick={toggleModal}>
                {openFormButton}
            </button>
            {isOpen &&
                createPortal(
                    <dialog
                        className={'givewp-donation-form-modal'}
                        ref={modalRef}
                        style={{
                            width: 'fit-content',
                            minWidth: '552px',
                            height: 'fit-content',
                            maxHeight: 'calc(100% - 5rem)',
                            padding: '0',
                            border: 'none',
                            overflowY: 'scroll',
                            zIndex: 999,
                        }}
                    >
                        <div
                            onClick={toggleModal}
                            style={{
                                borderRadius: '0.5rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                background: 'rgba(255, 255, 255, 0.8)',
                                color: '#555',
                                fontSize: '1.5rem',
                                lineHeight: '1',
                                width: '2.5rem',
                                height: '2.5rem',
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                cursor: 'pointer',
                            }}
                        >
                            ×
                        </div>
                        <IframeResizer
                            id={embedId}
                            src={dataSrc}
                            checkOrigin={false}
                            style={{
                                width: '1px',
                                minWidth: '100%',
                                border: 'none',
                                padding: '0 !important',
                                overflowY: 'scroll',
                                background: 'none !important',
                            }}
                        />
                    </dialog>,
                    document.body
                )}
        </Fragment>
    );
}
