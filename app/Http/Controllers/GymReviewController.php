<?php

namespace App\Http\Controllers;

use App\Models\Gym;
use App\Models\GymReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
class GymReviewController extends Controller
{
    use AuthorizesRequests;
    public function index($gymId)
    {
        $gym = Gym::findOrFail($gymId);
        $reviews = $gym->reviews()->with('user')->latest()->get();

        return response()->json($reviews);
    }

    public function store(Request $request, $gymId)
    {
        $request->validate([
            'rating' => 'required|integer|min:0|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        $existing = GymReview::where('user_id', $user->id)
            ->where('gym_id', $gymId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already reviewed this gym.'], 409);
        }

        $review = GymReview::create([
            'user_id' => $user->id,
            'gym_id' => $gymId,
            'rating' => $request->input('rating'),
            'comment' => $request->input('comment'),
        ]);

        return response()->json($review, 201);
    }

    public function update(Request $request, GymReview $review)
    {
        $this->authorize('update', $review);

        $validated = $request->validate([
            'rating' => 'required|integer|min:0|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update($validated);

        return response()->json($review);
    }

    public function destroy(GymReview $review)
    {
        $this->authorize('delete', $review);

        $review->delete();

        return response()->json(['message' => 'Review deleted.']);
    }
}
