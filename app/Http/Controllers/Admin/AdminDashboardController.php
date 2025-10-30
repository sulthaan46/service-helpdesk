<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
         $tickets = Ticket::with(['opd:id,name','category:id,name'])->get();

foreach ($tickets as $ticket) {
    $ticket->operatorUser = \App\Models\User::where('operator_id', $ticket->operator_id)
        ->where('role', 'operator')
        ->with('operator') // ambil nama operator dari tabel operators
        ->first();
}

return Inertia::render('Admin/Dashboard', [
    'tickets' => $tickets,
]);
    }
}
