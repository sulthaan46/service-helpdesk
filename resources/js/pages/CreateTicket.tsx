import React, { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CircleAlert } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Info } from 'lucide-react';
import { route } from 'ziggy-js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CreateTicket() {
    const [opds, setOpds] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        whatsapp: '',
        opd_id: '',
        priority: '',
        category_id: '',
        description: '',
        attachment: null as File | null,
    });

    useEffect(() => {
        fetch('/api/tickets/options')
            .then((response) => response.json())
            .then((data) => {
                setOpds(data.opds);
                setCategories(data.categories);
            })
            .catch((error) => console.error('Error fetching options:', error));
    }, []);

    const [fileName, setFileName] = useState<string>('No file selected');
    const [fileSizeError, setFileSizeError] = useState<string | null>(null);
    const MAX_BYTES = 10 * 1024 * 1024;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) {
            setFileName('No file selected');
            return;
        }
        const f = files[0];
        if (f.size > MAX_BYTES) {
            setFileName('No file selected');
            setFileSizeError(
                'Ukuran file melebihi 10MB. Silahkan pilih file lebih kecil.',
            );
            e.target.value = '';
            return;
        }
        setFileName(f.name);
        setFileSizeError(null);
        setData('attachment', f);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('tickets.store'), {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    };

    return (
        <>
            <Head title="Buat Tiket Baru" />

            <div className="mx-auto max-w-4xl py-10">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                Formulir Tiket Bantuan
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Silahkan isi detail masalah Anda dibawah ini
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Display Error */}

                            {Object.keys(errors).length > 0 && (
                                <Alert>
                                    <CircleAlert />
                                    <AlertTitle>Errors!</AlertTitle>
                                    <AlertDescription>
                                        <ul>
                                            {Object.entries(errors).map(
                                                ([key, message]) => (
                                                    <li key={key}>
                                                        {message as string}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Nama Lengkap */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        placeholder="Masukkan Nama Lengkap"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />
                                </div>
                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="Masukkan Email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                </div>
                                {/* Nomor WhatsApp */}
                                <div className="space-y-2">
                                    <Label htmlFor="wa">No. WhatsApp</Label>
                                    <Input
                                        id="wa"
                                        placeholder="08xxxxxxxxxx"
                                        value={data.whatsapp}
                                        onChange={(e) =>
                                            setData('whatsapp', e.target.value)
                                        }
                                    />
                                </div>
                                {/* Organisasi Perangkat Daerah */}
                                <div className="space-y-2">
                                    <Label>Organisasi Perangkat Daerah</Label>
                                    <Select
                                        value={data.opd_id}
                                        onValueChange={(value) =>
                                            setData('opd_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih OPD" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {opds.map((opd) => (
                                                <SelectItem
                                                    key={opd.id}
                                                    value={String(opd.id)}
                                                >
                                                    {opd.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* Prioritas */}
                                <div className="space-y-2">
                                    <Label>Prioritas</Label>
                                    <Select
                                        value={data.priority}
                                        onValueChange={(value) =>
                                            setData('priority', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih tingkat prioritas"></SelectValue>
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="Rendah">
                                                Rendah - Tidak Mendesak
                                            </SelectItem>
                                            <SelectItem value="Menengah">
                                                Menengah - Perlu Perhatian
                                            </SelectItem>
                                            <SelectItem value="Tinggi">
                                                Tinggi - Sangat Mendesak
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {/* Kategori Masalah */}
                                <div className="space-y-2">
                                    <Label>Kategori Masalah</Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) =>
                                            setData('category_id', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Kategori" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={String(category.id)}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            {/* Deskripsi */}
                            <div className="space-y-2">
                                <Label htmlFor="deskripsi">
                                    Deskripsi Masalah
                                </Label>
                                <Textarea
                                    id="deskripsi"
                                    placeholder="jelaskan masalah anda..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                />
                            </div>

                            {/* File Upload */}

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>File Lampiran (Opsional)</Label>
                                    <div className="grid gap-2">
                                        <div className="flex items-center gap-3 pt-2">
                                            <Label
                                                htmlFor="attachment"
                                                className="cursor-pointer rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-200"
                                            >
                                                Browse...
                                            </Label>
                                            <Input
                                                id="attachment"
                                                name="attachment"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept=".pdf,.jpg,.jpeg,.png,.docx"
                                            />
                                            <span className="text-sm text-slate-600">
                                                {fileName}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-grey-500 text-xs">
                                                Maks. 10MB. Format: PDF, JPG,
                                                PNG, DOCX
                                            </p>
                                            {fileSizeError && (
                                                <p className="mt-1 text-xs text-red-600">
                                                    {fileSizeError}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* info */}
                                <div className="mt-2">
                                    <div className="flex items-start gap-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
                                        <div className="flex-shrink-0 rounded-full bg-blue-100 p-2">
                                            <Info className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="text-sm text-slate-700">
                                            <p className="font-semibold">
                                                Penting:
                                            </p>
                                            <p className="mt-1 text-sm text-slate-600">
                                                Setelah submit, Anda akan
                                                menerima ID Tiket melalui emial.
                                                Simpan ID ini untuk tracking
                                                status tiket Anda
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tombol */}
                            <div className="flex justify-end gap-3">
                                <Button variant="outline">Batal</Button>
                                <Button
                                    className="transition-color bg-blue-500 duration-300 hover:bg-blue-800"
                                    type="submit"
                                >
                                    Kirim Tiket
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </>
    );
}
