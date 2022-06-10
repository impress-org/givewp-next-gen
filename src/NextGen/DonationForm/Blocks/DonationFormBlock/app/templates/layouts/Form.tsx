import {FormHTMLAttributes, ReactNode} from 'react';
import {__} from '@wordpress/i18n';

export interface FormProps {
    formProps: FormHTMLAttributes<unknown>;
    children: ReactNode;
    formError: string | null;
    isSubmitting: boolean;
}

export default function Form({children, formProps, formError, isSubmitting}: FormProps) {
    return (
        <form {...formProps}>
            {children}
            {formError && (
                <div className="givewp-error" style={{textAlign: 'center'}}>
                    <p className="givewp-error__label">
                        {__('The following error occurred when submitting the form:', 'give')}
                    </p>
                    <p className="givewp-error__message">{formError}</p>
                </div>
            )}
            <button type="submit" disabled={isSubmitting} className="give-next-gen__submit-button">
                {isSubmitting ? __('Submitting…', 'give') : __('Donate', 'give')}
            </button>
        </form>
    );
}
