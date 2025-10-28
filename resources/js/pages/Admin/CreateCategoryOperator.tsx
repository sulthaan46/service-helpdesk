import React, { useEffect, useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from 'axios';

interface Category {
    id: number;
    name: string;
    operator: {
        id: number;
        name: string;
    };
}

interface CreateCategoryOperatorProps {
    categories: Category[];
}

const CreateCategoryOperator: React.FC<CreateCategoryOperatorProps> = ({
    categories,
}) => {
    const { props } = usePage();
    const { data, setData, errors, processing } = useForm({
        category_name: '',
        operator_name: '',
    });

    const [categoriesList, setCategoriesList] =
        useState<Category[]>(categories);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        null,
    );
    const [successMessage, setSuccessMessage] = useState<string>('');

    const editForm = useForm({
        category_name: '',
        operator_name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        axios
            .post(route('admin.categories.store'), {
                category_name: data.category_name,
                operator_name: data.operator_name,
            })
            .then((response) => {
                if (response.data.success) {
                    setCategoriesList((prevCategories) => [
                        ...prevCategories,
                        response.data.category,
                    ]);
                    setSuccessMessage(
                        'Kategori dan Operator berhasil ditambahkan!',
                    );
                    setData({
                        category_name: '',
                        operator_name: '',
                    });
                }
            })
            .catch((error) => {
                console.error('Error adding category:', error);
            });
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        editForm.setData('category_name', category.name ?? '');
        editForm.setData('operator_name', category.operator?.name ?? '');
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedCategory(null);
        editForm.reset();
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedCategory === null) {
            return;
        }

        axios
            .put(route('admin.categories.update', selectedCategory.id), {
                category_name: editForm.data.category_name,
                operator_name: editForm.data.operator_name,
            })
            .then((response) => {
                if (response.data.success) {
                    setCategoriesList((prevCategories) =>
                        prevCategories.map((category) =>
                            category.id === response.data.category.id
                                ? response.data.category
                                : category,
                        ),
                    );
                    setSuccessMessage(
                        'Kategori dan Operator berhasil diupdate!',
                    );
                    closeEditModal();
                }
            })
            .catch((error) => {
                console.error('Error updating category:', error);
            });
    };

    const handleDelete = (categoryId: number) => {
        if (
            confirm(
                'Apakah Anda yakin ingin menghapus kategori dan operator ini?',
            )
        ) {
            axios
                .delete(route('admin.categories.destroy', categoryId))
                .then((response) => {
                    if (response.data.success) {
                        // Hapus kategori dari state setelah berhasil dihapus
                        setCategoriesList((prevCategories) =>
                            prevCategories.filter(
                                (category) => category.id !== categoryId,
                            ),
                        );
                        setSuccessMessage(
                            'Kategori dan Operator berhasil dihapus!',
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error deleting category:', error);
                });
        }
    };

    return (
        <AppLayout>
            <Head title="Tambah Kategori dan Operator" />

            <div className="container p-3">
                <h1 className="mb-4 text-2xl">
                    Tambah Kategori Masalah dan Operator
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-4">
                        {/* Input Nama Kategori */}
                        <div className="flex-1">
                            <Label htmlFor="category_name">
                                Nama Kategori Masalah
                            </Label>
                            <Input
                                id="category_name"
                                type="text"
                                name="category_name"
                                value={data.category_name}
                                onChange={(e) =>
                                    setData('category_name', e.target.value)
                                }
                                required
                                placeholder="Masukkan nama kategori"
                                className="w-full"
                            />
                            {errors.category_name && (
                                <div>{errors.category_name}</div>
                            )}
                        </div>

                        <span className="text-xl">→</span>

                        {/* Input Nama Operator */}
                        <div className="flex-1">
                            <Label htmlFor="operator_name">Nama Operator</Label>
                            <Input
                                id="operator_name"
                                type="text"
                                name="operator_name"
                                value={data.operator_name}
                                onChange={(e) =>
                                    setData('operator_name', e.target.value)
                                }
                                required
                                placeholder="Masukkan nama operator"
                                className="w-full"
                            />
                            {errors.operator_name && (
                                <div>{errors.operator_name}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="mt-4 w-auto"
                            disabled={processing}
                        >
                            {processing
                                ? 'Menyimpan...'
                                : 'Tambah Kategori dan Operator'}
                        </Button>
                    </div>
                </form>
                {/* Tabel Kategori dan Operator */}
                <div className="mt-8">
                    {successMessage && (
                        <div className="mb-4 rounded-lg border border-green-300 bg-green-100 p-3 text-green-800">
                            {successMessage}
                        </div>
                    )}
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">No.</th>
                                <th className="border px-4 py-2">
                                    Kategori Masalah
                                </th>
                                <th className="border px-4 py-2">Operator</th>
                                <th className="border px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoriesList.map((category, index) => (
                                <tr key={category.id}>
                                    <td className="border px-4 py-2 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        {category.name}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        {category.operator.name}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        <Button
                                            type="button"
                                            className="text-sm"
                                            onClick={() =>
                                                openEditModal(category)
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            type="button"
                                            className="ml-2 text-sm text-red-500"
                                            onClick={() =>
                                                handleDelete(category.id)
                                            }
                                        >
                                            Hapus
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showEditModal && selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={closeEditModal}
                    />
                    <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-medium">
                            Edit Kategori & Operator
                        </h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <Label htmlFor="edit_category_name">
                                    Nama Kategori
                                </Label>
                                <Input
                                    id="edit_category_name"
                                    value={editForm.data.category_name}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'category_name',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {editForm.errors.category_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {editForm.errors.category_name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="edit_operator_name">
                                    Nama Operator
                                </Label>
                                <Input
                                    id="edit_operator_name"
                                    value={editForm.data.operator_name}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'operator_name',
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {editForm.errors.operator_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {editForm.errors.operator_name}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <Button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="bg-slate-200"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                >
                                    {editForm.processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Perubahan'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
};

export default CreateCategoryOperator;
