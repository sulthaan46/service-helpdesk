<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Operator extends Model
{
    protected $fillable = ['name'];

    public function categories()
    {
       return $this->hasMany(Category::class, 'operator_id')->onDelete('cascade');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }
}
