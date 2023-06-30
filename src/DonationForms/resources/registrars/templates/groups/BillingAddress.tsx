import type {BillingAddressProps} from '@givewp/forms/propTypes';
import {FC, useEffect, useState} from 'react';
import {__} from '@wordpress/i18n';
import NodeWrapper from '../layouts/NodeWrapper';
import {ErrorMessage} from '@hookform/error-message';
import {useCallback} from '@wordpress/element';

async function getStates(country) {
    return await fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        body: 'action=give_get_states&field_name=state_selector&country=' + country,
    });
}

function StateFieldContainer({state: HiddenStateField}: {state: FC}) {
    const Label = window.givewp.form.templates.layouts.fieldLabel;
    const FieldError = window.givewp.form.templates.layouts.fieldError;
    const {useWatch, useFormContext, useFormState} = window.givewp.form.hooks;
    const {errors} = useFormState();
    const {setValue, clearErrors} = useFormContext();
    const country = useWatch({name: 'country'});
    const [states, setStates] = useState([]);
    const [statesLoading, setStatesLoading] = useState(false);
    const [stateLabel, setStateLabel] = useState('State');
    const [showField, setShowField] = useState(false);
    const [stateRequired, setStateRequired] = useState<boolean>(false);

    const updateStateValue = useCallback(
        (event) => {
            clearErrors('state');
            setValue('state', event.target.value);
        },
        [setValue, clearErrors]
    );

    const fieldError = errors?.state;

    useEffect(() => {
        if (!country) {
            return;
        }

        setStatesLoading(true);
        const response = getStates(country);
        response
            .then((data) => {
                if (data.ok) {
                    setStatesLoading(false);
                    setValue('state', null);

                    return data.json();
                }
                throw new Error('Fail to load states from ' + country);
            })
            .then((responseJson) => {
                setStateLabel(responseJson.state_label);
                setShowField(responseJson.show_field);
                setStateRequired(responseJson.states_require);

                if (responseJson.states_found) {
                    const stateResponse = [];
                    Object.entries(responseJson.states).forEach(([key, value]) => {
                        if (key) {
                            stateResponse.push({value: key, label: value});
                        }
                    });
                    setStates(stateResponse);
                } else {
                    setStates([]);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [country]);

    if (!showField) {
        return <HiddenStateField />;
    }

    if (states.length > 0) {
        return (
            /**
             * TODO: replace with template api component
             */
            <NodeWrapper nodeType="fields" type="select" htmlTag="div" name="state">
                <label>
                    <Label label={stateLabel} required={stateRequired} />

                    <select onChange={updateStateValue} aria-invalid={fieldError ? 'true' : 'false'}>
                        {statesLoading ? (
                            <option disabled>{__('Loading...', 'give')}</option>
                        ) : (
                            <>
                                <option hidden>{__(`Select ${stateLabel}`, 'give')}</option>
                                <option disabled>{__(`Select ${stateLabel}`, 'give')}</option>
                            </>
                        )}
                        {states.map(({label, value}) => (
                            <option key={value} value={value}>
                                {label ?? value}
                            </option>
                        ))}
                    </select>

                    <HiddenStateField />

                    <ErrorMessage
                        errors={errors}
                        name={'state'}
                        render={({message}) => <FieldError error={message} />}
                    />
                </label>
            </NodeWrapper>
        );
    }

    return (
        /**
         * TODO: replace with template api component
         */
        <NodeWrapper nodeType="fields" type="text" htmlTag="div" name="state">
            <label>
                <Label label={stateLabel ?? __('State', 'give')} required={stateRequired} />

                <input type="text" onChange={updateStateValue} aria-invalid={fieldError ? 'true' : 'false'} />

                <HiddenStateField />

                <ErrorMessage errors={errors} name="state" render={({message}) => <FieldError error={message} />} />
            </label>
        </NodeWrapper>
    );
}

export default function BillingAddress({
    fields: {country: Country, address1: Address1, address2: Address2, city: City, state, zip: Zip},
}: BillingAddressProps) {
    return (
        <>
            <Country />
            <Address1 />
            <Address2 />
            <City />
            <StateFieldContainer state={state} />
            <Zip />
        </>
    );
}
