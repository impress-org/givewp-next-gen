import {useDonationFormMultiStepState} from '@givewp/forms/app/form/MultiStepForm/store';
import useSetNextStep from '@givewp/forms/app/form/MultiStepForm/hooks/useSetNextStep';
import {useFormContext} from 'react-hook-form';
import {__} from '@wordpress/i18n';

/**
 * @unreleased
 */
export default function NextButton() {
    const {steps, currentStep} = useDonationFormMultiStepState();
    const {trigger, getValues} = useFormContext();
    const setNextStep = useSetNextStep();
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
                            setNextStep(currentStep, getValues());
                        }
                    }}
                >
                    {__('Continue')}
                </button>
            </div>
        )
    );
}