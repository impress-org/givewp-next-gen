import {Element} from '@givewp/forms/types';
import {useTemplateWrapper} from '../templates';
import type {ElementProps} from '@givewp/forms/propTypes';
import getFormDesign from '@givewp/blocks/form/app/utilities/getFormDesign';

const formDesign = getFormDesign();

export default function ElementNode({node}: {node: Element}) {
    const Element = useTemplateWrapper<ElementProps>(formDesign.elements[node.type]);

    return <Element key={node.name} {...node} />;
}
