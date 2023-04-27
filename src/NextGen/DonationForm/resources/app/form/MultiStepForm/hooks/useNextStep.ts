import {useDonationFormMultiStepStateDispatch} from '@givewp/forms/app/form/MultiStepForm/store';
import {setCurrentStep} from '@givewp/forms/app/form/MultiStepForm/store/reducer';
import {useDonationFormStateDispatch} from '@givewp/forms/app/store';
import {setFormDefaultValues} from '@givewp/forms/app/store/reducer';

export default function useNextStep(currentStep) {
    const dispatchForm = useDonationFormStateDispatch();
    const dispatchMultiStep = useDonationFormMultiStepStateDispatch();

    return (formValues) => {
        dispatchForm(setFormDefaultValues(formValues));

        dispatchMultiStep(setCurrentStep(currentStep + 1));
    };
}