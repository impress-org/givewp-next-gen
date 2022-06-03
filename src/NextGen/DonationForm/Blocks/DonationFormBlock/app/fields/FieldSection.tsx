import {RegisterOptions, useFormContext, UseFormRegisterReturn} from 'react-hook-form';

import {Section, Field, isField, isElement, isGroup, Node} from '@givewp/forms/types';
import {getTemplateElement, getTemplateField, getTemplateGroup} from '../utilities/templates';

export default function FieldSection({name, label, nodes}: Section) {
    const {register} = useFormContext();

    return (
        <fieldset aria-labelledby={name}>
            <div>
                <h2 id={name}>{label}</h2>
            </div>
            {nodes.map((node) => {
                if (isField(node)) {
                    const Field = getTemplateField(node.type);
                    const inputProps = register(node.name, buildRegisterValidationOptions(node.validationRules));

                    return <Field key={node.name} inputProps={inputProps} {...node} />;
                } else if (isElement(node)) {
                    const Element = getTemplateElement(node.type);
                    return <Element key={node.name} {...node} />;
                } else if (isGroup(node)) {
                    const Group = getTemplateGroup(node.type);
                    const fields = node.nodes.reduce(getGroupFields, []);

                    const inputProps = fields.reduce((inputProps, field) => {
                        inputProps[field.name] = register(
                            field.name,
                            buildRegisterValidationOptions(field.validationRules)
                        );

                        return inputProps;
                    }, {});

                    return <Group key={node.name} inputProps={inputProps} {...node} />;
                } else {
                    return null;
                }
            })}
        </fieldset>
    );
}

/**
 * Recursively finds all the fields within a group
 *
 * @unreleased
 */
function getGroupFields(fields: Field[], node: Node): Field[] {
    if (isField(node)) {
        fields.push(node);
    } else if (isGroup(node)) {
        node.nodes.reduce(getGroupFields, fields);
    }

    return fields;
}

/**
 * Builds the expected registration options from the Field API validation rules
 *
 * @unreleased
 */
function buildRegisterValidationOptions(validationRules: {[key: string]: any}): RegisterOptions {
    return ['required', 'maxLength', 'minLength'].reduce((rules, rule) => {
        if (validationRules.hasOwnProperty(rule)) {
            rules[rule] = validationRules[rule];
        }

        return rules;
    }, {});
}
