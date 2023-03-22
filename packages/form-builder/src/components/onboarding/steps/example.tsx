export default {
    id: 'canvas',
    attachTo: { element: '#FormBlocksCanvas', on: 'right-start' as 'right-start' },
    canClickTarget: false,
    beforeShowPromise: function () {
        return new Promise<void>(function (resolve) {
            setTimeout(function () {
                console.log('beforeShowPromise resolved');
                resolve();
            }, 500);
        });
    },
    classes: 'custom-class-name-1 custom-class-name-2',
    highlightClass: 'highlight',
    scrollTo: false,
    cancelIcon: {
        enabled: false,
    },
    arrow: false,
    text: 'This is where you add and edit various blocks and sections to make up your form.',
    when: {
        show: () => {
            console.log('show step');
        },
        hide: () => {
            console.log('hide step');
        }
    }
}
