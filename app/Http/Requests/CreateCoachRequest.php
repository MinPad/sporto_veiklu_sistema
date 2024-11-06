<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCoachRequest extends FormRequest
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
            'name' => ['required', 'string', 'min:2', 'max:255'],
            'surname' => ['required', 'string', 'min:2', 'max:255'],
            'specialty' => [
                'required', 
                'string', 
                'min:3', 
                'max:255',
                Rule::unique('coaches')->where(function ($query) {
                    return $query->where('surname', $this->surname)
                                 ->where('name', $this->name)
                                 ->where('specialty', $this->specialty)
                                 ->where('gym_id', $this->route('gym')->id);
                }),
            ],
            // 'user_id' => ['required', 'exists:users,id'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'The coach name is required.',
            'surname.required' => 'The coach surname is required.',
            'specialty.required' => 'The coach specialty is required.',
            'specialty.unique' => 'A coach with this name, surname, and specialty already exists in this gym.',
        ];
    }
}
