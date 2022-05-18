(self["webpackChunk"] = self["webpackChunk"] || []).push([["/src/Framework/PaymentGateways/FrontEnd/PaymentGatewayRegistrar.build"],{

/***/ "./src/Framework/PaymentGateways/FrontEnd/PaymentGatewayRegistrar.js":
/*!***************************************************************************!*\
  !*** ./src/Framework/PaymentGateways/FrontEnd/PaymentGatewayRegistrar.js ***!
  \***************************************************************************/
/***/ (() => {

var paymentGatewayRegistrar = {
  gateways: [],
  registerGateway: function registerGateway(gateway) {
    this.gateways.push(gateway);
  }
};
window.GivePaymentGatewayRegistrar = paymentGatewayRegistrar;

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/Framework/PaymentGateways/FrontEnd/PaymentGatewayRegistrar.js"));
/******/ }
]);