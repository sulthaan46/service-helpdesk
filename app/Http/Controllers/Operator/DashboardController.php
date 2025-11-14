<?php

namespace App\Http\Controllers\Operator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ticket;
use App\Models\TicketNote;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{

    
    public function index(Request $request)
    {
        $user = $request->user();

    $operatorName = optional($user->operator)->name;
    

    
    $tickets = Ticket::with(['opd:id,name', 'category:id,name',"notes.user", 'notes.operator'])
        ->where('operator_id', $user->operator_id)  
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Operator/Dashboard', [
        'operatorName' => $operatorName,
        'tickets' => $tickets,
    ]);
    }

    public function addNote(Request $request, $ticketId)
{
    
    $request->validate([
        'note' => 'required|string',
    ]);


    $user = Auth::user();

    
    $note = TicketNote::create([
        'ticket_id' => $ticketId,
        'note' => $request->note,
        'user_id' => $user->id,
        'operator_id' => $user->operator_id,
    ]);

    $note->load('user', 'operator');

    return response()->json([
        'id' => $note->id,
        'note' => $note->note,
        'created_at' => $note->created_at,
        'updated_at' => $note->updated_at,
        'operator_id' => $note->operator_id,
        'user' => [
            'id' => $note->user->id,
            'name' => $note->user->name,
            'role' => $note->user->role,
        ],
        'operator' => $note->operator ? [
            'name' => $note->operator->name,
        ] : null,
    ]);
}

public function updateStatus(Request $request, $ticketId)
{
    $user = Auth::user();
    
    $ticket = Ticket::where('id', $ticketId)
        ->where('operator_id', $user->operator_id)
        ->first();
    
    if (!$ticket) {
        return response()->json([
            'success' => false,
            'message' => 'Tiket tidak ditemukan'
        ], 404);
    }
    
    if ($ticket->status === 'baru') {
        $ticket->status = 'diproses';
        $ticket->save();
        
        return response()->json([
            'success' => true,
            'status' => $ticket->status,
            'message' => 'Status tiket berhasil diupdate'
        ]);
    }
    
    return response()->json([
        'success' => true,
        'status' => $ticket->status,
        'message' => 'Status tiket tidak berubah'
    ]);
}


}
