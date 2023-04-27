import {useDonationFormMultiStepStateDispatch} from '@givewp/forms/app/form/MultiStepForm/store';
import {setCurrentStep} from '@givewp/forms/app/form/MultiStepForm/store/reducer';

export default function usePreviousStep(currentStep) {
    const dispatchMultiStep = useDonationFormMultiStepStateDispatch();
    const previousStep = currentStep - 1;

    return () => {
        if (previousStep <= 0) {
            dispatchMultiStep(setCurrentStep(0));
        } else {
            dispatchMultiStep(setCurrentStep(previousStep));
        }
    };
}