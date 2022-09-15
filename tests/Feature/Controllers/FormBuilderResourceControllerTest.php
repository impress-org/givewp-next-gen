<?php

namespace TestsNextGen\Feature\Controllers;

use Give\FormBuilder\Controllers\FormBuilderResourceController;
use Give\FormBuilder\ValueObjects\FormBuilderRestRouteConfig;
use GiveTests\TestCase;
use GiveTests\TestTraits\RefreshDatabase;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

class FormBuilderResourceControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @unreleased
     *
     * @return void
     */
    public function testShowShouldReturnFormBuilderData()
    {
        $mockForm = $this->createMockForm();

        $mockRequest = $this->getMockRequest(WP_REST_Server::READABLE);

        $mockRequest->set_param('id', $mockForm->id);

        $formBuilderResourceController = new FormBuilderResourceController();

        $response = $formBuilderResourceController->show($mockRequest);

        $this->assertInstanceOf(WP_REST_Response::class, $response);

        $this->assertSame($response->data, [
            // we just need to compare the json stringified representation of the data so need to remove escaping from encode
            'blocks' => json_encode($mockForm->data, JSON_UNESCAPED_SLASHES),
            'settings' => json_encode($mockForm->settings)
        ]);
    }

    /**
     * @unreleased
     *
     * @return void
     */
    public function testUpdateShouldReturnUpdatedFormBuilderData()
    {
        $mockForm = $this->createMockForm();

        $mockRequest = $this->getMockRequest(WP_REST_Server::CREATABLE);

        $updatedSettings = array_merge($mockForm->settings, ['formTitle' => 'Updated Next Gen Form Builder Title']);

        $mockRequest->set_param('id', $mockForm->id);
        $mockRequest->set_param('settings', json_encode($updatedSettings, JSON_UNESCAPED_SLASHES));
        $mockRequest->set_param('blocks', json_encode($mockForm->data, JSON_UNESCAPED_SLASHES));

        $formBuilderResourceController = new FormBuilderResourceController();

        $response = $formBuilderResourceController->update($mockRequest);

        $this->assertInstanceOf(WP_REST_Response::class, $response);

        $this->assertSame($response->data, [
            'settings' => true,
            'form' => $mockForm->id,
        ]);

        $this->assertSame(json_encode($updatedSettings, JSON_UNESCAPED_SLASHES), get_post_meta($mockForm->id, 'formBuilderSettings', true));
    }

    /**
     * @unreleased
     */
    public function testUpdateShouldFailIfFormDoesNotExist()
    {
        $mockRequest = $this->getMockRequest(WP_REST_Server::CREATABLE);

        $mockRequest->set_param('id', 99);

        $formBuilderResourceController = new FormBuilderResourceController();

        $response = $formBuilderResourceController->update($mockRequest);

        $this->assertInstanceOf(WP_Error::class, $response);
        $this->assertSame(404, $response->get_error_code());
    }

    /**
     * @unreleased
     */
    public function testShowShouldFailIfFormDoesNotExist()
    {
        $mockRequest = $this->getMockRequest(WP_REST_Server::READABLE);

        $mockRequest->set_param('id', 99);

        $formBuilderResourceController = new FormBuilderResourceController();

        $response = $formBuilderResourceController->show($mockRequest);

        $this->assertInstanceOf(WP_Error::class, $response);
        $this->assertSame(404, $response->get_error_code());
    }

    /**
     * @return void
     */
    public function testUpdateShouldFailIfSettingsAreInvalid()
    {
        $this->markTestIncomplete();
    }

    /**
     * @return void
     */
    public function testUpdateShouldFailIfBlockDataIsInvalid()
    {
        $this->markTestIncomplete();
    }

    /**
     * @unreleased
     */
    public function createMockForm(): MockFormModel
    {
        $formId = wp_insert_post([
            'post_title'  => 'Test Next Gen Donation Form',
            'post_name'   => 'test-next-gen-donation-form',
            'post_type'   => 'give_forms',
            'post_status' => 'publish',
        ]);

        $mockFormModel = new MockFormModel($formId, $this->getMockFormBuilderData(), $this->getMockFormBuilderSettings());

        wp_update_post(
            [
                'ID' => $mockFormModel->id,
                'post_content' => json_encode($mockFormModel->data)
            ]
        );

        update_post_meta($mockFormModel->id, 'formBuilderSettings', wp_json_encode($mockFormModel->settings));

        return $mockFormModel;
    }

    /**
     * @unreleased
     */
    private function getMockFormBuilderData(): array
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

    /**
     * @unreleased
     */
    public function getMockFormBuilderSettings(): array
    {
        return [
           "formTitle" => "Next Gen Form",
           "enableDonationGoal" => false,
           "enableAutoClose" => false,
           "registration" => "none",
           "goalFormat" => "amount-raised"
        ];
    }

    /**
     *
     * @unreleased
     */
    public function getMockRequest(string $method): WP_REST_Request
    {
        return new WP_REST_Request(
            $method,
            '/wp/v2/' . FormBuilderRestRouteConfig::PATH
        );
    }
}


/**
 * Basic Mock Form Model
 */
class MockFormModel {
    /**
     * @var int
     */
    public $id;
    /**
     * @var array
     */
    public $data;
    /**
     * @var array
     */
    public $settings;

    /**
     * @unreleased
     */
    public function __construct(int $id, array $data, array $settings) {
        $this->id = $id;
        $this->data = $data;
        $this->settings = $settings;
    }
}
