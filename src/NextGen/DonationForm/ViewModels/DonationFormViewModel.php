<?php

namespace Give\NextGen\DonationForm\ViewModels;

use Give\NextGen\DonationForm\Actions\GenerateDonateRouteUrl;
use Give\NextGen\DonationForm\Blocks\DonationFormBlock\DataTransferObjects\BlockAttributes;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;

/**
 * @unreleased
 */
class DonationFormViewModel
{
    /**
     * @var BlockAttributes
     */
    private $attributes;
    /**
     * @var int
     */
    private $formId;

    /**
     * @unreleased
     */
    public function __construct(BlockAttributes $attributes)
    {
        $this->attributes = $attributes;
    }

    /**
     * @unreleased
     */
    public function exports(): array
    {
        /** @var DonationFormRepository $donationFormRepository */
        $donationFormRepository = give(DonationFormRepository::class);

        $donateUrl = (new GenerateDonateRouteUrl())();
        $donationForm = $donationFormRepository->createFieldsApiForm($this->attributes->formId);
        $formDataGateways = $donationFormRepository->getFormDataGateways($this->attributes->formId);

        return [
            'attributes' => $this->attributes->toArray(),
            'form' => $donationForm->jsonSerialize(),
            'donateUrl' => $donateUrl,
            'successUrl' => give_get_success_page_uri(),
            'gatewaySettings' => $formDataGateways,
        ];
    }
}
