export default function popover() {
    window.addEventListener('wheel', (event) => {
        const popover = document.querySelector('.components-popover.block-editor-block-popover');

        if (!!popover) {
            const {top} = popover.getBoundingClientRect();

            if (top < 150) {
                const topStyle = Math.sign(event.deltaY) + 1;
                popover.style.top = topStyle + 'rem';
            } else {
                popover.style.top = '0rem';
            }
        }
    });

    window.addEventListener('click', (event) => {
        const popover = document.querySelector('.components-popover.block-editor-block-popover');
        if (!!popover) {
            popover.style.top = '0rem';
        }
    });
}
