import {NodeWrapper} from '../layouts/NodeWrapper';
import type {NameProps} from '@givewp/forms/propTypes';
import Text from '../fields/Text';
import Select from '../fields/Select';

export default function Name({fieldProps}: NameProps) {
    return (
        <>
            {fieldProps.honorific && (
                <NodeWrapper nodeType="fields" type="select" name="honorific">
                    <Select {...fieldProps.honorific} />
                </NodeWrapper>
            )}
            <NodeWrapper nodeType="fields" type="text" name="firstName">
                <Text {...fieldProps.firstName} />
            </NodeWrapper>

            {fieldProps.lastName && (
                <NodeWrapper nodeType="fields" type="text" name="lastName">
                    <Text {...fieldProps.lastName} />
                </NodeWrapper>
            )}
        </>
    );
}
