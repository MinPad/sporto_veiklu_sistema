<?php

namespace Tests\Feature;

use App\Models\Coach;
use App\Models\Gym;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CoachApiTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_all_coaches_with_filters()
    {
        $gym = Gym::factory()->create();
        $specialty = Specialty::factory()->create();

        $coachWithSpec = Coach::factory()->create(['gym_id' => $gym->id]);
        $coachWithSpec->specialties()->attach($specialty);

        Coach::factory()->create(); // coach without gym/specialty

        $response = $this->getJson("/api/coaches?specialty_ids[]={$specialty->id}");

        $response->assertStatus(200);
        $response->assertJsonCount(1, 'data');
        $response->assertJsonPath('data.0.id', $coachWithSpec->id);
    }

    #[Test]
    public function it_shows_a_single_coach_by_id()
    {
        $user = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($user);

        $coach = Coach::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->getJson("/api/coaches/{$coach->id}");

        $response->assertStatus(200);
        $response->assertJsonPath('id', $coach->id);
    }

    #[Test]
    public function unauthenticated_user_cannot_view_single_coach()
    {
        $coach = Coach::factory()->create();

        $response = $this->getJson("/api/coaches/{$coach->id}");

        $response->assertStatus(401); // Unauthenticated
    }

    #[Test]
    public function admin_can_create_coach_without_gym()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);

        $specialty = Specialty::factory()->create();

        $payload = [
            'name' => 'NoGymCoach',
            'surname' => 'Example',
            'specialties' => [$specialty->id],
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/coaches", $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('coaches', ['name' => 'NoGymCoach']);
    }

    #[Test]
    public function non_admin_cannot_create_coach_without_gym()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $payload = [
            'name' => 'BlockedCoach',
            'surname' => 'UserTry',
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/coaches", $payload);

        $response->assertStatus(403);
    }

    #[Test]
    public function admin_can_update_coach_directly()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);

        $coach = Coach::factory()->create();

        $payload = [
            'name' => 'UpdatedDirectly',
            'surname' => 'Changed',
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->putJson("/api/coaches/{$coach->id}", $payload);

        $response->assertStatus(200);
        $this->assertDatabaseHas('coaches', ['id' => $coach->id, 'name' => 'UpdatedDirectly']);
    }

    #[Test]
    public function non_admin_cannot_update_coach_directly()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $coach = Coach::factory()->create();

        $payload = [
            'name' => 'ShouldNotUpdate',
            'surname' => 'Nope',
        ];

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->putJson("/api/coaches/{$coach->id}", $payload);

        $response->assertStatus(403);
    }

    #[Test]
    public function admin_can_delete_coach_directly()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);

        $coach = Coach::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/coaches/{$coach->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('coaches', ['id' => $coach->id]);
    }

    #[Test]
    public function non_admin_cannot_delete_coach_directly()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $coach = Coach::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/coaches/{$coach->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('coaches', ['id' => $coach->id]);
    }
}