import {TextareaControl} from '@wordpress/components';
import {BlockEditProps} from '@wordpress/blocks';

export default function Edit({attributes}: BlockEditProps<any>) {
    const {label, description} = attributes;

    return (
        <>
            <div>
                <TextareaControl
                    style={{backgroundColor: '#fff'}}
                    readOnly
                    label={label}
                    help={description}
                    value=""
                    onChange={() => null}
                />
            </div>
        </>
    );
}