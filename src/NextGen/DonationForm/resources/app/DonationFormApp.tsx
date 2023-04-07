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
import {ErrorBoundary} from 'react-error-boundary';
import DonationFormAppErrorFallback from '@givewp/forms/app/errors/DonationFormAppErrorFallback';

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
};

function App() {
    if (form.goal.isAchieved) {
        return <GoalAchievedTemplate goalAchievedMessage={form.settings.goalAchievedMessage} />;
    }

    return (
        <GiveDonationFormStoreProvider initialState={initialState}>
            <ErrorBoundary
                FallbackComponent={DonationFormAppErrorFallback}
                onReset={() => {
                    window.location.reload();
                }}
            >
                <Header />
                <Form defaultValues={defaultValues} sections={form.nodes} validationSchema={schema} />
            </ErrorBoundary>
        </GiveDonationFormStoreProvider>
    );
}

const root = document.getElementById('root-givewp-donation-form');

if (createRoot) {
    createRoot(root).render(<App />);
} else {
    render(<App />, root);
}
