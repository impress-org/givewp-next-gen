import {useFormContext, useFormState, useWatch} from 'react-hook-form';

/**
 *
 * This mounts data to the window object, so it can be accessed by form designs and add-ons
 *
 * @unreleased
 */
export default function mountWindowData(): void {
    window.givewp.form.hooks = {
        useFormContext,
        useWatch,
        useFormState,
    };
}