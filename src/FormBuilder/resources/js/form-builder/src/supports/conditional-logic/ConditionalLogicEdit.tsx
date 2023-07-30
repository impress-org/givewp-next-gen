import {InspectorControls} from '@wordpress/block-editor';
import {Button, PanelBody, PanelRow, SelectControl, ToggleControl} from '@wordpress/components';
import {createInterpolateElement, useState} from '@wordpress/element';
import {__, sprintf} from '@wordpress/i18n';

import {ConditionalLogicAttribute} from '@givewp/form-builder/supports/conditional-logic/types';
import {AfterDisplaySettingsFill} from '@givewp/form-builder/supports/field-settings/slots';
import EditPopover from '@givewp/form-builder/supports/conditional-logic/EditPopover';
import {conditionOptions, labels} from '@givewp/form-builder/supports/conditional-logic/constants';

/**
 * Renders the conditional logic inspector controls.
 *
 * @unreleased
 */
export function ConditionalLogicEdit({conditionalLogic, setAttributes, fieldOptions}) {
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    const openPopover = () => setIsPopoverOpen(true);
    const closePopover = () => setIsPopoverOpen(false);

    const setConditionalLogicAttributes = (newAttributes: Partial<ConditionalLogicAttribute>) => {
        setAttributes({
            conditionalLogic: {
                ...conditionalLogic,
                ...newAttributes,
            },
        });
    };

    const ConditionFieldHelpText = () => {
        return createInterpolateElement(
            sprintf(
                __(
                    '<strong>%s</strong> this field if <strong>%s</strong> of the logic statement below matches',
                    'give'
                ),
                labels.actions[conditionalLogic.action],
                labels.booleans[conditionalLogic.boolean].toLowerCase()
            ),
            {
                strong: <strong />,
            }
        );
    };

    return (
        <>
            <InspectorControls>
                <AfterDisplaySettingsFill>
                    <PanelBody
                        title={__('Conditional logic', 'give')}
                        initialOpen={true}
                        className={'givewp-conditional-logic'}
                    >
                        <PanelRow>
                            <ToggleControl
                                label={__('Enable conditional logic', 'give')}
                                help={__(
                                    'Sets this field visibility based on the value of another field in this form.',
                                    'give'
                                )}
                                checked={conditionalLogic.enabled}
                                onChange={(value) => {
                                    setConditionalLogicAttributes({enabled: value});
                                }}
                            />
                        </PanelRow>
                        {conditionalLogic.enabled && (
                            <>
                                <PanelRow>
                                    <SelectControl
                                        label={__('Condition', 'give')}
                                        help={<ConditionFieldHelpText />}
                                        options={conditionOptions}
                                        value={`${conditionalLogic.action}-${conditionalLogic.boolean}`}
                                        onChange={(value) => {
                                            const [action, boolean] = value.split('-');
                                            setConditionalLogicAttributes({action, boolean});
                                        }}
                                    />
                                </PanelRow>
                                <PanelRow>
                                    <Button
                                        variant="secondary"
                                        onClick={openPopover}
                                        className={'givewp-conditional-logic__open-popover-button'}
                                    >
                                        {__('Add logic statement', 'give')}
                                    </Button>
                                    <EditPopover
                                        visible={isPopoverOpen}
                                        onClose={closePopover}
                                        setConditionalLogicAttributes={setConditionalLogicAttributes}
                                        conditionalLogic={conditionalLogic}
                                        fieldOptions={fieldOptions}
                                    />
                                </PanelRow>
                            </>
                        )}
                    </PanelBody>
                </AfterDisplaySettingsFill>
            </InspectorControls>
        </>
    );
}
