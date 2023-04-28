import usePreviousStep from '@givewp/forms/app/form/MultiStepForm/hooks/usePreviousStep';
import {useDonationFormMultiStepState} from '@givewp/forms/app/form/MultiStepForm/store';
import {ReactNode} from 'react';

export default function PreviousButton({children}: {children: ReactNode}) {
    const {currentStep} = useDonationFormMultiStepState();
    const setPreviousStep = usePreviousStep(currentStep);

    return (
        currentStep > 0 && (
            <button type="button" onClick={() => setPreviousStep()}>
                {children}
            </button>
        )
    );
}