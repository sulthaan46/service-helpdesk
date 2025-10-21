import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mail } from 'lucide-react';
import { route } from 'ziggy-js';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        type: 'open', // 'open' atau 'all'
    });

    const { flash } = usePage<{ flash?: { success?: string } }>().props;
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tickets.sendList'));
    };
    return (
        <>
            <Head title="Dapatkan Kembali ID Tiket Anda"></Head>
            <div className="mx-auto max-w-xl py-10">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-lg">
                                <Mail className="h-5 w-5" />
                                Dapatkan Kembali ID Tiket Anda
                            </CardTitle>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Masukkan email yang Anda gunakan saat membuat
                                tiket, dan kami akan mengirimkan daftar tiket
                                Anda ke email tersebut.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {successMessage && (
                                <div className="alert alert-success">
                                    {successMessage}
                                </div>
                            )}

                            {Object.keys(errors).length > 0 && (
                                <Alert>
                                    <AlertTitle>Error!</AlertTitle>
                                    <AlertDescription>
                                        <ul>
                                            {Object.entries(errors).map(
                                                ([k, v]) => (
                                                    <li key={k}>
                                                        {v as string}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Alamat Email *</Label>
                                <Input
                                    id="email"
                                    placeholder="nama@domain.com"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    required
                                ></Input>
                            </div>
                            <div className="space-y-2">
                                <Label>
                                    Pilih jenis tiket yang ingin dikirim:
                                </Label>
                                <div className="flex flex-col gap-3">
                                    <label className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="open"
                                            checked={data.type === 'open'}
                                            onChange={() =>
                                                setData('type', 'open')
                                            }
                                            className="mt-3 h-3 w-4"
                                        />
                                        <div>
                                            <div className="font-medium">
                                                Kirimkan saya tiket yang terbuka
                                                saja
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Hanya tiket dengan status "Baru"
                                                dan "Diproses"
                                            </div>
                                        </div>
                                    </label>
                                    <label className="flex items-start gap-3">
                                        <input
                                            type="radio"
                                            name="type"
                                            value="all"
                                            className="mt-3 h-3 w-4"
                                            checked={data.type === 'all'}
                                            onChange={() =>
                                                setData('type', 'all')
                                            }
                                        />
                                        <div>
                                            <div className="font-medium">
                                                Kirimkan saya semua tiket
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Termasuk tiket yang sudah
                                                selesai"
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <Button
                                    className="w-full"
                                    type="submit"
                                    disabled={processing}
                                >
                                    Kirim Daftar Tiket
                                </Button>
                            </div>

                            <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-700">
                                <div className="font-semibold">Tips:</div>
                                <ul className="mt-2 list-disc pl-5 text-xs text-slate-600">
                                    <li>
                                        Pastikan email yang dimasukkan sama
                                        dengan saat membuat tiket
                                    </li>
                                    <li>
                                        Periksa folder spam jika email tidak
                                        masuk ke kotak masuk
                                    </li>
                                    <li>
                                        Email akan berisi ID tiket dan status
                                        terkini
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}
