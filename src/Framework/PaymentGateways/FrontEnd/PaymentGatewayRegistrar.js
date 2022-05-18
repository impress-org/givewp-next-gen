const paymentGatewayRegistrar = {
    gateways: [],

    registerGateway(gateway){
        this.gateways.push(gateway);
    }
}

window.GivePaymentGatewayRegistrar = paymentGatewayRegistrar;
