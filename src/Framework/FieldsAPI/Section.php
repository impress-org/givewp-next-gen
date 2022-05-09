<?php

namespace Give\Framework\FieldsAPI;

/**
 * @unreleased
 */
class Section extends Group
{
    /**
     * @unreleased
     */
    const TYPE = 'section';

    /**
     * @unreleased
     *
     * @param  Field  ...$fields
     * @return $this
     */
    public function addFields(Field ...$fields): Section
    {
        $this->append(...$fields);

        return $this;
    }
}
