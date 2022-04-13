import React, { useState } from 'react';

export default ( initialState = false ) => {
    const [ state, update ] = useState( initialState )

    const toggle = () => (
        update(prev => ! prev )
    )

    return { state, update, toggle }
}
