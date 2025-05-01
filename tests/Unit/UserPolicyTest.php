<?php

namespace Tests\Unit;

use App\Models\User;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class UserPolicyTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function admin_can_view_any_user()
    {
        $admin = User::factory()->make(['role' => 'Admin']);
        $policy = new UserPolicy();

        $this->assertTrue($policy->viewAny($admin));
    }

    #[Test]
    public function user_cannot_view_any_users()
    {
        $user = User::factory()->make(['role' => 'User']);
        $policy = new UserPolicy();

        $this->assertFalse($policy->viewAny($user));
    }

    #[Test]
    public function admin_can_view_any_individual_user()
    {
        $admin = User::factory()->make(['role' => 'Admin']);
        $otherUser = User::factory()->make();
        $policy = new UserPolicy();

        $this->assertTrue($policy->view($admin, $otherUser));
    }

    #[Test]
    public function user_can_view_self()
    {
        $user = User::factory()->make(['id' => 1]);
        $policy = new UserPolicy();

        $this->assertTrue($policy->view($user, $user));
    }

    #[Test]
    public function user_cannot_view_others()
    {
        $user1 = User::factory()->make(['id' => 1]);
        $user2 = User::factory()->make(['id' => 2]);
        $policy = new UserPolicy();

        $this->assertFalse($policy->view($user1, $user2));
    }

    #[Test]
    public function user_can_update_self()
    {
        $user = User::factory()->make(['id' => 1]);
        $policy = new UserPolicy();

        $this->assertTrue($policy->update($user, $user));
    }

    #[Test]
    public function user_cannot_update_others()
    {
        $user1 = User::factory()->make(['id' => 1]);
        $user2 = User::factory()->make(['id' => 2]);
        $policy = new UserPolicy();

        $this->assertFalse($policy->update($user1, $user2));
    }

    #[Test]
    public function admin_can_delete_any_user()
    {
        $admin = User::factory()->make(['role' => 'Admin']);
        $user = User::factory()->make();
        $policy = new UserPolicy();

        $this->assertTrue($policy->delete($admin, $user));
    }

    #[Test]
    public function user_can_delete_self()
    {
        $user = User::factory()->make(['id' => 1]);
        $policy = new UserPolicy();

        $this->assertTrue($policy->delete($user, $user));
    }

    #[Test]
    public function user_cannot_delete_others()
    {
        $user1 = User::factory()->make(['id' => 1]);
        $user2 = User::factory()->make(['id' => 2]);
        $policy = new UserPolicy();

        $this->assertFalse($policy->delete($user1, $user2));
    }
}
