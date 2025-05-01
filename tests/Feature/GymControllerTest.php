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
    #[Test]
    public function it_filters_gyms_by_specialty()
    {
        $city = City::factory()->create();
        $specialty = \App\Models\Specialty::factory()->create(['name' => 'Yoga']);
    
        $gym = Gym::factory()->create(['city_id' => $city->id]);
        $gym->specialties()->attach($specialty);
    
        $response = $this->getJson("/api/cities/{$city->id}/gyms?specialties[]=Yoga");
    
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.name', $gym->name);
    }
    #[Test]
    public function it_filters_gyms_by_min_rating()
    {
        $city = City::factory()->create();
    
        $gym1 = Gym::factory()->create(['city_id' => $city->id]);
        $gym2 = Gym::factory()->create(['city_id' => $city->id]);
    
        \App\Models\GymReview::factory()->create(['gym_id' => $gym1->id, 'rating' => 5]);
        \App\Models\GymReview::factory()->create(['gym_id' => $gym2->id, 'rating' => 3]);
    
        $response = $this->getJson("/api/cities/{$city->id}/gyms");
        $response->assertStatus(200);
        
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        $this->assertTrue(
            collect($data)->contains(function ($gym) {
                return $gym['reviews_avg_rating'] >= 4;
            })
        );
        
        $response->assertJsonPath('data.0.id', $gym1->id);
    }
    #[Test]
    public function admin_can_create_gym_with_image_url()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);
        $city = City::factory()->create();
    
        $payload = [
            'name' => 'Gym With URL Image',
            'address' => '123 Online St',
            'description' => 'Image from URL!',
            'opening_hours' => '06:00 - 22:00',
            'latitude' => 54.7,
            'longitude' => 25.2,
            'is_free' => false,
            'monthly_fee' => 29.99,
            'image_url' => 'https://example.com/image.jpg',
        ];
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson("/api/cities/{$city->id}/gyms", $payload);
    
        $response->assertStatus(201);
        $response->assertJsonPath('name', 'Gym With URL Image');
    }
    #[Test]
    public function it_filters_gyms_by_pricing_free()
    {
        $city = City::factory()->create();
    
        Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'Free Gym',
            'is_free' => true,
        ]);
    
        Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'Paid Gym',
            'is_free' => false,
        ]);
    
        $response = $this->getJson("/api/cities/{$city->id}/gyms?pricing=free");
    
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.name', 'Free Gym');
    }
    
    #[Test]
    public function it_filters_gyms_by_pricing_paid()
    {
        $city = City::factory()->create();
    
        Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'Free Gym',
            'is_free' => true,
        ]);
    
        Gym::factory()->create([
            'city_id' => $city->id,
            'name' => 'Paid Gym',
            'is_free' => false,
        ]);
    
        $response = $this->getJson("/api/cities/{$city->id}/gyms?pricing=paid");
    
        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.name', 'Paid Gym');
    }
    #[Test]
    public function admin_can_create_gym_with_fallback_image()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);
    
        $city = City::factory()->create();
    
        $payload = [
            'name' => 'Fallback Image Gym',
            'address' => 'No Image St',
            'description' => 'No image provided.',
            'opening_hours' => '06:00 - 23:00',
            'latitude' => 54.68,
            'longitude' => 25.28,
            'is_free' => true,
        ];
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson("/api/cities/{$city->id}/gyms", $payload);
    
        $response->assertStatus(201);
        $response->assertJsonPath('name', 'Fallback Image Gym');
    
        $this->assertDatabaseHas('gyms', [
            'name' => 'Fallback Image Gym',
            'city_id' => $city->id,
        ]);
    }
    #[Test]
    public function it_returns_404_if_city_not_found_in_index()
    {
        $response = $this->getJson('/api/cities/9999/gyms');
    
        $response->assertStatus(404);
        $response->assertJson([
            'message' => 'City not found',
        ]);
    }
    #[Test]
    public function it_returns_404_if_city_not_found_in_show()
    {
        $gym = Gym::factory()->create();
    
        $response = $this->getJson('/api/cities/9999/gyms/' . $gym->id);
    
        $response->assertStatus(404);
        $response->assertJson([
            'message' => 'City not found',
        ]);
    }
    #[Test]
    public function it_returns_404_when_storing_gym_in_nonexistent_city()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);
    
        $payload = [
            'name' => 'Missing City Gym',
            'address' => 'Nowhere St',
            'description' => 'City does not exist',
            'opening_hours' => '06:00 - 22:00',
            'latitude' => 54.6,
            'longitude' => 25.3,
            'is_free' => true,
        ];
    
        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
                         ->postJson('/api/cities/9999/gyms', $payload);
    
        $response->assertStatus(404);
    }
    
    
    
    
            
    
    
    
    
    
    
    
    
    
    
    
    
}