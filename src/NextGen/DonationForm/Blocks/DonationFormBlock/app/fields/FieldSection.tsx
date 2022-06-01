import {useFormContext} from 'react-hook-form';

import {Section, Field, isField, isElement} from '@givewp/forms/types';
import {getTemplateElement, getTemplateField} from '../utilities/templates';

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
                    const inputProps = register(node.name, {
                        required: node.validationRules?.required,
                    });

                    return <Field key={node.name} inputProps={inputProps} {...node} />;
                } else if (isElement(node)) {
                    const Element = getTemplateElement(node.type);
                    return <Element key={node.name} {...node} />;
                } else {
                    return null;
                }
            })}
        </fieldset>
    );
}
