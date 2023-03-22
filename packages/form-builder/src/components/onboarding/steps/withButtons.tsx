const withButtons = (steps) => {
    const cancel = {
        classes: 'shepherd-button-secondary',
        text: 'Skip',
        type: 'cancel'
    };
    const next = {
        classes: 'shepherd-button-primary',
        text: 'Next',
        type: 'next'
    }
    const complete = {
        classes: 'shepherd-button-primary',
        text: 'Got it',
        type: 'complete'
    }
    return steps.map((step, index) => {
        const isLastStep = index === steps.length - 1;
        return {...step, ...{
                buttons: isLastStep ? [complete] : [cancel, next]
            }}
    });
}

export default withButtons
