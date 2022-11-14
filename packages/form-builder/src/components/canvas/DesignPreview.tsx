import * as React from 'react';
import {useEffect, useState} from 'react';

import Storage from '@givewp/form-builder/common/storage';

import IframeResizer from 'iframe-resizer-react';
import {useFormState} from '../../stores/form-state';
import DesignPreviewLoading from "@givewp/form-builder/components/canvas/DesignPreviewLoading";

const DesignPreview = () => {
    const {blocks, settings: formSettings} = useFormState();
    const [isLoading, setLoading] = useState(true);
    const [sourceDocument, setSourceDocument] = useState(null);
    const [previousPreviewHTML, setPreviousPreviewHTML] = useState(null);

    useEffect(() => {
        setLoading(true);
        Storage.preview({blocks, formSettings}).then((document) => {
            setSourceDocument(document);
        });
    }, [
        JSON.stringify(formSettings),
        JSON.stringify(blocks), // stringify to prevent re-renders caused by object as dep
    ]);

    const iframeStyles = {
        width: '1px',
        minWidth: '100%',
        border: '0',
    }

    return (
        <>
            {isLoading && <DesignPreviewLoading />}
            <IframeResizer
                onLoad={(event) => {
                    const target = event.target as HTMLIFrameElement;
                    setPreviousPreviewHTML(target.contentWindow.document.documentElement.innerHTML)
                    setLoading(false)
                }}
                srcDoc={sourceDocument}
                style={{display: 'none'}}
            />
            <IframeResizer
                srcDoc={previousPreviewHTML}
                checkOrigin={false} /** The srcDoc property is not a URL and requires that the origin check be disabled. */
                style={iframeStyles}
            />
        </>
    )
};

export default DesignPreview;
