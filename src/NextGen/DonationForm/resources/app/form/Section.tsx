import {withTemplateWrapper} from '@givewp/forms/app/templates';
import SectionNode from '@givewp/forms/app/fields/SectionNode';
import useVisibilityCondition from '@givewp/forms/app/hooks/useVisibilityCondition';
import {Section as SectionType} from '@givewp/forms/types';

const formTemplates = window.givewp.form.templates;
const FormSectionTemplate = withTemplateWrapper(formTemplates.layouts.section, 'section');

export default function Section({section}: {section: SectionType}) {
    const showNode = useVisibilityCondition(section.visibilityConditions);

    if (!showNode) {
        return null;
    }

    return (
        <FormSectionTemplate section={section}>
            {section.nodes.map((node) => (
                <SectionNode key={node.name} node={node} />
            ))}
        </FormSectionTemplate>
    );
}
