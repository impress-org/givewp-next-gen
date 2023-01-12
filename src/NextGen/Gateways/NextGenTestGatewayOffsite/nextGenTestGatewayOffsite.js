const gateway = {
    id: 'test-gateway-next-gen-offsite',
    Fields() {
        return "There are no fields for this gateway and you will not be charged. This payment option is only for you to test the donation experience.";
    },
};

window.givewp.gateways.register(gateway);
