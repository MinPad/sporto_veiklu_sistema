<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserPersonalizationRequest extends FormRequest
{
    public function authorize()
    {
        return true; // or use policy-based control
    }

    public function rules()
    {
        return [
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'cover_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
            'motivational_text' => ['nullable', 'string', 'max:500'],
        ];
    }
}
