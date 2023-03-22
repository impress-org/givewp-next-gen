const withButtons = (steps) => {
    const start = {
        classes: 'shepherd-button-primary',
        text: 'Get started',
        type: 'next'
    }
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

        if(index === 0) {
            return {...step, ...{
                buttons: [start]
            }}
        }

        if(index === steps.length - 1) {
            return {...step, ...{
                buttons: [complete]
            }}
        }

        return {...step, ...{
                buttons: [cancel, next]
            }}
    });
}

export default withButtons
