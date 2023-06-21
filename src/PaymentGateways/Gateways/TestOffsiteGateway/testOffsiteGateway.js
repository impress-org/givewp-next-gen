(() => {
    'use strict';
    const testOffsiteGateway = {
        id: 'test-offsite-gateway',
        Fields() {
            return testOffsiteGateway.settings.message;
        },
    };

    window.givewp.gateways.register(testOffsiteGateway);
})();
