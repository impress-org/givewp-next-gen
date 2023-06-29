import type {BillingAddressProps} from '@givewp/forms/propTypes';

export default function BillingAddress({
    fields: {country: Country, address1: Address1, address2: Address2, city: City, state: State, zip: Zip},
}: BillingAddressProps) {
    stateSelector();

    return (
        <>
            <Country />
            <Address1 />
            <Address2 />
            <City />
            <State />
            <Zip />
        </>
    );
}

function stateSelector() {
    const methods = window.givewp.form.hooks.useFormContext();

    const {getValues, setValue} = methods;

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
        const defaultStateInput = document.querySelector(
            '.givewp-groups-billingAddress-billingAddress .givewp-fields-text-state input'
        );
        addLoadingStatus(defaultStateInput);
        removeStateSelectField();

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
                    addStateSelectField(defaultStateInput, responseJson.data);
                    hideDefaultStateInput(defaultStateInput);
                } else {
                    showDefaultStateInput(defaultStateInput);
                }
                removeLoadingStatus();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function addStateSelectField(defaultStateInput, select) {
        defaultStateInput.parentElement.insertAdjacentHTML('afterend', select);

        document
            .querySelector('.givewp-groups-billingAddress-billingAddress .givewp-fields-text-state select')
            .addEventListener('change', updateDefaultStateInput);
    }

    function updateDefaultStateInput(e) {
        console.log('[*CHANGE BEFORE*] BillingAddressStateSelector', getValues());
        setValue('state', e.target.value);
        console.log('[*CHANGE AFTER*] BillingAddressStateSelector', getValues());
    }

    function removeStateSelectField() {
        const selectStateInput = document.querySelector(
            '.givewp-groups-billingAddress-billingAddress .givewp-fields-text-state select'
        );

        if (!!selectStateInput) {
            selectStateInput.remove();
        }
    }

    function addLoadingStatus(defaultStateInput) {
        const loadingStateInput =
            '<input type="text" id="loading_states" name="loading_states" class="loading_states give-input" placeholder="Loading..." disabled="disabled"/>';
        showDefaultStateInput(defaultStateInput);
        defaultStateInput.parentElement.insertAdjacentHTML('afterend', loadingStateInput);
        hideDefaultStateInput(defaultStateInput);
    }

    function removeLoadingStatus() {
        document.querySelector('#loading_states').remove();
    }

    function hideDefaultStateInput(defaultStateInput) {
        defaultStateInput.style.display = 'none';
    }

    function showDefaultStateInput(defaultStateInput) {
        defaultStateInput.value = '';
        defaultStateInput.style.display = 'block';
    }
}

async function getStates(country) {
    return await fetch('https://givewp.local/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        body: 'action=give_get_states&field_name=state_selector&country=' + country,
    });
}
