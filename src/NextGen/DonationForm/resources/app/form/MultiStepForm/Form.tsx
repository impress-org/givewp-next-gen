import {FormProps} from '@givewp/forms/propTypes';
import {__} from '@wordpress/i18n';

interface Props extends FormProps {
    submitButtonText?: string;
    hideSubmitButton?: boolean;
}

export default function Form({
    children,
    formProps,
    formError,
    isSubmitting,
    submitButtonText = __('Donate', 'give'),
    hideSubmitButton,
}: Props) {
    return (
        <form {...formProps}>
            {children}
            {formError && (
                <div style={{textAlign: 'center'}}>
                    <p>{__('The following error occurred when submitting the form:', 'give')}</p>
                    <p>{formError}</p>
                </div>
            )}
            {!hideSubmitButton && (
                <section className="givewp-layouts givewp-layouts-section">
                    <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
                        {isSubmitting ? __('Submitting…', 'give') : submitButtonText}
                    </button>
                </section>
            )}
        </form>
    );
}
