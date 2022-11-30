import Header from './layouts/Header';
import Goal from './layouts/Goal';

window.givewp.form.api.templates.extend({
    layouts: {
        header: Header,
        goal: Goal,
    },
});
