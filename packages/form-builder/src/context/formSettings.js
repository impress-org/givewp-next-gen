import React, { createContext, useState } from 'react';

export const FormSettingsContext = React.createContext();
export const FormSettingsContextProvider = ({children}) => {
    const [formSettings, setFormSettings] = useState({
        formTitle: 'Donation Form'
    })
    return (
        <FormSettingsContext.Provider value={[formSettings, setFormSettings]}>
            {children}
        </FormSettingsContext.Provider>
    )
}
