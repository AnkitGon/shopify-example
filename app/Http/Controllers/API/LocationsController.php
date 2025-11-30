<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Osiset\ShopifyApp\Services\ChargeHelper;
use Illuminate\Support\Facades\Auth;

class LocationsController extends Controller
{
    public function index()
    {
        $shop = Auth::user();
        $query = <<<'GRAPHQL'
            {
                locations(first: 50) {
                    edges {
                    node {
                        id
                        name
                        address {
                        address1
                        city
                        province
                        country
                        zip
                        }
                        isActive
                    }
                    }
                }
            }
            GRAPHQL;
        $response = $shop->api()->graph($query);
        if ($response['errors'] !== false) {
            return $this->apiResponse(
                null,
                'Unable to fetch locations from Shopify.',
                500,
                false,
            );
        }

        $edges = $response['body']['container']['data']['locations']['edges'];

        $locations = array_map(function ($edge) {
            $node = $edge['node'];

            return [
                'id'   => $node['id'],
                'name' => $node['name'],
            ];
        }, $edges);

        return $this->apiResponse(
            ['locations' => $locations],
            'Locations fetched successfully.',
        );
    }
}
