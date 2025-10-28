<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = ['ticket_id','name','email','whatsapp','opd_id','priority','category_id','description','attachment','operator_id'];

     public function opd()
    {
        return $this->belongsTo(Opd::class, 'opd_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
    
     public function operator()
    {
        return $this->belongsTo(Operator::class);
    }
}
