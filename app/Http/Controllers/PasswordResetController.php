<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request)
{
    logger('reset link method hit');
    logger($request->all());
    $request->validate([
        'email' => 'required|email|exists:users,email'
    ]);

    $token = Str::random(60);

    DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->delete();

    DB::table('password_reset_tokens')->insert([
        'email' => $request->email,
        'token' => $token,
        'created_at' => now()
    ]);

    $resetUrl = config('app.frontend_url') . "/reset-password?token={$token}&email={$request->email}";

    Mail::send('emails.password-reset', ['resetUrl' => $resetUrl], function ($message) use ($request) {
        $message->to($request->email)
            ->subject('Password Reset Request');
    });

    return response()->json(['message' => 'Password reset link sent successfully']);
}

    public function resetPassword(Request $request)
    {
        logger('resetPassword hit');
        logger($request->all());
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed'
        ]);

        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->where('created_at', '>=', now()->subMinutes(60)) // Token expires in 60 minutes
            ->first();

        if (!$resetRecord) {
            return response()->json(['message' => 'Invalid or expired reset token'], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->delete();

        return response()->json(['message' => 'Password reset successfully']);
    }
}
