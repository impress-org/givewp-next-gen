window.storage = {
    save: ( blockData ) => {
        return new Promise((resolve, reject) => {
            jQuery.post( window.storageData.resourceURL, {
                blockData: JSON.stringify(blockData)
            } )
                .done(() => {
                    resolve()
                })
                .fail(() => {
                    reject(new Error("Save not implemented!!!!"))
                })
        })
    },
    load: () => {
        console.log( JSON.parse(window.storageData.blockData) )
        return JSON.parse(window.storageData.blockData);
    },
}
