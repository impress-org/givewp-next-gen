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
     * @var DonationForm
     */
    private $donationForm;
    /**
     * @var BlockCollection
     */
    private $blocks;
    /**
     * @var array
     */
    private $formSettings;

    /**
     * @unreleased
     */
    public function __construct(DonationForm $donationForm, BlockCollection $blocks = null, array $formSettings = [])
    {
        $this->donationForm = $donationForm;
        $this->blocks = $blocks;
        $this->formSettings = $formSettings;
    }

    /**
     * @unreleased
     */
    public function templateId(): string
    {
        return $this->formSettings['templateId'] ?? ($this->donationForm->settings['templateId'] ?? '');
    }

    /**
     * @unreleased
     */
    public function primaryColor(): string
    {
        return $this->formSettings['primaryColor'] ?? ($this->donationForm->settings['primaryColor'] ?? '');
    }

    /**
     * @unreleased
     */
    public function secondaryColor(): string
    {
        return $this->formSettings['secondaryColor'] ?? ($this->donationForm->settings['secondaryColor'] ?? '');
    }

    /**
     * @unreleased
     */
    public function exports(): array
    {
        /** @var DonationFormRepository $donationFormRepository */
        $donationFormRepository = give(DonationFormRepository::class);

        $donateUrl = (new GenerateDonateRouteUrl())();

        $formDataGateways = $donationFormRepository->getFormDataGateways($this->donationForm->id);
        $formApi = $donationFormRepository->getFormSchemaFromBlocks(
            $this->donationForm->id,
            $this->blocks ?: $this->donationForm->blocks
        )->jsonSerialize();

        return [
            'form' => $formApi,
            'donateUrl' => $donateUrl,
            'successUrl' => give_get_success_page_uri(),
            'gatewaySettings' => $formDataGateways
        ];
    }
}
