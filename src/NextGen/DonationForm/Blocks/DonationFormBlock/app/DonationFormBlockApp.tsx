import {render} from '@wordpress/element';
import getDefaultValuesFromSections from './utilities/getDefaultValuesFromSections';
import Form from './form/Form';
import {GiveDonationFormStoreProvider} from './store';
import getWindowData from './utilities/getWindowData';
import FormSections from "./form/FormSections";

/**
 * Get data from the server
 */
const {attributes, form} = getWindowData();

/**
 * Prepare default values for form
 */
const defaultValues = getDefaultValuesFromSections(form.nodes);

const initialState = {
    gateways: window.givewp.gateways.getAll(),
};

function App() {
    return (
        <GiveDonationFormStoreProvider initialState={initialState}>
            <Form defaultValues={defaultValues}>
                <FormSections sections={form.nodes} gateways={initialState.gateways}/>
            </Form>
        </GiveDonationFormStoreProvider>
    );
}

render(<App />, document.getElementById('root-give-next-gen-donation-form-block'));
