import React from 'react';

import {createRoot, render} from '@wordpress/element';
import RevealForm from './Components/RevealForm';
import ModalForm from './Components/ModalForm';
import IframeResizer from 'iframe-resizer-react';

function DonationFormBlockApp({formFormat, dataSrc, embedId}) {
    if (formFormat === 'reveal') {
        return <RevealForm dataSrc={dataSrc} embedId={embedId} />;
    }

    if (formFormat === 'modal') {
        return <ModalForm dataSrc={dataSrc} embedId={embedId} />;
    }

    return (
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
    );
}

const roots = document.querySelectorAll('.root-data-givewp-embed');

roots.forEach((root) => {
    const dataSrc = root.getAttribute('data-src');
    const embedId = root.getAttribute('data-givewp-embed-id');
    const formFormat = root.getAttribute('data-form-format');

    if (createRoot) {
        createRoot(root).render(<DonationFormBlockApp formFormat={formFormat} dataSrc={dataSrc} embedId={embedId} />);
    } else {
        render(<DonationFormBlockApp formFormat={formFormat} dataSrc={dataSrc} embedId={embedId} />, root);
    }
});
