<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketListMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $tickets;


    public function __construct($tickets)
    {
        $this->tickets = $tickets;
    }


    public function build()
    {
        return $this->subject('Daftar Tiket Anda')
        ->view('emails.tickets-list')
        ->with(['tickets' => $this->tickets]);
    }
}
