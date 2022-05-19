const gateways = [];

const paymentGatewayRegistrar = {
    registerGateway(gateway) {
        gateways.push(gateway);
    },
    getAll() {
        return gateways;
    }
}

window.givewp = {
    gateways: paymentGatewayRegistrar
}
