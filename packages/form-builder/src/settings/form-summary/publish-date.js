import {Button, DateTimePicker, Dropdown, TextControl} from "@wordpress/components";
import {close, Icon} from "@wordpress/icons";

const PublishDateControl = () => {
    return <Dropdown
        className="my-container-class-name"
        contentClassName="givewp-sidebar-dropdown-content"
        popoverProps={ { placement: 'bottom-start' } }
        focusOnMount={"container"}
        renderToggle={ ( { isOpen, onToggle } ) => (
            <TextControl
                label={'Publish'}
                value={'January 12, 11:50 pm'}
                onChange={() => null}
                onClick={ onToggle }
                aria-expanded={ isOpen }
            />
        ) }
        renderContent={ ({onClose}) => (
            <div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <strong style={{fontSize: '14px'}}>{'Publish'}</strong>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Button variant={'tertiary'}>{'now'}</Button>
                        <Button onClick={onClose}>
                            <Icon icon={close} size={14}></Icon>
                        </Button>
                    </div>
                </div>
                <DateTimePicker
                    currentDate={ null }
                    onChange={ ( newDate ) => null }
                    is12Hour={ true }
                    __nextRemoveHelpButton
                    __nextRemoveResetButton
                />
            </div>
        ) }
    />
}

export default PublishDateControl;
