import ReactDOM from 'react-dom';
import getDefaultValuesFromFieldsCollection from './utilities/getDefaultValuesFromFieldsCollection';
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
const defaultValues = getDefaultValuesFromFieldsCollection(form.nodes);
//const gateways = getPaymentGateways(form.nodes.find(({name}) => name === 'paymentDetails').nodes);

const initialState = {
    gateways: window.GivePaymentGatewayRegistrar.gateways
}

function App() {
    return (
        <GiveDonationFormStoreProvider initialState={initialState}>
            <Form fields={form.nodes} defaultValues={defaultValues}/>
        </GiveDonationFormStoreProvider>
    );
}

ReactDOM.render(<App/>, document.getElementById('root-give-next-gen-donation-form-block'));
