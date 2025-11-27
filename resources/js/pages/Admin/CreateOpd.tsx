import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';
import { useState } from 'react';
import axios from 'axios';

interface Opd {
    id: number;
    name: string;
}

interface Props {
    opds: Opd[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin Dashboard', href: route('admin.dashboard') },
    { title: 'Buat OPD', href: route('admin.opds.create') },
];

export default function CreateOpd({ opds }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [opdsList, setOpdsList] = useState<Opd[]>(opds);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post(route('admin.opds.store'), {
                name: data.name,
            })
            .then((response) => {
                if (response.data.success) {
                    setOpdsList((prevOpds) => [...prevOpds, response.data.opd]);
                    setSuccessMessage('OPD berhasil ditambahkan!');
                    reset();
                }
            })
            .catch((error) => {
                console.error('Error adding OPD:', error);
            });
    };

    const handleDelete = (opdId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus OPD ini?')) {
            axios
                .delete(route('admin.opds.destroy', opdId))
                .then((response) => {
                    if (response.data.success) {
                        setOpdsList((prevOpds) =>
                            prevOpds.filter((opd) => opd.id !== opdId),
                        );
                        setSuccessMessage('OPD berhasil dihapus!');
                    }
                })
                .catch((error) => {
                    console.error('Error deleting OPD:', error);
                });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat OPD" />

            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Buat OPD Baru</h1>
                    <p className="text-gray-600">
                        Tambahkan OPD baru ke dalam sistem.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-semibold">
                            Form Tambah OPD
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Nama OPD</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Masukkan nama OPD"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Tambah OPD'}
                            </Button>
                        </form>

                        {successMessage && (
                            <div className="mt-4 rounded-lg bg-green-100 p-4 text-green-800">
                                {successMessage}
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow">
                        <h2 className="mb-4 text-lg font-semibold">
                            Daftar OPD
                        </h2>
                        <div className="space-y-2">
                            {opdsList.length > 0 ? (
                                opdsList.map((opd) => (
                                    <div
                                        key={opd.id}
                                        className="flex items-center justify-between rounded border p-3"
                                    >
                                        <p className="font-medium">
                                            {opd.name}
                                        </p>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => handleDelete(opd.id)}
                                        >
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    Belum ada OPD yang ditambahkan.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
