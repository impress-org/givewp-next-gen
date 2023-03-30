import {compose} from "@wordpress/compose";
import withButtons from "./withButtons";
import withText from "./withText";
import withDefaults from "./withDefaults";

type Placement = 'top'|'top-start'|'top-end'|'bottom'|'bottom-start'|'bottom-end'|'right'|'right-start'|'right-end'|'left'|'left-start'|'left-end';

export default Object.values(compose(
    withText,
    withButtons,
    withDefaults({
        canClickTarget: false,
        scrollTo: false,
        cancelIcon: {
            enabled: false,
        },
        arrow: false,
    }),
)([
    {
        id: 'welcome',
        title: 'Welcome to the visual donation form builder!',
        text: 'The following is a quick (less than a minute) tour of the visual donation form builder, to introduce the tools for creating engaging donation forms.',
    },
    {
        id: 'canvas',
        attachTo: { element: '#FormBlocksCanvas', on: 'right-start' as Placement },
        title: 'Canvas',
        text: 'Add, reorder, and edit blocks and sections here to make up your form.',
    },
    {
        id: 'section',
        attachTo: { element: '.block-editor-block-list__layout .wp-block > div', on: 'right-start' as Placement },
        title: 'Form Sections',
        text: 'Forms are broken into sections, which contain blocks for fields or content.',
        modalOverlayOpeningRadius: 5, // Match the border radius of the section block element
    },
    {
        id: 'addButton',
        attachTo: { element: '#AddBlockButtonContainer', on: 'bottom' as Placement },
        title: 'Sidebar Toggles',
        text: 'These two buttons give you the ability to add and reorder sections and blocks to the canvas, with drag-and-drop ease.',
    },
    {
        id: 'addBlock',
        attachTo: { element: '.givewp-next-gen-sidebar-secondary', on: 'right-start' as Placement },
        title: 'Quick Inserter',
        text: 'Drag and drop the block you need onto the canvas. Input fields that can only be inserted once are greyed out when in use.',
        beforeShowPromise: function () {
            return new Promise<void>(function (resolve) {
                document.getElementById('AddBlockButtonContainer').querySelector('button').click();
                resolve();
            });
        },
    },
    {
        id: 'editingABlock',
        attachTo: { element: '.givewp-next-gen-sidebar-primary', on: 'left-start' as Placement },
        title: 'Block Settings',
        text: 'Select a block to edit the settings for that individual block on the Block tab of the editor. Settings will vary depending on the type of block selected.',
        beforeShowPromise: function () {
            return new Promise<void>(function (resolve) {
                document.dispatchEvent(new CustomEvent('selectAmountBlock'));
                resolve();
            });
        },
    },
    {
        id: 'designTab',
        attachTo: { element: '.components-tab-panel__tabs button:last-of-type', on: 'left' as Placement },
        title: 'Design Mode',
        text: 'Select the design tab to switch the canvas into a preview of what the form will look like, and access various settings for the visual aspect of the form.',
        beforeShowPromise: function () {
            return new Promise<void>(function (resolve) {
                // @ts-ignore
                document.querySelector('.components-tab-panel__tabs button:last-of-type').click();
                resolve();
            });
        },
    },
    {
        id: 'formTemplate',
        attachTo: { element: '.components-panel__row', on: 'left-start' as Placement },
        title: 'Form Design',
        text: 'Select the design of the form based on what you need. More form designs are coming soon!',
    },
    {
        id: 'formDesign',
        attachTo: { element: 'iframe', on: 'right-start' as Placement },
        title: 'Live Preview',
        text: 'This shows how your form looks like with the selected form template',
    },
    {
        id: 'editingAFormDesign',
        attachTo: { element: '.givewp-next-gen-sidebar-primary', on: 'left-start' as Placement },
        title: 'Editing a form design',
        text: 'You can customize the appearance (i.e. colors and features) of your form based on the selected form template',
    },
    {
        id: 'congrats',
        title: 'Congrats 🎉',
        text: 'Experience the new visual donation form builder and create the donation form of your dreams',
        beforeShowPromise: function () {
            return new Promise<void>(function (resolve) {
                // @ts-ignore
                document.querySelector('.components-tab-panel__tabs button:first-of-type').click();
                document.getElementById('AddBlockButtonContainer').querySelector('button').click();
                console.log('CONGRAAAATS')
                resolve();
            });
        },
    },
]))
