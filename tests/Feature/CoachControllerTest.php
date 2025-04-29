<?php

namespace Tests\Feature;

use App\Models\City;
use App\Models\Coach;
use App\Models\Gym;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CoachControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_coaches_in_a_gym()
    {
        $city = City::factory()->create();
        $gym = Gym::factory()->create(['city_id' => $city->id]);

        Coach::factory()->count(3)->create(['gym_id' => $gym->id]);

        $response = $this->getJson("/api/cities/{$city->id}/gyms/{$gym->id}/coaches");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [['id', 'name', 'surname', 'isApproved', 'gymId']]
        ]);
    }

    #[Test]
    public function it_filters_coaches_by_specialty()
    {
        $city = City::factory()->create();
        $gym = Gym::factory()->create(['city_id' => $city->id]);
        $specialty = Specialty::factory()->create();

        $coachWithSpec = Coach::factory()->create(['gym_id' => $gym->id]);
        $coachWithSpec->specialties()->attach($specialty->id);

        Coach::factory()->create(['gym_id' => $gym->id]); // other coach without spec

        $response = $this->getJson("/api/cities/{$city->id}/gyms/{$gym->id}/coaches?specialty_ids[]={$specialty->id}");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $coachWithSpec->id);
    }

    #[Test]
    public function it_can_show_a_coach_by_id()
    {
        $city = City::factory()->create();
        $gym = Gym::factory()->create(['city_id' => $city->id]);
        $coach = Coach::factory()->create(['gym_id' => $gym->id]);

        $response = $this->getJson("/api/cities/{$city->id}/gyms/{$gym->id}/coaches/{$coach->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('id', $coach->id);
    }

    #[Test]
    public function it_returns_404_if_coach_not_found_in_gym()
    {
        $city = City::factory()->create();
        $gym1 = Gym::factory()->create(['city_id' => $city->id]);
        $gym2 = Gym::factory()->create(['city_id' => $city->id]);
        $coach = Coach::factory()->create(['gym_id' => $gym1->id]);

        $response = $this->getJson("/api/cities/{$city->id}/gyms/{$gym2->id}/coaches/{$coach->id}");

        $response->assertStatus(404);
        $response->assertJson(['message' => 'There is no coach with that index']);
    }

    #[Test]
    public function admin_can_create_coach()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);

        $city = City::factory()->create();
        $gym = Gym::factory()->create(['city_id' => $city->id]);
        $specialty = Specialty::factory()->create();

        $payload = [
            'name' => 'John',
            'surname' => 'Doe',
            'is_approved' => true,
            'specialties' => [$specialty->id],
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/cities/{$city->id}/gyms/{$gym->id}/coaches", $payload);

        $response->assertStatus(201);
        $response->assertJsonPath('name', 'John');
        $this->assertDatabaseHas('coaches', ['name' => 'John', 'surname' => 'Doe']);
    }

    #[Test]
    public function non_admin_cannot_create_coach()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $city = City::factory()->create();
        $gym = Gym::factory()->create(['city_id' => $city->id]);

        $payload = [
            'name' => 'Jane',
            'surname' => 'Smith',
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/cities/{$city->id}/gyms/{$gym->id}/coaches", $payload);

        $response->assertStatus(403);
    }

    #[Test]
    public function admin_can_update_a_coach()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);

        $city = City::factory()->create();
        $gym = Gym::factory()->create(['city_id' => $city->id]);
        $coach = Coach::factory()->create(['gym_id' => $gym->id]);

        $payload = [
            'name' => 'UpdatedName',
            'surname' => 'UpdatedSurname',
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->putJson("/api/cities/{$city->id}/gyms/{$gym->id}/coaches/{$coach->id}", $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('coaches', ['id' => $coach->id, 'name' => 'UpdatedName']);
    }

    #[Test]
    public function non_admin_cannot_update_coach()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $city = City::factory()->create();
        $gym = Gym::factory()->create(['city_id' => $city->id]);
        $coach = Coach::factory()->create(['gym_id' => $gym->id]);

        $payload = [
            'name' => 'HackAttempt',
            'surname' => 'Blocked',
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->putJson("/api/cities/{$city->id}/gyms/{$gym->id}/coaches/{$coach->id}", $payload);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('coaches', ['name' => 'HackAttempt']);
    }

    #[Test]
    public function admin_can_delete_a_coach()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);

        $city = City::factory()->create();
        $gym = Gym::factory()->create(['city_id' => $city->id]);
        $coach = Coach::factory()->create(['gym_id' => $gym->id]);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/cities/{$city->id}/gyms/{$gym->id}/coaches/{$coach->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('coaches', ['id' => $coach->id]);
    }

    #[Test]
    public function non_admin_cannot_delete_coach()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $city = City::factory()->create();
        $gym = Gym::factory()->create(['city_id' => $city->id]);
        $coach = Coach::factory()->create(['gym_id' => $gym->id]);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/cities/{$city->id}/gyms/{$gym->id}/coaches/{$coach->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('coaches', ['id' => $coach->id]);
    }
}