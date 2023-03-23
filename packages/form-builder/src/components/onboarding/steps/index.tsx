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
        title: 'Welcome to the new visual donation form builder',
        text: 'We’ll take you through a quick tour of the new visual donation form builder. This will take less than a minute.',
    },
    {
        id: 'canvas',
        attachTo: { element: '#FormBlocksCanvas', on: 'right-start' as Placement },
        title: 'Canvas',
        text: 'This is where you add and edit various blocks and sections to make up your form.',
    },
    {
        id: 'section',
        attachTo: { element: '.block-editor-block-list__layout .wp-block > div', on: 'right-start' as Placement },
        title: 'Section',
        text: 'This houses the form fields and content.',
        modalOverlayOpeningRadius: 5, // Match the border radius of the section block element
    },
    {
        id: 'addButton',
        attachTo: { element: '#AddBlockButtonContainer', on: 'bottom' as Placement },
        title: 'Add button',
        text: 'This toggles the sidebar and quick inserter for section and blocks for the form',
    },
    {
        id: 'addBlock',
        attachTo: { element: '.givewp-next-gen-sidebar-secondary', on: 'right-start' as Placement },
        title: 'Add section/block',
        text: 'You can drag and drop any block of your choosing on the canvas.',
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
        title: 'Editing a block',
        text: 'You can edit the structure of a block in a section. For eg. the “Donation Amount and Levels” is the block being edited here',
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
        title: 'Design tab',
        text: 'This is where you get to see and edit the appearance of your form',
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
        title: 'Form template',
        text: 'Select from an array of available form template options here. More template options are being developed now!',
    },
    {
        id: 'formDesign',
        attachTo: { element: 'iframe', on: 'right-start' as Placement },
        title: 'Form design',
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
