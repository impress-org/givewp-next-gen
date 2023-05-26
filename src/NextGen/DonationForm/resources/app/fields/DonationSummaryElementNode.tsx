import {Element} from '@givewp/forms/types';
import {useTemplateWrapper} from '../templates';
import type {ElementProps} from '@givewp/forms/propTypes';
import useDonationFormDefaultSummary from '@givewp/forms/app/hooks/useDonationFormSummary';
import {useEffect} from '@wordpress/element';

const formTemplates = window.givewp.form.templates;

export default function DonationSummaryElementNode({node}: {node: Element}) {
    const {useDonationSummary} = window.givewp.form.hooks;
    const {items, totals} = useDonationFormDefaultSummary();
    const {addItem, addToTotal} = useDonationSummary();

    useEffect(() => {
        items.forEach((item) => addItem(item));
    },[JSON.stringify(items)]);

    useEffect(() => {
        Object.entries(totals).forEach((([id, amount]) => addToTotal(id, amount)))
    }, [JSON.stringify(totals)]);

    const Element = useTemplateWrapper<ElementProps>(formTemplates.elements[node.type], 'div', node.name);

    return <Element key={node.name} {...node} />;
}
