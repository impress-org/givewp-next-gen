import usePreviousStep from '@givewp/forms/app/form/MultiStepForm/hooks/usePreviousStep';
import {useDonationFormMultiStepState} from '@givewp/forms/app/form/MultiStepForm/store';
import {ReactNode} from 'react';

/**
 * @unreleased
 */
export default function PreviousButton({children}: {children: ReactNode}) {
    const {currentStep} = useDonationFormMultiStepState();
    const setPreviousStep = usePreviousStep();

    return (
        currentStep > 0 && (
            <button
                className="givewp-donation-form__steps-header-previous-button"
                type="button"
                onClick={() => setPreviousStep(currentStep)}
            >
                {children}
            </button>
        )
    );
}