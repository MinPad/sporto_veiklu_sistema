<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\City;
use PHPUnit\Framework\Attributes\Test;

class CityControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_cities()
    {
        City::factory()->create(['name' => 'Vilnius']);
        City::factory()->create(['name' => 'Kaunas']);

        $response = $this->getJson('/api/cities');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'latitude',
                    'longitude',
                ]
            ]
        ]);
    }
    #[Test]
    public function it_can_search_cities_by_name()
    {
        City::factory()->create(['name' => 'Vilnius']);
        City::factory()->create(['name' => 'Kaunas']);
        City::factory()->create(['name' => 'Klaipėda']);
    
        $response = $this->getJson('/api/cities?search=vilnius');
    
        $response->assertStatus(200);
    
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.name', 'Vilnius');
    }
    #[Test]
    public function it_can_show_a_city()
    {
        $city = City::factory()->create([
            'name' => 'Vilnius',
        ]);
    
        $response = $this->getJson('/api/cities/' . $city->id);
    
        $response->assertStatus(200);
        $response->assertJsonPath('name', 'Vilnius');
        $response->assertJsonStructure([
        'id',
        'name',
        'latitude',
        'longitude',
        ]);
    }
    #[Test]
    public function it_returns_404_if_city_not_found()
    {
        $response = $this->getJson('/api/cities/9999');
    
        $response->assertStatus(404);
        $response->assertJson([
            'message' => 'A city with this ID doesn\'t exist',
        ]);
    }
    #[Test]
    public function admin_can_create_a_city()
    {
        $admin = \App\Models\User::factory()->create([
            'role' => 'Admin',
        ]);
        $token = auth()->login($admin);
    
        $payload = [
            'name' => 'NewCityName',
        ];
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/cities', $payload);
    
        $response->assertStatus(201);
        $response->assertJsonPath('name', 'NewCityName');
    
        $this->assertDatabaseHas('cities', [
            'name' => 'NewCityName',
        ]);
    }
    #[Test]
    public function non_admin_cannot_create_city()
    {
        $user = \App\Models\User::factory()->create([
            'role' => 'User',
        ]);
        $token = auth()->login($user);
    
        $payload = [
            'name' => 'UnauthorizedCity',
        ];
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/cities', $payload);
    
        $response->assertStatus(403);
    }
    #[Test]
    public function admin_can_delete_a_city()
    {
        $admin = \App\Models\User::factory()->create([
            'role' => 'Admin',
        ]);
        $token = auth()->login($admin);
    
        $city = \App\Models\City::factory()->create([
            'name' => 'DeleteCity',
        ]);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->deleteJson('/api/cities/' . $city->id);
    
        $response->assertStatus(204);
        $this->assertDatabaseMissing('cities', [
            'id' => $city->id,
        ]);
    }
    #[Test]
    public function non_admin_cannot_delete_city()
    {
        $user = \App\Models\User::factory()->create([
            'role' => 'User',
        ]);
        $token = auth()->login($user);
    
        $city = \App\Models\City::factory()->create([
            'name' => 'ProtectedCity',
        ]);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->deleteJson('/api/cities/' . $city->id);
    
        $response->assertStatus(403);
        $this->assertDatabaseHas('cities', [
            'id' => $city->id,
        ]);
    }

}
