<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\City;
use App\Models\Gym;
use App\Models\User;
use PHPUnit\Framework\Attributes\Test;

class GymControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_gyms_in_a_city()
    {
        $city = City::factory()->create();

        Gym::factory()->count(3)->create([
            'city_id' => $city->id,
        ]);

        $response = $this->getJson('/api/cities/' . $city->id . '/gyms');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'name',
                    'cityId',
                    'cityName',
                    'address',
                    'description',
                    'openingHours',
                    'image_url',
                    'latitude',
                    'longitude',
                    'isFree',
                    'monthlyFee',
                    'reviews_avg_rating',
                    'specialties',
                ]
            ]
        ]);
    }
    #[Test]
    public function it_can_search_gyms_by_name()
    {
        $city = City::factory()->create();
    
        Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'Super Gym Vilnius',
        ]);
    
        Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'Mega Fitness Kaunas',
        ]);
    
        $response = $this->getJson('/api/cities/' . $city->id . '/gyms?search=vilnius');
    
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.name', 'Super Gym Vilnius');
    }
    #[Test]
    public function it_can_show_a_gym_by_id()
    {
        $city = City::factory()->create();
        $gym = Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'Test Gym',
        ]);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . auth()->login(User::factory()->create()))
                         ->getJson('/api/gyms/' . $gym->id);
    
        $response->assertStatus(200);
        $response->assertJsonPath('name', 'Test Gym');
        $response->assertJsonStructure([
            'id',
            'name',
            'cityId',
            'cityName',
            'address',
            'description',
            'openingHours',
            'image_url',
            'latitude',
            'longitude',
            'isFree',
            'monthlyFee',
            'reviews_avg_rating',
            'specialties',
        ]);
    }
    #[Test]
    public function it_returns_404_if_gym_not_found()
    {
        $response = $this->withHeader('Authorization', 'Bearer ' . auth()->login(\App\Models\User::factory()->create()))
                         ->getJson('/api/gyms/9999');
    
        $response->assertStatus(404);
        $response->assertJson([
            'message' => 'Gym not found',
        ]);
    }
    #[Test]
    public function it_can_show_a_gym_inside_a_city()
    {
        $city = \App\Models\City::factory()->create();
        $gym = \App\Models\Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'City Gym',
        ]);
    
        $response = $this->getJson('/api/cities/' . $city->id . '/gyms/' . $gym->id);
    
        $response->assertStatus(200);
        $response->assertJsonPath('name', 'City Gym');
    }
    #[Test]
    public function it_returns_404_if_gym_not_in_city()
    {
        $city1 = \App\Models\City::factory()->create();
        $city2 = \App\Models\City::factory()->create();
        
        $gym = \App\Models\Gym::factory()->create([
            'city_id' => $city1->id,
            'name' => 'Mismatch Gym',
        ]);
    
        $response = $this->getJson('/api/cities/' . $city2->id . '/gyms/' . $gym->id);
    
        $response->assertStatus(404);
        $response->assertJson([
            'message' => 'There is no gym with that index in the city',
        ]);
    }
    #[Test]
    public function admin_can_create_a_gym()
    {
        $admin = \App\Models\User::factory()->create([
            'role' => 'Admin',
        ]);
        $token = auth()->login($admin);
    
        $city = \App\Models\City::factory()->create();
    
        \Storage::fake('public');
    
        $image = \Illuminate\Http\UploadedFile::fake()->image('gym.jpg');
    
        $payload = [
            'name' => 'New Gym',
            'address' => '123 Main St',
            'description' => 'Best gym ever!',
            'opening_hours' => '08:00 - 22:00',
            'latitude' => 54.6872,
            'longitude' => 25.2797,
            'is_free' => false,
            'monthly_fee' => 49.99,
            'image' => $image,
        ];
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/cities/' . $city->id . '/gyms', $payload);
    
        $response->assertStatus(201);
        $response->assertJsonPath('name', 'New Gym');
    
        \Storage::disk('public')->assertExists('gym-images/' . $image->hashName());
    
        $this->assertDatabaseHas('gyms', [
            'name' => 'New Gym',
            'city_id' => $city->id,
        ]);
    }
    #[Test]
    public function non_admin_cannot_create_gym()
    {
        $user = \App\Models\User::factory()->create([
            'role' => 'User',
        ]);
        $token = auth()->login($user);
    
        $city = \App\Models\City::factory()->create();
    
        $payload = [
            'name' => 'Unauthorized Gym',
            'address' => '456 Another St',
            'description' => 'Not allowed!',
            'opening_hours' => '08:00 - 22:00',
            'latitude' => 54.6872,
            'longitude' => 25.2797,
            'is_free' => false,
            'monthly_fee' => 49.99,
        ];
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/cities/' . $city->id . '/gyms', $payload);
    
        $response->assertStatus(403);
    }
    #[Test]
    public function admin_can_update_a_gym()
    {
        $admin = \App\Models\User::factory()->create([
            'role' => 'Admin',
        ]);
        $token = auth()->login($admin);
    
        $city = \App\Models\City::factory()->create();
        $gym = \App\Models\Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'Old Gym Name',
        ]);
    
        $payload = [
            'name' => 'Updated Gym Name',
            'address' => '789 Updated Street',
            'description' => 'Updated description of the gym.',
            'opening_hours' => '07:00 - 21:00',
            'latitude' => 54.7,
            'longitude' => 25.3,
            'is_free' => false,
            'monthly_fee' => 59.99,
        ];
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->putJson('/api/cities/' . $city->id . '/gyms/' . $gym->id, $payload);
    
        $response->assertStatus(200);
        $response->assertJsonPath('name', 'Updated Gym Name');
        $response->assertJsonPath('address', '789 Updated Street');
    
        $this->assertDatabaseHas('gyms', [
            'id' => $gym->id,
            'name' => 'Updated Gym Name',
            'address' => '789 Updated Street',
        ]);
    }
    #[Test]
    public function non_admin_cannot_update_gym()
    {
        $user = \App\Models\User::factory()->create([
            'role' => 'User',
        ]);
        $token = auth()->login($user);
    
        $city = \App\Models\City::factory()->create();
        $gym = \App\Models\Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'Unchangeable Gym',
        ]);
    
        $payload = [
            'name' => 'Should Not Update',
            'address' => '123 Forbidden St',
            'description' => 'Trying to change',
            'opening_hours' => '09:00 - 20:00',
            'latitude' => 55.0,
            'longitude' => 26.0,
            'is_free' => true,
        ];
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->putJson('/api/cities/' . $city->id . '/gyms/' . $gym->id, $payload);
    
        $response->assertStatus(403);
    }
    #[Test]
    public function admin_can_delete_a_gym()
    {
        $admin = \App\Models\User::factory()->create([
            'role' => 'Admin',
        ]);
        $token = auth()->login($admin);
    
        $city = \App\Models\City::factory()->create();
        $gym = \App\Models\Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'Delete Gym',
        ]);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->deleteJson('/api/cities/' . $city->id . '/gyms/' . $gym->id);
    
        $response->assertStatus(204); 
        $this->assertDatabaseMissing('gyms', [
            'id' => $gym->id,
        ]);
    }
    #[Test]
    public function non_admin_cannot_delete_gym()
    {
        $user = \App\Models\User::factory()->create([
            'role' => 'User',
        ]);
        $token = auth()->login($user);
    
        $city = \App\Models\City::factory()->create();
        $gym = \App\Models\Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'Protected Gym',
        ]);
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->deleteJson('/api/cities/' . $city->id . '/gyms/' . $gym->id);
    
        $response->assertStatus(403);
        $this->assertDatabaseHas('gyms', [
            'id' => $gym->id,
        ]);
    }
    
    
    
    
    
    
    
    
    
}