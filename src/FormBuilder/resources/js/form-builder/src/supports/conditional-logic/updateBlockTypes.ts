/**
 * Adds attributes to the block types that support the field settings.
 *
 * @unreleased
 */
export default function updateBlockTypes(settings) {
    const conditionalLogicSettings = settings.supports.givewp?.conditionalLogic;

    if (conditionalLogicSettings !== true) {
        return settings;
    }

    settings.attributes = {
        ...settings.attributes,
        conditionalLogic: {
            type: 'object',
            default: {
                enabled: false,
                action: 'show',
                boolean: 'and',
                rules: [],
            },
        },
    };

    return settings;
}
