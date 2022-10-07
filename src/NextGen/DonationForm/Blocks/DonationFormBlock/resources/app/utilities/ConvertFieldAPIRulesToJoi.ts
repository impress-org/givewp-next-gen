import Joi, {AnySchema, ObjectSchema} from 'joi';
import {Field, Form} from '@givewp/forms/types';
import {getFormFields} from './forms';
import {__, sprintf} from '@wordpress/i18n';

const requiredMessage = sprintf(
    /* translators: base error message */
    __('%s is required.', 'give`'),
    `{#label}`
);

export default function getJoiRulesForForm(form: Form): ObjectSchema {
    const fields = getFormFields(form);

    const joiRules = fields.reduce((rules, field) => {
        rules[field.name] = getJoiRulesForField(field);

        return rules;
    }, {});

    return Joi.object(joiRules).messages({
        'string.base': requiredMessage,
        'string.empty': requiredMessage,
    });
}

function getJoiRulesForField(field: Field): AnySchema {
    const rules: AnySchema = convertFieldAPIRulesToJoi(field.validationRules);

    if (typeof field.label === 'string') {
        rules.label(field.label);
    }

    return rules;
}

function convertFieldAPIRulesToJoi(rules): AnySchema {
    let joiRules;

    if (rules.number || rules.integer) {
        joiRules = Joi.number();

        if (rules.integer) {
            joiRules = joiRules.integer();
        }
    } else if (rules.boolean) {
        joiRules = Joi.boolean();
    } else {
        joiRules = Joi.string();

        if (rules.email) {
            joiRules = joiRules.email({tlds: false});
        }

        if (rules.alpha) {
            joiRules = joiRules.alpha();
        }

        if (rules.alphanum) {
            joiRules = joiRules.alphanum();
        }
    }

    if (rules.number || !rules.boolean) {
        if (rules.min) {
            joiRules = joiRules.min(rules.min);
        }

        if (rules.max) {
            joiRules = joiRules.max(rules.max);
        }
    }

    if (rules.required) {
        joiRules = joiRules.required();
    } else {
        joiRules = joiRules.optional().allow('', null);
    }

    return joiRules;
}
