<?php

namespace Give\DonationForm\Controllers;

use Give\DonationForm\DataTransferObjects\DonationFormPreviewRouteData;
use Give\DonationForm\DataTransferObjects\DonationFormViewRouteData;
use Give\DonationForm\Models\DonationForm;
use Give\DonationForm\ViewModels\DonationFormViewModel;

class DonationFormViewController
{
    /**
     * This renders the donation form view.
     *
     * @since 0.1.0
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
     * @since 0.1.0
     */
    public function preview(DonationFormPreviewRouteData $data): string
    {
        /** @var DonationForm $donationForm */
        $donationForm = DonationForm::find($data->formId);

        $viewModel = new DonationFormViewModel(
            $donationForm->id,
            $data->formBlocks ?: $donationForm->blocks,
            $data->formSettings ?: $donationForm->settings
        );

        return $viewModel->render(true);
    }
}
