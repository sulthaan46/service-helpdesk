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

    // Ambil operator name untuk title
    $operatorName = optional($user->operator)->name;
    

    // Ambil tiket yang sesuai operator login
    $tickets = Ticket::with(['opd:id,name', 'category:id,name',"notes.user", 'notes.operator'])
        ->where('operator_id', $user->operator_id)  // hanya tiket yang operator_id sama dengan operator yang login
        ->orderBy('created_at', 'desc')
        ->get();

    return Inertia::render('Operator/Dashboard', [
        'operatorName' => $operatorName,
        'tickets' => $tickets,
    ]);
    }

    public function addNote(Request $request, $ticketId)
{
    
    // Validasi input
    $request->validate([
        'note' => 'required|string',
    ]);

    // Ambil user yang sedang login
    $user = Auth::user();

    // Menyimpan catatan baru
    TicketNote::create([
        'ticket_id' => $ticketId,
        'note' => $request->note,
        'user_id' => $user->id,  // ID pengguna yang menambahkan catatan
        'operator_id' => $user->operator_id,  // ID operator (jika ada)
    ]);

    // Mengirim respons sukses
    return back()->with('success', 'Catatan berhasil ditambahkan!');
}


}
