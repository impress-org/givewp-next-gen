<?php

namespace Give\Framework\TemplateTags;

use Give\Donations\Models\Donation;
use Give\Framework\TemplateTags\Actions\TransformTemplateTags;

class DonationTemplateTags
{
    /**
     * @var Donation
     */
    protected $donation;
    /**
     * @var string
     */
    protected $content;
    /**
     * @var bool
     */
    protected $supportsV2FormTags;

    /**
     * @since 0.1.0
     */
    public function __construct(Donation $donation, string $content)
    {
        $this->donation = $donation;
        $this->content = $content;
    }

    /**
     * @unreleased
     */
    public function supportsV2FormTags(bool $supportsV2FormTags = true): self
    {
        $this->supportsV2FormTags = $supportsV2FormTags;

        return $this;
    }

    /**
     * @unreleased added support for v2 form tags
     * @since 0.1.0
     */
    public function getContent(): string
    {
        $content = (new TransformTemplateTags())($this->content, $this->getTags());

        if (!$this->supportsV2FormTags) {
            return $content;
        }

        return give_do_email_tags($content, ['payment_id' => $this->donation->id, 'form_id' => $this->donation->formId]
        );
    }

    /**
     * @since 0.1.0
     */
    protected function getTags(): array
    {
        return [
            '{first_name}' => $this->donation->firstName,
            '{last_name}' => $this->donation->lastName,
            '{email}' => $this->donation->email,
        ];
    }
}