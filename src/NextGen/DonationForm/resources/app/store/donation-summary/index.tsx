import {createContext, ReactNode, useContext} from 'react';
import {DonationSummaryLineItem} from '../../../registrars/templates/elements/DonationSummary';
import {useImmerReducer} from 'use-immer';
import reducer from './reducer';

const StoreContext = createContext(null);
StoreContext.displayName = 'DonationSummaryProvider';

const StoreContextDispatch = createContext(null);
StoreContextDispatch.displayName = 'DonationSummaryDispatch';

type Totals = {[key: string]: number}

type PropTypes = {
    initialState?: {
        items: DonationSummaryLineItem[];
        totals: Totals;
    };
    children: ReactNode;
};

/**
 * @unreleased
 */
const DonationSummaryProvider = ({initialState = {items: [], totals: {}}, children}: PropTypes) => {
    const [state, dispatch] = useImmerReducer(reducer, initialState);

    return (
        <StoreContext.Provider value={state}>
            <StoreContextDispatch.Provider value={dispatch}>{children}</StoreContextDispatch.Provider>
        </StoreContext.Provider>
    );
};

const useDonationSummaryContext = () => useContext<PropTypes['initialState']>(StoreContext);
const useDonationSummaryDispatch = () => useContext(StoreContextDispatch);

export {DonationSummaryProvider, useDonationSummaryContext, useDonationSummaryDispatch};
