const localStorageDriver = {
    save: ({ blocks, formTitle } ) => {
        console.log( 'Saving to local storage...' )
        return new Promise((resolve, reject) => {
            setTimeout( function() {
                localStorage.setItem('@givewp/form-builder.blocks', JSON.stringify(blocks) )
                localStorage.setItem('@givewp/form-builder.formTitle', formTitle )
                console.log( 'Saved to local storage!' )
                resolve()
            }, 1000)
        })
    },
    load: () => {
        console.log( 'Loading from local storage...' )
        const blocks = JSON.parse( localStorage.getItem('@givewp/form-builder.blocks' ) )
        const formTitle = localStorage.getItem('@givewp/form-builder.formTitle' )
        return {
            blocks,
            formTitle
        }
    },
}

export default localStorageDriver
