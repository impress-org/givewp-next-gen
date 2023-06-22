import React from 'react';
import IframeResizer from 'iframe-resizer-react';
import {useSelect} from '@wordpress/data';

interface BlockPreviewProps {
    formId: number;
    clientId: string;
}

/**
 * @unreleased
 */
export default function BlockPreview({clientId, formId}: BlockPreviewProps) {
    const selectedBlock = useSelect((select) => select('core/block-editor').getSelectedBlock(), []);
    const isBlockSelected = selectedBlock?.clientId === clientId;
    
    const enableIframe = isBlockSelected ? 'auto' : 'none';

    return (
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
    );
}
