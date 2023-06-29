import {__} from '@wordpress/i18n';
import {Interweave} from 'interweave';
import {Button} from '@wordpress/components';

export default function ConsentModal({setShowModal, modalHeading, modalAcceptanceText, agreementText, acceptTerms}) {
    return (
        <dialog
            style={{
                background: 'transparent',
                backdropFilter: 'blur(2px)',
            }}
            open={true}
        >
            <div
                style={{
                    background: 'var(--givewp-shades-white)',
                    padding: '2.5rem 3.5rem',
                    maxWidth: 'calc(min(100%, 51.5rem) - 7rem)',
                    boxShadow: '0 0.25rem 0.5rem 0 rgba(230, 230, 230, 1)',
                    borderRadius: '.25rem',
                }}
            >
                <h2 style={{margin: 0, fontSize: '1.25rem', color: 'var(--givewp-primary-color)'}}>{modalHeading}</h2>
                <Interweave content={agreementText} />
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        marginTop: '1rem',
                    }}
                >
                    <Button variant={'secondary'} onClick={() => setShowModal(false)}>
                        {__('Cancel', 'give')}
                    </Button>
                    <Button onClick={acceptTerms}>{modalAcceptanceText}</Button>
                </div>
            </div>
        </dialog>
    );
}
