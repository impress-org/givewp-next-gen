import {SelectControl} from "@wordpress/components";
import {__} from "@wordpress/i18n";

const Visibility = () => {
    return <SelectControl
        label={__('Visibility')}
        options={[
            { value: 'public', label: __( 'Public', 'give' ) },
        ]}
        onChange={() => null}
    />
}
