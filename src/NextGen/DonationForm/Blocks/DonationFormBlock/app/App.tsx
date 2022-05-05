import ReactDOM from 'react-dom';
import getWindowData from './utilities/getWindowData';
import getDefaultValuesFromFieldsCollection from './utilities/getDefaultValuesFromFieldsCollection';
import Form from './form/Form';
import getPaymentGateways from './utilities/getPaymentGateways';
import Frame from 'react-frame-component';

/**
 * Get data from the server
 */
const [attributes, form] = getWindowData('attributes', 'form');

/**
 * Prepare default values for form
 */
const defaultValues = getDefaultValuesFromFieldsCollection(form.nodes);
const gateways = getPaymentGateways(form.nodes.find(({name}) => name === 'paymentDetails').nodes);

const initialContent = `
<!doctype html>
<html lang="en-us">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel='stylesheet' id='twenty-twenty-one-style-css'  href='https://givewp.test/wp-content/themes/twentytwentyone/style.css?ver=1.5' media='all' />
    </head>
    <body>
        <div></div>
    </body>
</html>`;

function App() {
    return (
        <Frame style={{
            width: '100%',
            height: '100%'
        }} initialContent={initialContent}>
            <Form fields={form.nodes} defaultValues={defaultValues} gateways={gateways}/>
        </Frame>
    );
}

ReactDOM.render(<App />, document.getElementById('root-give-next-gen-donation-form-block'));
