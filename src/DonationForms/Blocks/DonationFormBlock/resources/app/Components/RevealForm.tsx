import React, {Fragment, useState} from 'react';
import IframeResizer from 'iframe-resizer-react';

/**
 * @unreleased
 */
export default function RevealForm({dataSrc, embedId, openFormButton}) {
    const [isRevealed, setIsRevealed] = useState(false);

    const revealForm = () => {
        setIsRevealed(!isRevealed);
    };

    return (
        <Fragment>
            <button className={'givewp-donation-form-display__button'} onClick={revealForm}>
                {openFormButton}
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
