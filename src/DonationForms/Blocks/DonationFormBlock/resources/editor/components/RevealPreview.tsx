import React, {Fragment, useState} from 'react';
import {__} from '@wordpress/i18n';
import IframeResizer from 'iframe-resizer-react';

/**
 * @unreleased
 */
export default function RevealPreview({enableIframe, formId}: any) {
    const [isRevealed, setIsRevealed] = useState(false);

    const revealForm = () => {
        setIsRevealed(!isRevealed);
    };

    return (
        <Fragment>
            <button onClick={revealForm} className={'givewp-form-block__display-button'}>
                {__('Donate now', 'give')}
            </button>

            {isRevealed && (
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
            )}
        </Fragment>
    );
}
