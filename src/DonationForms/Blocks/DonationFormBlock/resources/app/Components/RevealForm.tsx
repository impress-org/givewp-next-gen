import React, {Fragment, useState} from 'react';

import {__} from '@wordpress/i18n';
import IframeResizer from 'iframe-resizer-react';

import '../../editor/styles/index.scss';

/**
 * @unreleased
 */
export default function RevealForm({dataSrc, embedId}) {
    const [isRevealed, setIsRevealed] = useState(false);

    const revealForm = () => {
        setIsRevealed(!isRevealed);
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
                onClick={revealForm}
            >
                {' '}
                {__('Donate now', 'give')}
            </button>

            {isRevealed && (
                <IframeResizer
                    id={embedId}
                    src={dataSrc}
                    checkOrigin={false}
                    style={{
                        width: '1px',
                        minWidth: '100%',
                        border: '0',
                    }}
                />
            )}
        </Fragment>
    );
}
