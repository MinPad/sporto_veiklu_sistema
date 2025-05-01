<?php

namespace Tests\Unit;

use App\Models\SportsEvent;
use App\Models\User;
use App\Policies\SportsEventPolicy;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SportsEventPolicyTest extends TestCase
{
    use RefreshDatabase;
    #[Test]
    public function admin_can_delete_event()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $event = \App\Models\SportsEvent::factory()->create();

        $policy = new SportsEventPolicy();

        $this->assertTrue($policy->delete($admin, $event));
    }

    #[Test]
    public function user_cannot_delete_event()
    {
        $user = new User(['role' => 'User']);
        $event = \App\Models\SportsEvent::factory()->create();

        $policy = new SportsEventPolicy();

        $this->assertFalse($policy->delete($user, $event));
    }

    #[Test]
    public function admin_can_update_event()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $event = \App\Models\SportsEvent::factory()->create();

        $policy = new SportsEventPolicy();

        $this->assertTrue($policy->update($admin, $event));
    }

    #[Test]
    public function anyone_can_view_event()
    {
        $user = new User();
        $event = \App\Models\SportsEvent::factory()->create();

        $policy = new SportsEventPolicy();

        $this->assertTrue($policy->view($user, $event));
        $this->assertTrue($policy->viewAny($user));
    }
}
