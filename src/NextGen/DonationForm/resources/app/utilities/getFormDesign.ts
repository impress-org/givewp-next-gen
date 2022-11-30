import {FormDesign} from '@givewp/forms/types';

/**
 * Get the active form design
 *
 * @unreleased
 */
export default function getFormDesign(): FormDesign {
    return window.givewp.form.designs.get();
}
