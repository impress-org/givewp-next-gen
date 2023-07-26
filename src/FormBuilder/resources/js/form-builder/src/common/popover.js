export default function popover() {
    window.addEventListener('wheel', (event) => {
        const popover = document.querySelector('.components-popover.block-editor-block-popover');

        if (!!popover) {
            const {top} = popover.getBoundingClientRect();

            if (top < 130) {
                const top = Math.sign(event.deltaY) + 1;
                popover.style.top = top + 'rem';
            } else {
                popover.style.top = '0rem';
            }
        }
    });
}
