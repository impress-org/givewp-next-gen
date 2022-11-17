<?php

namespace Give\NextGen\DonationForm\Routes;

use Exception;
use Give\Framework\PaymentGateways\Exceptions\PaymentGatewayException;
use Give\Framework\PaymentGateways\Log\PaymentGatewayLog;
use Give\Framework\PaymentGateways\PaymentGateway;
use Give\Framework\PaymentGateways\PaymentGatewayRegister;
use Give\Framework\PaymentGateways\Traits\HandleHttpResponses;
use Give\Log\Log;
use Give\NextGen\DonationForm\Controllers\DonateController;
use Give\NextGen\DonationForm\DataTransferObjects\DonateFormRouteData;
use Give\NextGen\DonationForm\DataTransferObjects\DonateRouteData;
use Give\NextGen\DonationForm\Exceptions\DonationFormFieldErrorsException;

/**
 * @unreleased
 */
class DonateRoute
{
    use HandleHttpResponses;

    /**
     * @var PaymentGatewayRegister
     */
    private $paymentGatewayRegister;
    /**
     * @var DonateController
     */
    private $donateController;

    /**
     * @unreleased
     *
     * @param  PaymentGatewayRegister  $paymentGatewayRegister
     * @param  DonateController  $donateController
     */
    public function __construct(PaymentGatewayRegister $paymentGatewayRegister, DonateController $donateController)
    {
        $this->paymentGatewayRegister = $paymentGatewayRegister;
        $this->donateController = $donateController;
    }

    /**
     * @unreleased
     *
     * @return void
     *
     * @throws PaymentGatewayException
     */
    public function __invoke()
    {
        if ($this->isValidListener()) {
            // create DTO from GET request
            $routeData = DonateRouteData::fromRequest(give_clean($_GET));

            // validate signature
            $this->validateSignature($routeData->routeSignature, $routeData);

            // get data from post request
            $request = file_get_contents('php://input');
            $postData = json_decode($request, true);

            // create DTO from POST request
            $formData = DonateFormRouteData::fromRequest(give_clean($postData));

            // get all registered gateways
            $paymentGateways = $this->paymentGatewayRegister->getPaymentGateways();

            // get all registered gateway ids
            $gatewayIds = array_keys($paymentGateways);

            // make sure gateway is valid
            $this->validateGateway($formData->gatewayId, $gatewayIds);

            /** @var PaymentGateway $gateway */
            $gateway = give($paymentGateways[$formData->gatewayId]);

            try {
                $data = $formData->validated();

                $this->donateController->donate($data, $gateway);
            } catch (DonationFormFieldErrorsException $exception) {
                Log::error(
                    'Donation Form Field Errors',
                    [
                        'exceptionMessage' => $exception->getMessage(),
                        'formData' => $formData,
                        'errors' => $exception->getError()
                    ]
                );

                wp_send_json_error(['errors' => $exception->getError()]);
            } catch (Exception $exception) {
                Log::error(
                    'Donation Error',
                    [
                        'exceptionMessage' => $exception->getMessage(),
                        'formData' => $formData,
                        'gateway' => $gateway,
                        'routeData' => $data
                    ]
                );

                wp_send_json_error();
            }

            exit;
        }
    }

    /**
     * Check if the listener is valid
     *
     * @unreleased
     */
    private function isValidListener(): bool
    {
        return isset($_GET['give-listener']) && $_GET['give-listener'] === 'give-donate';
    }

    /**
     * @unreleased
     *
     * @return void
     */
    private function validateSignature(string $routeSignature, DonateRouteData $data)
    {
        $signature = new DonateRouteSignature(
            $data->routeSignatureId,
            $data->routeSignatureExpiration
        );

        if (!$signature->isValid($routeSignature)) {
            PaymentGatewayLog::error(
                'Invalid Secure Route',
                [
                    'routeSignature' => $routeSignature,
                    'signature' => $signature,
                    'signatureString' => $signature->toString(),
                    'signatureHash' => $signature->toHash(),
                    'signatureExpiration' => $signature->expiration,
                    'data' => $data
                ]
            );

            wp_die('Forbidden', 403);
        }
    }

    /**
     * @unreleased
     *
     * @return void
     * @throws PaymentGatewayException
     */
    private function validateGateway(string $paymentGateway, array $gatewayIds)
    {
        if (!in_array($paymentGateway, $gatewayIds, true)) {
            throw new PaymentGatewayException('This gateway is not valid.');
        }
    }
}
