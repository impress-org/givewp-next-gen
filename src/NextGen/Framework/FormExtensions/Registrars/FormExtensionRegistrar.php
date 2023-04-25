<?php

namespace Give\NextGen\Framework\FormExtensions\Registrars;

use Give\Framework\Exceptions\Primitives\InvalidArgumentException;
use Give\Log\Log;
use Give\NextGen\Framework\FormExtensions\Exceptions\OverflowException;
use Give\NextGen\Framework\FormExtensions\FormExtension;

/**
 * @unreleased 
 */
class FormExtensionRegistrar
{
    /**
     * @var array
     */
    protected $extensions = [];

    /**
     * @unreleased 
     */
    public function getExtensions(): array
    {
        return $this->extensions;
    }

    /**
     * @unreleased 
     *
     * @throws InvalidArgumentException
     */
    public function getExtension(string $id): FormExtension
    {
        if (!$this->hasExtension($id)) {
            throw new InvalidArgumentException("No extension exists with the ID {$id}");
        }

        /** @var FormExtension $extension */
        $extension = give($this->extensions[$id]);

        return $extension;
    }

    /**
     * @unreleased 
     */
    public function hasExtension(string $id): bool
    {
        return isset($this->extensions[$id]);
    }

    /**
     * @unreleased 
     */
    public function registerExtension(string $extensionClass)
    {
        try {
            $this->register($extensionClass);
        } catch (InvalidArgumentException $invalidArgumentException) {
            Log::error('Form Extension Registration', ['data' => $invalidArgumentException->getMessage()]);
            throw $invalidArgumentException;
        } catch (OverflowException $overflowException) {
            Log::error('Form Extension Registration ', ['data' => $overflowException->getMessage()]);
            throw $overflowException;
        }
    }

    /**
     * @unreleased 
     */
    public function unregisterExtension(string $extensionId)
    {
        if (isset($this->extensions[$extensionId])) {
            unset($this->extensions[$extensionId]);
        }
    }

    /**
     * @unreleased 
     *
     * @return void
     *
     * @throws OverflowException|InvalidArgumentException
     */
    private function register(string $extensionClass)
    {
        if (!is_subclass_of($extensionClass, FormExtension::class)) {
            throw new InvalidArgumentException(
                sprintf(
                    '%1$s must extend %2$s',
                    $extensionClass,
                    FormExtension::class
                )
            );
        }

        $extensionId = $extensionClass::id();

        if ($this->hasExtension($extensionId)) {
            throw new OverflowException("Cannot register a extension with an id that already exists: $extensionId");
        }

        $this->extensions[$extensionId] = $extensionClass;

        give()->singleton($extensionClass);
    }
}
