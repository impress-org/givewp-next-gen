<?php

namespace Give\NextGen\DonationForm\Factories;

use Give\Framework\Models\Factories\ModelFactory;
use Give\NextGen\DonationForm\ValueObjects\DonationFormStatus;
use Give\NextGen\Framework\Blocks\BlockCollection;
use Give\NextGen\Framework\Blocks\BlockModel;

class DonationFormFactory extends ModelFactory
{
    /**
     * @unreleased
     */
    public function definition(): array
    {
        return [
            'title' => 'Form Title',
            'status' => DonationFormStatus::PENDING(),
            'settings' => [
                'enableDonationGoal' => false,
                'enableAutoClose' => false,
                'registration' => 'none',
                'goalFormat' => 'amount-raised',
            ],
            'blockCollection' => $this->getMockBlockCollection(),
        ];
    }

    /**
     * @unreleased
     */
    protected function getMockBlockCollection(): BlockCollection
    {
        $blocks = [];

        foreach ($this->getMockFormBuilderData() as $blockData) {
            $blocks[] = BlockModel::make($blockData);
        }

        return new BlockCollection(...$blocks);
    }

    /**
     * @unreleased
     */
    public function getMockFormBuilderData(): array
    {
        return [
            [
                "clientId" => "5dd8982a-9189-4b8d-ab98-aee233693c38",
                "name" => "custom-block-editor/donation-amount",
                "isValid" => true,
                "originalContent" => "",
                "validationIssues" => [
                ],
                "attributes" => [
                    "title" => "How much would you like to donate today?",
                    "description" => "All donations directly impact our organization and help us further our mission.",
                    "allowedBlocks" => true,
                    "innerBlocksTemplate" => [
                        [
                            "custom-block-editor/donation-amount-levels",
                            [
                                "lock" => [
                                    "remove" => true
                                ]
                            ]
                        ]
                    ]
                ],
                "innerBlocks" => [
                    [
                        "clientId" => "f964be39-086b-4ef5-8544-0c7720237370",
                        "name" => "custom-block-editor/donation-amount-levels",
                        "isValid" => true,
                        "attributes" => [
                            "levels" => [
                                "30",
                                "50",
                                "75",
                                "100",
                                "250"
                            ],
                            "lock" => [
                                "remove" => true
                            ]
                        ],
                        "innerBlocks" => [
                        ]
                    ]
                ]
            ],
            [
                "clientId" => "c33e6118-2499-4c3d-a3c7-d0fc5723411c",
                "name" => "custom-block-editor/donor-info",
                "isValid" => true,
                "originalContent" => "",
                "validationIssues" => [
                ],
                "attributes" => [
                    "title" => "Who's Giving Today?",
                    "description" => "We'll never share this information with anyone.",
                    "allowedBlocks" => true,
                    "showHonorific" => true,
                    "innerBlocksTemplate" => [
                        [
                            "custom-block-editor/donor-name",
                            [
                                "lock" => [
                                    "remove" => true
                                ]
                            ]
                        ],
                        [
                            "custom-block-editor/email-field"
                        ]
                    ]
                ],
                "innerBlocks" => [
                    [
                        "clientId" => "452e207d-9541-4dc5-a396-4186bfdf1a14",
                        "name" => "custom-block-editor/donor-name",
                        "isValid" => true,
                        "attributes" => [
                            "lock" => [
                                "remove" => true
                            ],
                            "showHonorific" => true,
                            "honoriphics" => [
                                "Mr",
                                "Ms",
                                "Mrs"
                            ],
                            "requireLastName" => false
                        ],
                        "innerBlocks" => [
                        ]
                    ],
                    [
                        "clientId" => "793bd614-7923-4be3-b875-b8390de2f967",
                        "name" => "custom-block-editor/email-field",
                        "isValid" => true,
                        "attributes" => [
                            "label" => "Email Address"
                        ],
                        "innerBlocks" => [
                        ]
                    ],
                    [
                        "clientId" => "dbfec781-0875-45c9-9977-249d895dda4d",
                        "name" => "custom-block-editor/company-field",
                        "isValid" => true,
                        "attributes" => [
                            "label" => "Company Name"
                        ],
                        "innerBlocks" => [
                        ]
                    ]
                ]
            ],
            [
                "clientId" => "6bdca886-bc33-4804-84fd-6631f824a919",
                "name" => "custom-block-editor/payment-details",
                "isValid" => true,
                "originalContent" => "",
                "validationIssues" => [
                ],
                "attributes" => [
                    "title" => "Payment Details",
                    "description" => "How would you like to pay for your donation?",
                    "allowedBlocks" => true,
                    "innerBlocksTemplate" => [
                        [
                            "custom-block-editor/payment-gateways",
                            [
                                "lock" => [
                                    "remove" => true
                                ]
                            ]
                        ]
                    ]
                ],
                "innerBlocks" => [
                    [
                        "clientId" => "d15a48fc-05a9-4064-9f44-9585b30b7a61",
                        "name" => "custom-block-editor/payment-gateways",
                        "isValid" => true,
                        "attributes" => [
                            "lock" => [
                                "remove" => true
                            ]
                        ],
                        "innerBlocks" => [
                        ]
                    ]
                ]
            ],
            [
                "clientId" => "17cc5090-1e82-49bc-883f-ce5590f1f3f8",
                "name" => "custom-block-editor/section",
                "isValid" => true,
                "attributes" => [
                    "title" => "Donation Summary",
                    "description" => "Here is what you're abut to donate",
                    "allowedBlocks" => true,
                    "innerBlocksTemplate" => [
                        [
                            "custom-block-editor/field",
                            [
                            ]
                        ]
                    ]
                ],
                "innerBlocks" => [
                    [
                        "clientId" => "38cbc2e7-1123-4631-8816-0ec534601653",
                        "name" => "custom-block-editor/donation-summary",
                        "isValid" => true,
                        "attributes" => [
                        ],
                        "innerBlocks" => [
                        ]
                    ]
                ]
            ]
        ];
    }
}
