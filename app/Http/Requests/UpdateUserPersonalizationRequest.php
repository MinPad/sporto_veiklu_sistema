<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserPersonalizationRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust if you add policy-based access
    }

    public function rules()
    {
        return [
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'cover_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],

            'motivational_text' => ['nullable', 'string', 'max:500'],

            'height' => ['nullable', 'numeric', 'min:50', 'max:300'],
            'weight' => ['nullable', 'numeric', 'min:20', 'max:300'],

            'experience_level' => ['nullable', 'string', 'in:Beginner,Intermediate,Advanced'],

            'goal' => ['nullable', 'array'],
            'goal.*' => ['string', 'max:50'],

            'preferred_workout_types' => ['nullable', 'array'],
            'preferred_workout_types.*' => ['string', 'max:50'],
        ];
    }

    protected function prepareForValidation()
    {
        // Decode 'goal' if it's a JSON string
        if ($this->has('goal') && is_string($this->goal)) {
            $decoded = json_decode($this->goal, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $this->merge(['goal' => $decoded]);
            }
        }

    }
}
