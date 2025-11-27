<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Accessibility') }}</title>
    <meta name="shopify-api-key" content="{{ env('SHOPIFY_API_KEY') }}" />
    <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
    <script src="https://cdn.shopify.com/shopifycloud/polaris.js"></script>
</head>

<body>

    <div id="app"></div>
    @viteReactRefresh
    @vite('resources/js/app.js')

</body>

</html>