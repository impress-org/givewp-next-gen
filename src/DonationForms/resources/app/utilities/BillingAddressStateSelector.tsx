import React from 'react';

declare global {
    interface Window {
        give_global_vars: {
            ajaxurl: string;
        };
    }
}

export default function BillingAddressStateSelector({getValues, setValue}) {
    // Check if the DOMContentLoaded has already been completed
    if (document.readyState !== 'loading') {
        readyHandler();
    } else {
        document.addEventListener('DOMContentLoaded', readyHandler);
    }

    function readyHandler() {
        const countrySelect = document.querySelector(
            '.givewp-groups-billingAddress-billingAddress .givewp-fields-select-country select'
        );

        if (!!countrySelect) {
            countrySelect.addEventListener('change', updateBillingStateField);
        }
    }

    function updateBillingStateField(e) {
        const loadingStateInput =
            '<input type="text" id="loading_states" name="loading_states" class="loading_states give-input" placeholder="Loading..." disabled="disabled"/>';

        const defaultStateInput = document.querySelector(
            '.givewp-groups-billingAddress-billingAddress .givewp-fields-text-state input'
        );

        const selectStateInput = document.querySelector(
            '.givewp-groups-billingAddress-billingAddress .givewp-fields-text-state select'
        );

        if (!!selectStateInput) {
            selectStateInput.remove();
        }

        // @ts-ignore
        defaultStateInput.style.display = 'block';
        defaultStateInput.parentElement.insertAdjacentHTML('afterend', loadingStateInput);
        // @ts-ignore
        defaultStateInput.style.display = 'none';

        const country = e.target.value;
        getStates(country)
            .then((data) => {
                if (data.ok) {
                    return data.json();
                }
                throw new Error('Fail to load states from ' + country);
            })
            .then((responseJson) => {
                if (!!responseJson.states_found) {
                    defaultStateInput.parentElement.insertAdjacentHTML('afterend', responseJson.data);

                    document
                        .querySelector('.givewp-groups-billingAddress-billingAddress .givewp-fields-text-state select')
                        .addEventListener('change', function (e) {
                            console.log('[CHANGE BEFORE] BillingAddressStateSelector', getValues());
                            // @ts-ignore
                            setValue('state', e.target.value);
                            console.log('[CHANGE AFTER] BillingAddressStateSelector', getValues());
                        });
                    // @ts-ignore
                    defaultStateInput.style.display = 'none';
                } else {
                    // @ts-ignore
                    defaultStateInput.value = '';
                    // @ts-ignore
                    defaultStateInput.style.display = 'block';
                }
                document.querySelector('#loading_states').remove();
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

async function getStates(country) {
    return await fetch('https://givewp.local/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        body: 'action=give_get_states&field_name=state&country=' + country,
    });
}
