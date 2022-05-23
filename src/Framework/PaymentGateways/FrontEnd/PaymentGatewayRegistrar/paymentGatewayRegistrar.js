/**
 * Get data from the server
 * @todo: update file to Typescript and define gateway types within framework
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

if (!window.givewp) {
    window.givewp = {};
}

window.givewp.gateways = paymentGatewayRegistrar;


