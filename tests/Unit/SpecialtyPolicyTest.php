<?php

namespace Tests\Unit;

use App\Models\Specialty;
use App\Models\User;
use App\Policies\SpecialtyPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SpecialtyPolicyTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function anyone_can_view_specialty()
    {
        $user = new User();
        $specialty = Specialty::factory()->make();

        $policy = new SpecialtyPolicy();

        $this->assertTrue($policy->view($user, $specialty));
        $this->assertTrue($policy->viewAny($user));
    }

    #[Test]
    public function admin_can_manage_specialty()
    {
        $admin = \App\Models\User::factory()->create(['role' => 'Admin']);

        $specialty = Specialty::factory()->make();

        $policy = new SpecialtyPolicy();

        $this->assertTrue($policy->create($admin));
        $this->assertTrue($policy->update($admin, $specialty));
        $this->assertTrue($policy->delete($admin, $specialty));
    }

    #[Test]
    public function user_cannot_manage_specialty()
    {
        $user = new User(['role' => 'User']);
        $specialty = Specialty::factory()->make();

        $policy = new SpecialtyPolicy();

        $this->assertFalse($policy->create($user));
        $this->assertFalse($policy->update($user, $specialty));
        $this->assertFalse($policy->delete($user, $specialty));
    }
}
