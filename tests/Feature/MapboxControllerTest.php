<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class MapboxControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_returns_distance_and_duration_on_success()
    {
        Http::fake([
            '*' => Http::response([
                'routes' => [
                    [
                        'distance' => 5000, // 5 km
                        'duration' => 600,  // 10 minutes
                    ],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/mapbox/distance?origin=25.2798,54.6872&destination=25.2800,54.6875');

        $response->assertStatus(200)
                 ->assertJson([
                     'distance_km' => 5.0,
                     'duration_min' => 10,
                 ]);
    }

    #[Test]
    public function it_returns_400_if_origin_or_destination_missing()
    {
        $response = $this->getJson('/api/mapbox/distance?origin=25.2798,54.6872');

        $response->assertStatus(400)
                 ->assertJson([
                     'error' => 'Missing origin or destination',
                 ]);
    }

    #[Test]
    public function it_returns_500_if_mapbox_fails()
    {
        Http::fake([
            '*' => Http::response(null, 500),
        ]);

        $response = $this->getJson('/api/mapbox/distance?origin=25.2798,54.6872&destination=25.2800,54.6875');

        $response->assertStatus(500)
                 ->assertJson([
                     'error' => 'Mapbox request failed',
                 ]);
    }

    #[Test]
    public function it_returns_404_if_no_route_found()
    {
        Http::fake([
            '*' => Http::response([
                'routes' => [],
            ], 200),
        ]);

        $response = $this->getJson('/api/mapbox/distance?origin=25.2798,54.6872&destination=25.2800,54.6875');

        $response->assertStatus(404)
                 ->assertJson([
                     'error' => 'No route found',
                 ]);
    }
}