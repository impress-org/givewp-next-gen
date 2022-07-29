import {__} from '@wordpress/i18n';
import {useSelect} from '@wordpress/data';
import type {Post} from '@wordpress/core-data/src/entity-types';
import type {Option} from "../types";


/**
 * @since 1.0.0
 *
 * TODO: replace with useEntityRecords when available
 */
export default function useFormOptions(): { formOptions: Option[] | null, isResolving: boolean } {
    const {forms, isResolving} = useSelect((select) => {
        return {
            forms: select('core').getEntityRecords<Post[]>('postType', 'give_forms')?.filter(({excerpt}) => excerpt.rendered.length > 0),
            isResolving: select('core/data').getIsResolving('core', 'getEntityRecords', ['postType', 'give_forms'])
        };
    }, []);

    const formOptions = forms && forms.length > 0
        ? forms.map(({id, title}) => {
            return {
                label: __(title.rendered, 'give'),
                value: String(id),
            };
        })
        : [];

    return {
        isResolving,
        formOptions
    }
}
