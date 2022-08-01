import type {ElementProps} from '@givewp/forms/propTypes';

export default function DonationSummary() {
    return <div>
        <ul style={{listStyleType: 'none'}}>
            <LineItem label={'Payment Amount'} />
            <LineItem label={'Giving Frequency'} />
            <LineItem label={'Donation Total'} />
        </ul>
    </div>;
}

const LineItem = ({label}) => {
    return (
        <li style={{
            display: 'flex',
            padding: '15px 0',
            justifyContent: 'space-between',
            borderBlockStart: '0.0625rem solid #ddd',
        }}>
            <div>{label}</div>
            <div>-</div>
        </li>
    )
}
