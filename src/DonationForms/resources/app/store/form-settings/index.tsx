import {createContext, ReactNode, useContext} from 'react';

const StoreContext = createContext(null);
StoreContext.displayName = 'DonationFormSettings';

type PropTypes = {
    value: {
        [key: string]: any
    };
    children: ReactNode;
};

/**
 * @unreleased
 */
const DonationFormSettingsProvider = ({value, children}: PropTypes) => {
    return (
        <StoreContext.Provider value={value}>
            {children}
        </StoreContext.Provider>
    );
};

const useDonationFormSettings = () => useContext<PropTypes['value']>(StoreContext);

export {DonationFormSettingsProvider, useDonationFormSettings};
