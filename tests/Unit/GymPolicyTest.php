<?php

namespace Tests\Unit;

use App\Models\User;
use App\Models\Gym;
use App\Policies\GymPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GymPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_gym()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $policy = new GymPolicy();

        $this->assertTrue($policy->create($admin));
    }

    public function test_non_admin_cannot_create_gym()
    {
        $user = User::factory()->create(['role' => 'User']);
        $policy = new GymPolicy();

        $this->assertFalse($policy->create($user));
    }

    public function test_admin_can_update_gym()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $gym = Gym::factory()->create();
        $policy = new GymPolicy();

        $this->assertTrue($policy->update($admin, $gym));
    }

    public function test_non_admin_cannot_update_gym()
    {
        $user = User::factory()->create(['role' => 'User']);
        $gym = Gym::factory()->create();
        $policy = new GymPolicy();

        $this->assertFalse($policy->update($user, $gym));
    }

    public function test_admin_can_delete_gym()
    {
        $admin = User::factory()->create(['role' => 'Admin']);
        $gym = Gym::factory()->create();
        $policy = new GymPolicy();

        $this->assertTrue($policy->delete($admin, $gym));
    }

    public function test_non_admin_cannot_delete_gym()
    {
        $user = User::factory()->create(['role' => 'User']);
        $gym = Gym::factory()->create();
        $policy = new GymPolicy();

        $this->assertFalse($policy->delete($user, $gym));
    }
}
