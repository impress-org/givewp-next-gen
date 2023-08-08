import {TextareaControl} from '@wordpress/components';
import {BlockEditProps} from '@wordpress/blocks';

export default function Edit({attributes}: BlockEditProps<any>) {
    const {label, description} = attributes;

    return (
        <>
            <div>
                <TextareaControl label={label} readOnly onChange={null} help={description} value="" />
            </div>
        </>
    );
}