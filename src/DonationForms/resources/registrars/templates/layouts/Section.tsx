import type {SectionProps} from '@givewp/forms/propTypes';

const SectionHeader = ({name, label, description}: {name: string; label?: string; description?: string}) => {
    return label.length > 0 || description.length > 0 ? (
        <div>
            {label.length > 0 && (
                <legend className="givewp-layouts-section__fieldset--legend" id={name}>
                    {label}
                </legend>
            )}
            {description.length > 0 && (
                <p>
                    <em>{description}</em>
                </p>
            )}
        </div>
    ) : (
        <></>
    );
};

export default function Section({
    section: {name, label, description},
    hideLabel,
    hideDescription,
    children,
}: SectionProps) {
    return (
        <fieldset className="givewp-layouts-section__fieldset" aria-labelledby={name}>
            <SectionHeader
                name={name}
                label={hideLabel ? '' : label}
                description={hideDescription ? '' : description}
            />
            <div className="givewp-section-nodes">{children}</div>
        </fieldset>
    );
}
