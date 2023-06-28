declare global {
    interface Window {
        give_global_vars: {
            ajaxurl: string;
        };
    }
}

export default function BillingAddress() {
    // Check if the DOMContentLoaded has already been completed
    if (document.readyState !== 'loading') {
        readyHandler();
    } else {
        document.addEventListener('DOMContentLoaded', readyHandler);
    }
}

function readyHandler() {
    const countrySelect = document.querySelector(
        '.givewp-groups-billingAddress-billingAddress .givewp-fields-select-country select'
    );
    console.log('countrySelect:', countrySelect);

    if (!!countrySelect) {
        countrySelect.addEventListener('change', updateBillingStateField);
    }
}

function updateBillingStateField(e) {
    const defaultStateInput = document.querySelector(
        '.givewp-groups-billingAddress-billingAddress .givewp-fields-text-state input'
    );
    console.log('defaultStateInput:', defaultStateInput);

    const country = e.target.value;
    getStates(country)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw new Error('Fail to load states from ' + country);
        })
        .then((responseJson) => {
            console.log(responseJson);

            if (!!responseJson.states_found) {
                console.log('select: ', responseJson.data);
                defaultStateInput.parentElement.insertAdjacentHTML('afterend', responseJson.data);
                // @ts-ignore
                defaultStateInput.style.display = 'none';
            }
        })
        .catch((error) => {
            console.log(error);
        });
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
