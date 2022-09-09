import {Section as SectionType} from '@givewp/forms/types';
import {ReactNode} from 'react';

export interface SectionProps {
    section: SectionType;
    children: ReactNode;
}

export default function Section({section: {name, label, description}, children}: SectionProps) {
    return (
        <fieldset aria-labelledby={name}>
            <div>
                <legend id={name}>{label}</legend>
                <p><em>{description}</em></p>
            </div>
            <div className="givewp-section-nodes">{children}</div>
        </fieldset>
    );
}
