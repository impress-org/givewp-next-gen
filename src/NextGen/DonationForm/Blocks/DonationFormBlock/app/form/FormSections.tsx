import SectionNodes from '../fields/SectionNodes';
import PaymentDetails from '../fields/PaymentDetails';
import {getSectionTemplate} from '../templates';
import {Gateway, Section} from "@givewp/forms/types";

const SectionTemplate = getSectionTemplate();

export default function FormSections({sections, gateways}: PropTypes) {
    return <>
        {sections.map((section) => {
            if (section.name === 'payment-details') {
                return <PaymentDetails gateways={gateways} key={section.name} {...section} />;
            }

            return (
                <SectionTemplate key={section.name} section={section}>
                    <SectionNodes key={section.name} {...section} />
                </SectionTemplate>
            );
        })}
    </>;
}

type PropTypes = {
    sections: Section[];
    gateways: Gateway[];
}
