<?php

namespace Give\NextGen\DonationForm\ViewModels;

use Give\NextGen\DonationForm\Actions\GenerateDonateRouteUrl;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\Repositories\DonationFormRepository;
use Give\NextGen\Framework\Blocks\BlockCollection;

/**
 * @unreleased
 */
class DonationFormViewModel
{
    /**
     * @var int
     */
    private $formId;
    /**
     * @var string
     */
    private $formTemplateId;
    /**
     * @var BlockCollection|null
     */
    private $blocks;

    /**
     * @unreleased
     * @param  int  $formId
     * @param  BlockCollection|null  $blocks
     */
    public function __construct(int $formId, $blocks)
    {
        $this->formId = $formId;
        $this->blocks = $blocks;
    }

    /**
     * @unreleased
     */
    public function exports(): array
    {
        /** @var DonationFormRepository $donationFormRepository */
        $donationFormRepository = give(DonationFormRepository::class);

        $donateUrl = (new GenerateDonateRouteUrl())();

        /** @var DonationForm $donationForm */
        $donationForm = DonationForm::find($this->formId);
        $formDataGateways = $donationFormRepository->getFormDataGateways($this->formId);
        $formApi = $donationForm->schema($this->blocks)->jsonSerialize();

        return [
            'form' => $formApi,
            'donateUrl' => $donateUrl,
            'successUrl' => give_get_success_page_uri(),
            'gatewaySettings' => $formDataGateways
        ];
    }
}
