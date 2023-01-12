export function checkForReceipt() {
    const parentUrlParams = new URLSearchParams(window.top.location.search);
    const isReceipt = parentUrlParams.has('givewp-receipt-id');

    return {
        isReceipt,
        receiptId: isReceipt ? parentUrlParams.get('givewp-receipt-id') : null,
    }
}

export function redirectToReceipt(receiptId){
    const receiptUrl = `${window.location.origin}/?givewp-route=donation-confirmation-receipt-view&receipt-id=${receiptId}`;

    window.location.assign(receiptUrl);
}