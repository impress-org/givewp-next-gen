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
            <button
                style={{
                    color: '#fff',
                    background: '#2271b1',
                    padding: '.5rem 1rem',
                    cursor: 'pointer',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '1rem',
                }}
                onClick={toggleModal}
            >
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
                            width: '100%',
                            maxWidth: 'min(100%, 51.5rem)',
                            height: '50vh',
                            padding: '0',
                            border: 'none',
                            overflowY: 'scroll',
                            zIndex: 999,
                        }}
                    >
                        <div onClick={toggleModal}>Close</div>
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
