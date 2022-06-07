import React, { createContext } from 'react';

export const FormSettingsContext = createContext();

export const FormSettingsProvider = ({formSettings, setFormSettings, children}) => {

    const setFormSettingsObserver = ( settings ) => {
        console.log( settings )
        setFormSettings( settings )
    }

    return (
        <FormSettingsContext.Provider value={[formSettings, setFormSettingsObserver]}>
            {children}
        </FormSettingsContext.Provider>
    )
}

export const defaultFormSettings = {
    formTitle: 'My Default Donation Form Title',
    enableDonationGoal: false,
    enableAutoClose: false,
}
