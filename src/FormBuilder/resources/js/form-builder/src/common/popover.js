export default function popover() {
    window.addEventListener('wheel', (event) => {
        const popover = document.querySelector('.components-popover.block-editor-block-popover');

        if (!!popover) {
            const {top} = popover.getBoundingClientRect();

            if (top < 130) {
                const styleTop = Math.sign(event.deltaY) + 1;
                popover.style.top = styleTop + 'rem';
            } else {
                popover.style.top = '0rem';
            }
        }
    });
}
