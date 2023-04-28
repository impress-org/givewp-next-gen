import usePreviousStep from '@givewp/forms/app/form/MultiStepForm/hooks/usePreviousStep';
import {useDonationFormMultiStepState} from '@givewp/forms/app/form/MultiStepForm/store';
import {__} from '@wordpress/i18n';

export default function PreviousButton() {
    const {currentStep} = useDonationFormMultiStepState();
    const setPreviousStep = usePreviousStep(currentStep);

    return (
        currentStep > 0 && (
            <button type="button" onClick={() => setPreviousStep()}>
                {__('Previous', 'give')}
            </button>
        )
    );
}