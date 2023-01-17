import {Button, Dropdown, ExternalLink, TextControl} from "@wordpress/components";
import {close, Icon} from "@wordpress/icons";
import {setFormSettings, useFormState, useFormStateDispatch} from "@givewp/form-builder/stores/form-state";

import apiFetch from '@wordpress/api-fetch';

const PageSlugControl = () => {

    const {
        settings: {pageSlug},
    } = useFormState();
    const dispatch = useFormStateDispatch();

    return <Dropdown
        className="my-container-class-name"
        contentClassName="givewp-sidebar-dropdown-content"
        popoverProps={ { placement: 'bottom-start' } }
        focusOnMount={"container"}
        renderToggle={ ( { isOpen, onToggle } ) => (
            <TextControl
                label={'URL'}
                value={'/donations/' + pageSlug}
                onChange={() => null}
                onClick={ onToggle }
                aria-expanded={ isOpen }
            />
        ) }
        renderContent={ ({onClose}) => (
            <div style={{'width': '229px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <strong style={{fontSize: '14px'}}>{'URL'}</strong>
                    <Button onClick={onClose}>
                        <Icon icon={close} size={14}></Icon>
                    </Button>
                </div>
                <TextControl
                    label={'Permalink'}
                    value={pageSlug}
                    onChange={(pageSlug) => dispatch(setFormSettings({pageSlug}))}
                    help={'The last part of the URL.'}
                />
                <div>View Page</div>
                <ExternalLink href={'/donations/' + window.storageData.formPageURL}>{'/donations/' + pageSlug}</ExternalLink>
            </div>
        ) }
    />
}

export default PageSlugControl;
