<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Operator;
use App\Models\Ticket;
use App\Models\TicketNote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $tickets = Ticket::with(['opd:id,name','category:id,name','notes'])->get();
        $operators = Operator::with('users')->get(); 

        foreach ($tickets as $ticket) {
            $ticket->operatorUser = \App\Models\User::where('operator_id', $ticket->operator_id)
                ->where('role', 'operator')
                ->with('operator','operator.users')
                ->first();
        }

        return Inertia::render('Admin/Dashboard', [
            'tickets' => $tickets,
            'operators' => $operators,
        ]);
    }

    public function updateTicket(Request $request, Ticket $ticket)
{

    // Validasi request
    $data = $request->validate([
        'status' => 'required|string',
        'operator_id' => 'nullable|exists:operators,id',
        'note' => 'nullable|string',
    ]);

    // Update ticket
    $ticket->update([
        'status' => $data['status'],
        'operator_id' => $data['operator_id'] ?? $ticket->operator_id,
    ]);

    if (!empty($data['note'])) {
            \App\Models\TicketNote::create([
                'ticket_id' => $ticket->id,
                'user_id' => Auth::id(),
                'operator_id' => Auth::user()->role === 'operator' ? Auth::user()->operator_id : null,
                'note' => $data['note'],
            ]);
        }

    return redirect()->back()->with('success', 'Tiket berhasil diperbarui');
}

}
