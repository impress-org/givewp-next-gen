import {SectionBlock} from '@givewp/form-builder/types/block';
import settings from './settings';

const section: SectionBlock = {
    name: 'custom-block-editor/section',
    settings,
};

const sectionBlocks: SectionBlock[] = [section];

const sectionBlockNames = sectionBlocks.map(({name}) => name);

export default sectionBlocks;
export {sectionBlockNames};