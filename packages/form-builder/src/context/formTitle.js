import React, { createContext, useState } from 'react';

export const FormTitleContext = createContext();

export const FormTitleProvider = ({formTitle, setFormTitle, children}) => {

    return (
        <FormTitleContext.Provider value={[formTitle, setFormTitle]}>
            {children}
        </FormTitleContext.Provider>
    )
}
