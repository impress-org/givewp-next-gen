import {useSelect} from '@wordpress/data';

export default function usePostState()
{
    const isSaving = useSelect((select) => {
        return select('core/editor').isSavingPost()
    }, []);

    const isDisabled = useSelect((select) => {
        return !select('core/editor').isEditedPostPublishable()
    }, []);

    return {
        isSaving, isDisabled
    }
}
