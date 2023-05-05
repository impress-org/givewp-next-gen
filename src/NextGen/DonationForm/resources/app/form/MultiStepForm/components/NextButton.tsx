import {useDonationFormMultiStepState} from '@givewp/forms/app/form/MultiStepForm/store';
import useSetNextStep from '@givewp/forms/app/form/MultiStepForm/hooks/useSetNextStep';
import {useFormContext} from 'react-hook-form';
import {__} from '@wordpress/i18n';
import {useMemo} from 'react';
import handleValidationRequest from '@givewp/forms/app/utilities/handleValidationRequest';
import getWindowData from '@givewp/forms/app/utilities/getWindowData';
import useGetGatewayById from '@givewp/forms/app/form/MultiStepForm/hooks/useGetGatewayById';

const {validateUrl} = getWindowData();

/**
 * @unreleased
 */
export default function NextButton() {
    const {steps, currentStep} = useDonationFormMultiStepState();
    const getGateway = useGetGatewayById();
    const fieldNames = useMemo(() => steps.find(({id}) => id === currentStep)?.fields ?? [], [steps, currentStep]);
    const {trigger, getValues, setError} = useFormContext();
    const setNextStep = useSetNextStep();
    const isLastStep = currentStep === steps.length - 1;

    return (
        !isLastStep && (
            <div>
                <button
                    type="button"
                    onClick={async () => {
                        const isClientValid = await trigger(fieldNames);

                        if (!isClientValid) {
                            return;
                        }

                        const values = getValues();

                        const isServerValid = await handleValidationRequest(
                            validateUrl,
                            values,
                            setError,
                            getGateway(values?.gatewayId)
                        );

                        if (isServerValid) {
                            setNextStep(currentStep, values);
                        }
                    }}
                >
                    {__('Continue')}
                </button>
            </div>
        )
    );
}