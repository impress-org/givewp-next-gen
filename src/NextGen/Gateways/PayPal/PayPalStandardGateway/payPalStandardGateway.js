const paypalStandardGateway = {
    id: 'paypal',
    initialize() {
    },
    Fields() {
        return paypalStandardGateway.settings.fields;
    },
}

window.givewp.gateways.register(paypalStandardGateway);
