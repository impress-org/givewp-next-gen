import * as React from 'react';
import {useEffect, useState} from 'react';
import {Storage} from '../../common';
import IframeResizer from 'iframe-resizer-react';

const DesignMode = ({blocks}) => {
    const [sourceDocument, setSourceDocument] = useState('');

    useEffect(() => {
        Storage.preview(blocks).then(setSourceDocument);
    }, [JSON.stringify(blocks)]);

    return !sourceDocument ? (
        'Loading...'
    ) : (
        <IframeResizer
            srcDoc={sourceDocument}
            checkOrigin={false}
            style={{
                width: '1px',
                minWidth: '100%',
                border: '0',
            }}
        />
    );
};

export default DesignMode;
