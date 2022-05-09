import ReactDOM from 'react-dom';
import getWindowData from './utilities/getWindowData';
import getDefaultValuesFromFieldsCollection from './utilities/getDefaultValuesFromFieldsCollection';
import Form from './form/Form';
import getPaymentGateways from './utilities/getPaymentGateways';
import IFrame from './components/IFrame';
import {Fragment} from 'react';

/**
 * Get data from the server
 */
const [attributes, form, stylesheets] = getWindowData('attributes', 'form', 'stylesheets');

/**
 * Prepare default values for form
 */
const defaultValues = getDefaultValuesFromFieldsCollection(form.nodes);
const gateways = getPaymentGateways(form.nodes.find(({name}) => name === 'paymentDetails').nodes);

/**
 * Create Head component for iframe
 */
const Head = () => (
    <Fragment>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {stylesheets.map(({id, href}) => {
            return <link rel="stylesheet" id={id} href={href} media="all" key={id} />;
        })}
    </Fragment>
);

function App() {
    return (
        <IFrame head={<Head />}>
            <Form fields={form.nodes} defaultValues={defaultValues} gateways={gateways} />
        </IFrame>
    );
}

ReactDOM.render(<App />, document.getElementById('root-give-next-gen-donation-form-block'));
