export interface DescriptionProps {
    text: string
}

/**
 * @unreleased
 */
export default function Description({text}: DescriptionProps) {
    return <p>{text}</p>
}
