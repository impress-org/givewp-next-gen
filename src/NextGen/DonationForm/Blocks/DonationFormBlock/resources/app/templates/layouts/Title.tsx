export interface TitleProps {
    text: string;
}

/**
 * @unreleased
 */
export default function Title({text}: TitleProps) {
    return <h2>{text}</h2>;
}
