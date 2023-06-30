<?php

namespace Give\FormMigration;

use Give\FormMigration\DataTransferObjects\FormMigrationPayload;

class StepProcessor
{
    /**
     * @var FormMigrationPayload
     */
    protected $payload;

    public function __construct(FormMigrationPayload $payload)
    {
        $this->payload = $payload;
    }

    public function __invoke($step)
    {
        (new $step($this->payload))->process();
    }

    public function finally(callable $callback)
    {
        $callback($this->payload);
    }
}
