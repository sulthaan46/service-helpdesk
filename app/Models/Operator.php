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

    public function users()
    {
        return $this->hasMany(User::class, 'operator_id');
    }
}
