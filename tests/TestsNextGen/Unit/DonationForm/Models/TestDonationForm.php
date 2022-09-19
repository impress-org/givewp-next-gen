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

/**
 * @unreleased
 */
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

    /**
     * @unreleased
     *
     * @return void
     */
    public function testDonationFormShouldUpdate()
    {
        $donationForm = DonationForm::factory()->create([
            'formTitle' => 'New Donation Form',
        ]);

        $donationForm->formTitle = 'Updated Form Title';
        $donationForm->updateSetting('foo', 'bar');
        $donationForm->save();

        $donationFormFromDatabase = DonationForm::find($donationForm->id);

        $this->assertEquals('Updated Form Title', $donationFormFromDatabase->formTitle);
        $this->assertEquals('bar', $donationFormFromDatabase->getSetting('foo'));
    }
}
