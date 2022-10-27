import React, {useEffect, useState} from 'react';
import {Storage} from '../../common';

const DesignMode = ({blocks}) => {
    const [sourceDocument, setSourceDocument] = useState('');

    useEffect(() => {
        Storage.preview(blocks).then(setSourceDocument);
    }, [blocks]);

    return (
        <iframe
            srcDoc={sourceDocument}
            style={{
                width: '100%',
                height: '700px',
            }}
        ></iframe>
    );
};

export default DesignMode;
