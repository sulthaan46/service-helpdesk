<h2>Daftar Tiket Anda</h2>
<p>Berikut adalah tiket yang terdaftar dengan email ini:</p>
<ul>
@foreach($tickets as $t)
<li>
<strong>{{ $t->ticket_id }}</strong> — {{ $t->status }} — {{ $t->created_at->format('d M Y') }}<br>
{{ Str::limit($t->description, 200) }}
</li>
@endforeach
</ul>