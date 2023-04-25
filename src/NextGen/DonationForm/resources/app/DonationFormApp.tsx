import {createRoot, render} from '@wordpress/element';
import getDefaultValuesFromSections from './utilities/getDefaultValuesFromSections';
import Form from './form/Form';
import {GiveDonationFormStoreProvider} from './store';
import getWindowData from './utilities/getWindowData';
import prepareFormData from './utilities/PrepareFormData';
import getJoiRulesForForm from './utilities/ConvertFieldAPIRulesToJoi';
import Header from './form/Header';
import mountWindowData from '@givewp/forms/app/utilities/mountWindowData';
import {withTemplateWrapper} from '@givewp/forms/app/templates';
import DonationFormErrorBoundary from '@givewp/forms/app/errors/boundaries/DonationFormErrorBoundary';
import MultiStepForm from '@givewp/forms/app/form/MultiStepForm';

const formTemplates = window.givewp.form.templates;
const GoalAchievedTemplate = withTemplateWrapper(formTemplates.layouts.goalAchieved);

/**
 * Get data from the server
 */
const {form} = getWindowData();

prepareFormData(form);

mountWindowData();

/**
 * Prepare default values for form
 */
const defaultValues = getDefaultValuesFromSections(form.nodes);

const schema = getJoiRulesForForm(form);

const initialState = {
    gateways: window.givewp.gateways.getAll(),
    // defaultValues,
    // sections: form.nodes,
    // validationSchema: schema,
};

const isMultiStep = true;

function App() {
    if (form.goal.isAchieved) {
        return (
            <DonationFormErrorBoundary>
                <GoalAchievedTemplate goalAchievedMessage={form.settings.goalAchievedMessage} />
            </DonationFormErrorBoundary>
        );
    }

    if (isMultiStep) {
        return (
            <GiveDonationFormStoreProvider initialState={initialState}>
                <Header />
                <MultiStepForm defaultValues={defaultValues} sections={form.nodes} validationSchema={schema} />
            </GiveDonationFormStoreProvider>
        );
    }

    return (
        <GiveDonationFormStoreProvider initialState={initialState}>
            <Header />
            <Form defaultValues={defaultValues} sections={form.nodes} validationSchema={schema} />
        </GiveDonationFormStoreProvider>
    );
}

const root = document.getElementById('root-givewp-donation-form');

if (createRoot) {
    createRoot(root).render(<App />);
} else {
    render(<App />, root);
}
