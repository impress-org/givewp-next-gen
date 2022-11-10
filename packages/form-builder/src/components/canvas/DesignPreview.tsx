import * as React from 'react';
import {useEffect, useState} from 'react';
import {Spinner} from '@wordpress/components';

import Storage from '@givewp/form-builder/common/storage';

import IframeResizer from 'iframe-resizer-react';
import {useFormState} from '../../stores/form-state';

const DesignPreview = () => {
    const {
        blocks,
        settings: {templateId},
    } = useFormState();
    const [sourceDocument, setSourceDocument] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>();

    useEffect(() => {
        setIsLoading(true);

        Storage.preview(templateId, blocks).then((document) => {
            setSourceDocument(document);
            setIsLoading(false);
        });
    }, [
        templateId,
        JSON.stringify(blocks), // stringify to prevent re-renders caused by object as dep
    ]);

    return isLoading ? (
        <div
            style={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
            }}
        >
            <Spinner />
        </div>
    ) : (
        <IframeResizer
            srcDoc={sourceDocument}
            checkOrigin={false} /** The srcDoc property is not a URL and requires that the origin check be disabled. */
            style={{
                width: '1px',
                minWidth: '100%',
                border: '0',
            }}
        />
    );
};

export default DesignPreview;
