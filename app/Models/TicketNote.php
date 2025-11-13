<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TicketNote extends Model
{
    use HasFactory;

    protected $fillable = ['ticket_id','operator_id', 'note', 'user_id'];

    // Relasi dengan tiket
    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    // Relasi dengan pengguna yang menambah
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function operator()
    {
        return $this->belongsTo(Operator::class);
    }
}
