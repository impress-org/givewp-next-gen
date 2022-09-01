<?php

namespace Give\NextGen\DonationForm\Routes;

use Give\NextGen\DonationForm\DataTransferObjects\DonationFormViewRouteData;

/**
 * @unreleased
 */
class DonationFormViewRoute
{
    /**
     * @unreleased
     *
     * @return void
     */
    public function __invoke()
    {
        if ($this->isViewValid()) {
            // create DTO from GET request
            $routeData = DonationFormViewRouteData::fromRequest(give_clean($_GET));

            echo $routeData->formId;
            
            exit;
        }
    }

    /**
     * @unreleased
     */
    private function isViewValid(): bool
    {
        return isset($_GET['givewp-view']) && $_GET['givewp-view'] === 'donation-form';
    }
}
