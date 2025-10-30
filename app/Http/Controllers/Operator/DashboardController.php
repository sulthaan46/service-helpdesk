<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ticket;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

    // Ambil operator name untuk title
    $operatorName = optional($user->operator)->name;

    // Ambil tiket yang sesuai operator login
    $tickets = Ticket::with(['opd:id,name', 'category:id,name'])
        ->where('operator_id', $user->operator_id)  // hanya tiket yang operator_id sama dengan operator yang login
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Operator/Dashboard', [
        'operatorName' => $operatorName,
        'tickets' => $tickets,
    ]);
    }
}
