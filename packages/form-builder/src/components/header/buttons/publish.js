import {Button} from '@wordpress/components';
import {__} from '@wordpress/i18n';

import './style.scss';

const PublishButton = (props) => {
    const {onClick, isBusy} = props;
    return (
        <Button
            className={`components-button-publish ${isBusy ? 'components-button-publish--busy' : ''}`}
            onClick={onClick}
            disabled={isBusy}
        >
            {isBusy ? __('Publishing...', 'give') : __('Publish', 'give')}
        </Button>
    );
};

export default PublishButton;
