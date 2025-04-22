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
            // 'specialty' => [
            //     'required',
            //     'string',
            //     'min:3',
            //     'max:255',
            //     Rule::unique('coaches')->where(function ($query) {
            //         $query->where('name', $this->name)
            //               ->where('surname', $this->surname)
            //               ->where('specialty', $this->specialty);
    
            //         if ($this->route('gym')) {
            //             $query->where('gym_id', $this->route('gym')->id);
            //         } else {
            //             $query->whereNull('gym_id');
            //         }
            //     }),
            // ],
            'specialties' => ['nullable', 'array'],
            'specialties.*' => ['exists:specialties,id'],
            'is_approved' => ['boolean'],
            'gym_id' => ['nullable', 'exists:gyms,id'],
        ];
    }
    public function messages()
    {
        return [
            'name.required' => 'The coach name is required.',
            'surname.required' => 'The coach surname is required.',
            // 'specialty.required' => 'The coach specialty is required.',
            // 'specialty.unique' => 'A coach with this name, surname, and specialty already exists in this gym.',
        ];
    }
}
