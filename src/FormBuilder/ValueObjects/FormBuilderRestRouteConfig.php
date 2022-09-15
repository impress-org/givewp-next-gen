<?php

namespace Give\FormBuilder\ValueObjects;

use Give\Framework\Support\ValueObjects\Enum;

/**
 * @unreleased
 *
 * @method static FormBuilderRestRouteConfig NAMESPACE()
 * @method static FormBuilderRestRouteConfig PATH()
 */
class FormBuilderRestRouteConfig extends Enum
{
    const NAMESPACE = 'givewp/next-gen';
    const PATH = '/form/(?P<id>\d+)';
}
