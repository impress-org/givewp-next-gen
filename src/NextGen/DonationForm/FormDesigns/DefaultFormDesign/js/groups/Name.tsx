import {NodeWrapper} from '../utilities';
import type {NameProps} from '@givewp/forms/propTypes';
import Text from '../fields/Text';
import Select from '../fields/Select';

export default function Name({fieldProps}: NameProps) {
    return (
        <>
            {fieldProps.honorific && (
                <NodeWrapper type="select" nodeType="fields" name="honorific">
                    <Select {...fieldProps.honorific} />
                </NodeWrapper>
            )}
            <NodeWrapper type="text" nodeType="fields" name="firstName">
                <Text {...fieldProps.firstName} />
            </NodeWrapper>

            {fieldProps.lastName && (
                <NodeWrapper type="text" nodeType="fields" name="lastName">
                    <Text {...fieldProps.lastName} />
                </NodeWrapper>
            )}
        </>
    );
}
