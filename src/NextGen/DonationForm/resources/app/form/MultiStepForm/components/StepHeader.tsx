import useCurrentStep from '@givewp/forms/app/form/MultiStepForm/hooks/useCurrentStep';

export default function StepHeader() {
    const step = useCurrentStep();

    return step.id > 0 && <p>{step.title}</p>;
}