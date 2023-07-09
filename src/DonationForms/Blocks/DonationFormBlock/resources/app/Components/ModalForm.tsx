import React, {Fragment, useState} from 'react';
import {createPortal} from 'react-dom';
import IframeResizer from 'iframe-resizer-react';

import '../../editor/styles/index.scss';

/**
 * @unreleased
 */
export default function ModalForm({dataSrc, embedId, openFormButton}) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <Fragment>
            <button className={'givewp-form-block__display-button'} onClick={toggleModal}>
                {openFormButton}
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
                            borderRadius: '1rem',
                            width: '100%',
                            maxWidth: 'min(100%, 52rem)',
                            height: '100%',
                            maxHeight: '80vh',
                            padding: '0.25rem 0 0',
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
                                background: '#fff',
                                color: '#333',
                                fontSize: '2rem',
                                width: '3rem',
                                height: '3rem',
                                position: 'absolute',
                                top: '1.5rem',
                                right: '1.5rem',
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
