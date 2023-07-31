<?php
declare(strict_types=1);

namespace Give\DonationForms\Rules;

use Closure;
use Give\Framework\Http\Types\FileType;
use Give\Vendors\StellarWP\Validation\Config;
use Give\Vendors\StellarWP\Validation\Contracts\ValidationRule;

class FileRule implements ValidationRule
{
       /**
     * @var int
     */
    private $size;

    /**
     * @unreleased
     */
    public function __construct(int $size)
    {
        if ($size <= 0) {
            Config::throwInvalidArgumentException('File validation rule requires a non-negative value');
        }

        $this->size = $size;
    }

     /**
     * @unreleased
     */
    public static function id(): string
    {
        return 'file';
    }

    /**
     * @unreleased
     */
    public function getSize(): int
    {
        return $this->size;
    }


    /**
     * @unreleased
     **/
    public function __invoke($value, Closure $fail, string $key, array $values)
    {
        try {
            $fileType = FileType::fromArray($value);

            if ($fileType->size > $this->getSize()) {
                $fail(sprintf(__('%s must be less than or equal to %d bytes', 'give'), '{field}', $this->getSize()));
            }

            if ($fileType->error !== UPLOAD_ERR_OK) {
                $fail(sprintf(__('%s must be a valid file', 'give'), '{field}'));
            }
        } catch (\Throwable $e) {
            $fail(sprintf(__('%s must be a valid file', 'give'), '{field}'));
        }
    }

    /**
     * @unreleased
     */
    public static function fromString(string $options = null): ValidationRule
    {
        return new self((int)$options);
    }
}