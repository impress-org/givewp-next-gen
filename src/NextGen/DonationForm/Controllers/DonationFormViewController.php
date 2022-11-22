<?php

namespace Give\NextGen\DonationForm\Controllers;

use Give\NextGen\DonationForm\DataTransferObjects\DonationFormPreviewRouteData;
use Give\NextGen\DonationForm\DataTransferObjects\DonationFormViewRouteData;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\NextGen\DonationForm\ViewModels\DonationFormViewModel;

class DonationFormViewController
{
    /**
     * This renders the donation form view.
     *
     * @unreleased
     */
    public function show(DonationFormViewRouteData $data): string
    {
        /** @var DonationForm $donationForm */
        $donationForm = DonationForm::find($data->formId);

        $viewModel = new DonationFormViewModel(
            $donationForm->id,
            $donationForm->blocks,
            $donationForm->settings
        );

        return $viewModel->render();
    }

    /**
     * This renders the donation form preview
     *
     * @unreleased
     */
    public function preview(DonationFormPreviewRouteData $data): string
    {
        /** @var DonationForm $donationForm */
        $donationForm = DonationForm::find($data->formId);

        $viewModel = new DonationFormViewModel(
            $donationForm->id,
            $data->formBlocks ?: $donationForm->blocks,
            array_merge($donationForm->settings, $data->formSettings)
        );

        return $viewModel->render();
    }
}
