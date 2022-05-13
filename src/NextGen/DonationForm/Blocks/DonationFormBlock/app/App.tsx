import ReactDOM from 'react-dom';
import getWindowData from './utilities/getWindowData';
import getDefaultValuesFromFieldsCollection from './utilities/getDefaultValuesFromFieldsCollection';
import Form from './form/Form';
import getPaymentGateways from './utilities/getPaymentGateways';
import {GiveDonationFormStoreProvider} from './store';

/**
 * Get data from the server
 */
const [attributes, form] = getWindowData('attributes', 'form');

/**
 * Prepare default values for form
 */
const defaultValues = getDefaultValuesFromFieldsCollection(form.nodes);
const gateways = getPaymentGateways(form.nodes.find(({name}) => name === 'paymentDetails').nodes);

const initialState = {
    gateways
}

function App() {
    return (
        <GiveDonationFormStoreProvider initialState={initialState}>
            <Form fields={form.nodes} defaultValues={defaultValues}/>
        </GiveDonationFormStoreProvider>
    );
}

ReactDOM.render(<App/>, document.getElementById('root-give-next-gen-donation-form-block'));
