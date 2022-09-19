<?php

namespace TestsNextGen\Unit\DonationForm\Models;

use Exception;
use Give\Donations\Models\Donation;
use Give\Donations\Models\DonationNote;
use Give\Donations\ValueObjects\DonationStatus;
use Give\Donors\Models\Donor;
use Give\Framework\Support\ValueObjects\Money;
use Give\NextGen\DonationForm\Models\DonationForm;
use Give\PaymentGateways\Gateways\TestGateway\TestGateway;
use Give\Subscriptions\Models\Subscription;
use GiveTests\TestCase;
use GiveTests\TestTraits\RefreshDatabase;

class TestDonationForm extends TestCase
{
    use RefreshDatabase;

    /**
     * @unreleased
     *
     * @return void
     *
     * @throws Exception
     */
    public function testCreateShouldInsertDonationForm()
    {
        $donationForm = DonationForm::factory()->create();

        $donationFromDatabase = DonationForm::find($donationForm->id);

        $this->assertEquals($donationForm->getAttributes(), $donationFromDatabase->getAttributes());
    }
}
