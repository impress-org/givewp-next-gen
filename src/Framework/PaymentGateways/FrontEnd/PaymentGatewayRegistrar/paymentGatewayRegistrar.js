/**
 * Get data from the server
 */
const {gateways: formDataGateways} = window.giveNextGenExports;

const gateways = [];

const paymentGatewayRegistrar = {
    register(gatewayLocalizedClassName, gateway) {
        gateway.id = gatewayLocalizedClassName.id;
        gateway.label = gatewayLocalizedClassName.label;

        gateway?.initialize(formDataGateways[gateway.id]);

        gateways.push(gateway);
    },
    getAll() {
        return gateways;
    }
}

window.givewp = {
    gateways: paymentGatewayRegistrar
}
