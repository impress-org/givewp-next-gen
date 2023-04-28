import {useDonationFormMultiStepStateDispatch} from '@givewp/forms/app/form/MultiStepForm/store';
import {setCurrentStep} from '@givewp/forms/app/form/MultiStepForm/store/reducer';
import {useDonationFormStateDispatch} from '@givewp/forms/app/store';
import {setFormDefaultValues} from '@givewp/forms/app/store/reducer';
import {FieldValues} from 'react-hook-form';

export default function useNextStep() {
    const dispatchForm = useDonationFormStateDispatch();
    const dispatchMultiStep = useDonationFormMultiStepStateDispatch();

    return (currentStep: number, formValues: FieldValues) => {
        dispatchForm(setFormDefaultValues(formValues));

        dispatchMultiStep(setCurrentStep(currentStep + 1));
    };
}