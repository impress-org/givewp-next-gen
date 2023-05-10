import fieldBlocks from './fields';
import elementBlocks from './elements';
import sectionBlocks from './section';

const formBuilderBlockNames = [...fieldBlocks, ...elementBlocks, ...sectionBlocks].flatMap(({name}) => name).flat();

export default formBuilderBlockNames;