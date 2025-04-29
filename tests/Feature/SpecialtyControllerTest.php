<?php

namespace Tests\Feature;

use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class SpecialtyControllerTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_lists_specialties()
    {
        $specialty = Specialty::factory()->create();

        $response = $this->getJson('/api/specialties');

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'id' => $specialty->id,
            'name' => $specialty->name,
        ]);
    }

    #[Test]
    public function admin_can_create_specialty()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/specialties', [
                             'name' => 'New Specialty',
                         ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('specialties', [
            'name' => 'New Specialty',
        ]);
    }

    #[Test]
    public function non_admin_cannot_create_specialty()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson('/api/specialties', [
                             'name' => 'Unauthorized Specialty',
                         ]);

        $response->assertStatus(403);
    }

    #[Test]
    public function admin_can_delete_specialty()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);

        $specialty = Specialty::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/specialties/{$specialty->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('specialties', [
            'id' => $specialty->id,
        ]);
    }

    #[Test]
    public function non_admin_cannot_delete_specialty()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $specialty = Specialty::factory()->create();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/specialties/{$specialty->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('specialties', [
            'id' => $specialty->id,
        ]);
    }
}
