import React, { createContext, useState } from 'react';

export const FormTitleContext = createContext();

export const FormTitleProvider = ({children}) => {
    const [formTitle, setFormTitle] = useState( 'Donation Form' )
    return (
        <FormTitleContext.Provider value={[formTitle, setFormTitle]}>
            {children}
        </FormTitleContext.Provider>
    )
}
