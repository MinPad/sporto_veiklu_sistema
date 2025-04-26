<?php

namespace App\Http\Requests;

use App\Models\Gym;
use App\Rules\ExistingCity;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCoachRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'name' => ['required', 'string', 'min:2', 'max:255', 'regex:/^[\pL\s\'\-]+$/u'],
            'surname' => ['required', 'string', 'min:2', 'max:255', 'regex:/^[\pL\s\'\-]+$/u'],
            'specialties' => ['nullable', 'array'],
            'specialties.*' => ['exists:specialties,id'],
            'gym_id' => ['nullable', 'exists:gyms,id'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The coach name is required.',
            'surname.required' => 'The coach surname is required.',
            'name.regex' => 'Name may only contain letters, spaces, hyphens (-), and apostrophes (\').',
            'surname.regex' => 'Surname may only contain letters, spaces, hyphens (-), and apostrophes (\').',
        ];
    }
}