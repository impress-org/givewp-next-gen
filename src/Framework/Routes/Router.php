<?php

namespace Give\Framework\Routes;

use Give\Framework\Exceptions\Primitives\InvalidArgumentException;

use function is_callable;
use function str_contains;

class Router
{
    /**
     * @since 0.1.0
     * @param  string  $uri
     * @param  string|callable  $action
     * @param  string  $method
     *
     * @return void
     */
    public function get(string $uri, $action, $method = '__invoke')
    {
        $this->addRoute('GET', $method, $uri, $action);
    }

    /**
     * @since 0.1.0
     * @param  string  $uri
     * @param  string|callable  $action
     * @param  string  $method
     *
     * @return void
     */
    public function post(string $uri, $action, $method = '__invoke')
    {
        $this->addRoute('POST', $method, $uri, $action);
    }

    /**
     * @since 0.1.0
     */
    protected function isRouteValid(string $route): bool
    {
        return isset($_GET['givewp-route']) && $_GET['givewp-route'] === $route;
    }

    /**
     * @since 0.1.0
     */
    protected function getRequestDataByType(string $type): array
    {
        if ($type === 'POST'){
            return $this->getDataFromPostRequest();
        }

        return $this->getDataFromGetRequest();
    }

    /**
     * @unreleased add support for multipart/form-data content-type
     * @since 0.1.0
     */
    protected function getDataFromPostRequest(): array
    {
        $requestData = [];

        if (!isset($_SERVER['CONTENT_TYPE'])) {
            return $requestData;
        }

        $contentType = $_SERVER['CONTENT_TYPE'];

        // v2 forms use "application/x-www-form-urlencoded"
        // v3 forms use "multipart/form-data" and/or "application/json"
        if (str_contains($contentType, "application/x-www-form-urlencoded") || str_contains(
                $contentType,
                "multipart/form-data"
            )) {
            $requestData = array_merge(
                give_clean($_REQUEST),
                give_clean($_FILES)
            );
        }

        // this content type is typically used with the fetch api and our custom routes
        if (str_contains($contentType, "application/json")) {
            $requestData = file_get_contents('php://input');
            $requestData = json_decode($requestData, true);
            $requestData = give_clean($requestData);
        }

        return $requestData;
    }

    /**
     * @since 0.1.0
     */
    protected function getDataFromGetRequest(): array
    {
        return give_clean($_GET);
    }

    /**
     * @since 0.1.0
     *
     * @param  string  $type
     * @param  string  $method
     * @param  string  $uri
     * @param $action
     *
     * @return void
     */
    protected function addRoute(string $type, string $method, string $uri, $action)
    {
        add_action('template_redirect', function () use ($type, $method, $uri, $action) {
            if (!$this->isRouteValid($uri)) {
                // fail silently for use with template_redirect
                return;
            }

            $request = $this->getRequestDataByType($type);

            if (is_callable($action)) {
                return $action($request);
            }

            if (!method_exists($action, $method)) {
                throw new InvalidArgumentException("The method $method does not exist on $action");
            }

            return give($action)->$method($request);
        });
    }

    /**
     * @since 0.1.0
     */
    public function url(string $uri, array $args = []): string
    {
        return add_query_arg(
            array_merge(
                ['givewp-route' => $uri],
                $args
            ),
            home_url()
        );
    }
}