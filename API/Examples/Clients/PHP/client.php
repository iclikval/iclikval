<?php

require 'vendor/autoload.php';
use GuzzleHttp\Client;

// iCLiKVAL REST API endpoint
$endpoint = 'http://iclikval.riken.jp/api/';
// API Access Token
$token    = 'xxxxxxxxxxxxxxxxxxxxxxxxx'; // Replace with real access token
$resource = 'annotation';

$client = new GuzzleHttp\Client(['base_uri' => $endpoint]);

try {
    $response = $client->get($resource, [
    'headers' => [
        'User-Agent'    => 'MyApp/1.0',
        'Accept'        => 'application/json',
        'Authorization' => 'Bearer ' . $token
    ]]);

    echo $response->getBody()->getContents();
} catch (Exception $e) {
    echo $e->getMessage() . PHP_EOL;
}

?>
