import {useDonationFormMultiStepState} from '@givewp/forms/app/form/MultiStepForm/store';
import useNextStep from '@givewp/forms/app/form/MultiStepForm/hooks/useNextStep';
import {useFormContext} from 'react-hook-form';
import {__} from '@wordpress/i18n';

export default function NextButton() {
    const {steps, currentStep} = useDonationFormMultiStepState();
    const {trigger, getValues} = useFormContext();
    const setNextStep = useNextStep(currentStep);
    const isLastStep = currentStep === steps.length - 1;
    const fieldNames = steps.find(({id}) => id === currentStep)?.fields ?? [];

    return (
        !isLastStep && (
            <div>
                <button
                    type="button"
                    onClick={async () => {
                        const valid = await trigger(fieldNames);

                        if (valid) {
                            setNextStep(getValues());
                        }
                    }}
                >
                    {__('Continue')}
                </button>
            </div>
        )
    );
}