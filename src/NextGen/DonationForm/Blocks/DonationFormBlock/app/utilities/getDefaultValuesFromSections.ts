/**
 * Returns default values from an array of field collection objects
 *
 * @unreleased
 *
 * @param sections
 * @return {*}
 */
import {Section} from '@givewp/forms/types';

export default function getDefaultValuesFromSections(sections: Section[]) {
    return sections.reduce((values, section) => {
        section.nodes.map(({name, defaultValue = null}) => {
            values[name] = defaultValue;
        });

        return values;
    }, {});
}
