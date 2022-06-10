import {GroupProps} from '../index';
import {findNode} from '../../utilities/groups';
import Text from '../fields/Text';
import {Field} from '@givewp/forms/types';

export default function Name({nodes, inputProps}: GroupProps) {
    const firstName = findNode('firstName', nodes) as Field;
    const lastName = findNode('lastName', nodes) as Field | null;
    const honorific = findNode('honorific', nodes) as Field | null;

    return (
        <>
            {honorific && <Text inputProps={inputProps['honorific']} {...honorific} />}
            <Text inputProps={inputProps['firstName']} {...firstName} />
            {lastName && <Text inputProps={inputProps['lastName']} {...lastName} />}
        </>
    );
}
