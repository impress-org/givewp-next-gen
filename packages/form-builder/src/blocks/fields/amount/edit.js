import {__} from '@wordpress/i18n';

import LevelGrid from './level-grid';
import LevelButton from './level-buttons';
import Inspector from './inspector';
import {Currency, CurrencyControl} from '../../../common/currency';

const Edit = ({attributes, setAttributes}) => {
    const {
        levels,
        priceOption,
        setPrice,
        customAmount,
        customAmountMin,
        customAmountMax,
    } = attributes;

    const isMultiLevel = priceOption === 'multi';
    const isFixedAmount = priceOption === 'set';

    return (
        <>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                { !!isFixedAmount && !customAmount && (
                    <div style={{backgroundColor: 'var(--givewp-gray-20)', padding: '12px 16px', borderRadius: '5px'}}>
                        This donation is set to <strong><Currency amount={setPrice} /></strong> for this form.</div>
                )}
                { !!isMultiLevel && levels.length > 0 && (
                    <LevelGrid>
                        {levels.map((level, index) => (
                            <LevelButton key={index}><Currency amount={level} /></LevelButton>
                        ))}
                    </LevelGrid>
                )}
                { !!customAmount && (
                    <div>
                        <CurrencyControl value={setPrice} />
                        {/*<input style={{width: '100%'}} type="text" readOnly placeholder={setPrice} />*/}
                    </div>
                )}
            </div>

            <Inspector attributes={attributes} setAttributes={setAttributes} />
        </>
    );
};

export default Edit;
