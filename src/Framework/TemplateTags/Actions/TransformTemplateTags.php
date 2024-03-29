<?php

namespace Give\Framework\TemplateTags\Actions;

class TransformTemplateTags
{
    /**
     * @since 0.1.0
     */
    public function __invoke(string $content, array $tags): string
    {
        return str_replace(
            array_keys($tags),
            array_values($tags),
            $content
        );
    }
}