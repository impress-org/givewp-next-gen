const gateways = [];

const paymentGatewayRegistrar = {
    register(gatewayLocalizedClassName, gateway) {
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
