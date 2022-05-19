const gateways = [];

const paymentGatewayRegistrar = {
    registerGateway(gatewayLocalizedClassName, gateway) {
        gateway.id = gatewayLocalizedClassName.id;
        gateway.label = gatewayLocalizedClassName.label;

        gateways.push(gateway);
    },
    getAll() {
        return gateways;
    }
}

window.givewp = {
    gateways: paymentGatewayRegistrar
}
