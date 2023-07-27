/**
 * @since 0.1.0
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options
 */
export default async function postData(url: string, data: object = {}) {
    // TODO: WIP: trying out formData again for ease of file uploads, avoided using initially because of nested GatewayData structure
    const formData = new FormData();

    for (const key in data) {
        if (key === 'gatewayData') {
            for (let gatewayDataKey in data[key]) {
                formData.append(`gatewayData[${gatewayDataKey}]`, data[key][gatewayDataKey]);
            }

            continue;
        }

        formData.append(key, data[key]);
    }

    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        // headers: {
        //     'Content-Type': 'application/json',
        // },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer-when-downgrade', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: formData, // body data type must match "Content-Type" header
        //body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return {
        response,
    };
}
