<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{

   
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
         $operators = \App\Models\Operator::all()->toArray();

    return Inertia::render('auth/register', [
        'operators' => $operators,
    ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'operator_id' => 'required|exists:operators,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'operator_id' => $request->operator_id,
        ]);

        event(new Registered($user));

        Auth::login($user);

        $request->session()->regenerate();

         if ($user->role === 'admin') {
            return redirect()->intended(route('admin.dashboard', absolute: false));  
        } return redirect()->intended(route('operator.dashboard', absolute: false));
    }
}
