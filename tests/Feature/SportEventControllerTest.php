<?php

namespace Tests\Feature;

use App\Models\SportsEvent;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Gym;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\Attributes\Test;

class SportEventControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function createEvent(array $overrides = [])
    {
        return SportsEvent::factory()->create(array_merge([
            'name' => 'Functional Fitness Fest',
            'start_date' => now()->addDays(3),
            'end_date' => now()->addDays(4),
            'max_participants' => 10,
            'current_participants' => 0,
            'goal_tags' => ['strength', 'mobility'],
        ], $overrides));
    }

    #[Test]
    public function it_lists_sport_events_with_filters()
    {
        $spec = Specialty::factory()->create(['name' => 'Cardio']);
        $event = $this->createEvent();
        $event->specialties()->attach($spec->id);

        $response = $this->getJson('/api/sports-events?specialties[]=Cardio');

        $response->assertStatus(200);
        $response->assertJsonStructure(['data' => [['id', 'name']]]);
    }

    #[Test]
    public function it_returns_filter_options()
    {
        Specialty::factory()->create(['name' => 'Yoga']);
        $event = $this->createEvent(['difficulty_level' => 'Medium']);

        $response = $this->getJson('/api/sports-events/filter-options');

        $response->assertStatus(200);
        $response->assertJsonStructure(['specialties', 'goals', 'difficulties']);
    }

    #[Test]
    public function it_shows_a_single_event()
    {
        $event = $this->createEvent();

        $response = $this->getJson('/api/sports-events/' . $event->id);

        $response->assertStatus(200);
        $response->assertJsonPath('id', $event->id);
    }

    #[Test]
    public function user_can_join_event()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        $event = $this->createEvent();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/sports-events/{$event->id}/join");

        $response->assertStatus(200);
        $this->assertDatabaseHas('sports_event_user', [
            'user_id' => $user->id,
            'sports_event_id' => $event->id,
            'left_at' => null,
        ]);
    }

    #[Test]
    public function user_cannot_join_full_event()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        $event = $this->createEvent([
            'max_participants' => 1,
            'current_participants' => 1
        ]);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/sports-events/{$event->id}/join");

        $response->assertStatus(400);
        $response->assertJsonFragment(['message' => 'This event is already full.']);
    }

    #[Test]
    public function user_cannot_join_event_twice()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        $event = $this->createEvent();
        $event->users()->attach($user->id);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/sports-events/{$event->id}/join");

        $response->assertStatus(200);
        $this->assertEquals(1, $event->users()->count());
    }

    #[Test]
    public function user_can_leave_event()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        $event = $this->createEvent(['current_participants' => 1]);
        $event->users()->attach($user->id, ['left_at' => null]);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->postJson("/api/sports-events/{$event->id}/leave");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('sports_event_user', [
            'user_id' => $user->id,
            'sports_event_id' => $event->id,
            'left_at' => null,
        ]);
    }

    #[Test]
    public function it_returns_user_joined_events()
    {
        $user = User::factory()->create();
        $token = auth()->login($user);

        $event = $this->createEvent();
        $event->users()->attach($user->id, ['left_at' => null]);

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->getJson("/api/my-sports-events");

        $response->assertStatus(200);
        $response->assertJsonFragment(['id' => $event->id]);
    }

    #[Test]
    public function admin_can_delete_event()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $token = auth()->login($admin);

        $event = $this->createEvent();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/sports-events/{$event->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('sports_events', ['id' => $event->id]);
    }

    #[Test]
    public function non_admin_cannot_delete_event()
    {
        $user = User::factory()->create(['role' => 'User']);
        $token = auth()->login($user);

        $event = $this->createEvent();

        $response = $this->withHeader('Authorization', "Bearer $token")
                         ->deleteJson("/api/sports-events/{$event->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('sports_events', ['id' => $event->id]);
    }
}
