import {SelectControl} from "@wordpress/components";
import {__} from '@wordpress/i18n';

const PostAuthorControl = () => {
    return <SelectControl
        label={__('Author')}
        options={[
            { value: 'admin', label: __( 'Admin', 'give' ) },
        ]}
        onChange={() => null}
    />
}

export default PostAuthorControl;
