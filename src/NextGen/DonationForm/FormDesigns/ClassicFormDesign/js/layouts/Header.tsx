import {__} from '@wordpress/i18n';

/**
 * @since 0.1.0
 */
const SecureBadge = () => {
    return (
        <aside className="givewp-form-secure-badge">
            <svg className="givewp-form-secure-icon">
                <path
                    d="M9.375 5.75h-.563V4.062C8.813 2.117 7.196.5 5.25.5a3.576 3.576 0 0 0-3.563 3.563V5.75h-.562C.492 5.75 0 6.266 0 6.875v4.5A1.11 1.11 0 0 0 1.125 12.5h8.25c.61 0 1.125-.492 1.125-1.125v-4.5A1.14 1.14 0 0 0 9.375 5.75Zm-2.438 0H3.563V4.062c0-.914.75-1.687 1.688-1.687.914 0 1.688.773 1.688 1.688V5.75Z"
                    fill="currentColor"
                />
            </svg>
            {__('100% Secure Donation', 'give')}
        </aside>
    );
};

/**
 * @since 0.1.0
 */
export default function Header({Title, Description, Goal}) {
    return (
        <>
            <Title />
            <Description />
            <SecureBadge />
            <Goal />
        </>
    );
}


