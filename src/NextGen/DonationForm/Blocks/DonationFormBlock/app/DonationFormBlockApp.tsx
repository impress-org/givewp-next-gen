import {render} from '@wordpress/element';
import getDefaultValuesFromSections from './utilities/getDefaultValuesFromSections';
import Form from './form/Form';
import {GiveDonationFormStoreProvider} from './store';
import getWindowData from './utilities/getWindowData';

/**
 * Get data from the server
 */
const {attributes, form} = getWindowData();

/**
 * Prepare default values for form
 */
const defaultValues = getDefaultValuesFromSections(form.sections);

const initialState = {
    gateways: window.givewp.gateways.getAll(),
};

function App() {
    return (
        <GiveDonationFormStoreProvider initialState={initialState}>
            <Form sections={form.sections} defaultValues={defaultValues} />
        </GiveDonationFormStoreProvider>
    );
}

render(<App />, document.getElementById('root-give-next-gen-donation-form-block'));
