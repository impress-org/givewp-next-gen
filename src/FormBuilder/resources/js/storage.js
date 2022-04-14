window.storage = {
    save: () => {
        return new Promise((resolve, reject) => {
            reject(new Error("Save not implemented!!!!"));
        })
    },
    load: () => null,
}
