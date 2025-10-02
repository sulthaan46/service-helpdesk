import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { FileText, HelpCircle, Search } from 'lucide-react';

export default function Home() {
    return (
        <>
            <Head title="Service Desc" />
            <div className="flex min-h-screen items-start justify-center bg-slate-50 py-16 dark:bg-slate-900">
                <div className="w-full max-w-5xl px-4">
                    {/* {Heading} */}
                    <header className="mb-10 text-center">
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            Selamat Datang di Service Desk
                        </h1>
                        <p className="mx-auto mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
                            Layanan bantuan teknis untuk mendukung oprasional
                            sistem informasi dan teknologi di lingkungan
                            pemerintah daerah
                        </p>
                    </header>
                    <section className="mb-8 grid gap-6 md:grid-cols-2">
                        <Card className="flex flex-col justify-between p-8 text-center">
                            <CardHeader className="p-0">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-950">
                                        <FileText className="h-6 w-6 text-blue-600"></FileText>
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            Kirim Tiket Baru
                                        </CardTitle>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Laporkan masalah teknis atau
                                            permintaan bantuan baru
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="mt-6 p-0">
                                <Button className="w-full border border-gray-300 bg-white text-black shadow transition-colors duration-300 hover:bg-blue-500 hover:text-white">
                                    Buat Tiket Baru
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="flex flex-col justify-between p-8 text-center">
                            <CardHeader className="p-0">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="rounded-full bg-green-50 p-3 dark:bg-green-950">
                                        <Search className="h-6 w-6 text-green-600"></Search>
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            Tiket Saya
                                        </CardTitle>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Lihat status dan riwayat tiket yang
                                            telah dibuat
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="mt-6 p-0">
                                <Button className="w-full border border-gray-300 bg-white text-black shadow transition-colors duration-300 hover:bg-green-500 hover:text-white">
                                    Cek Status Tiket
                                </Button>
                            </CardContent>
                        </Card>
                    </section>

                    <section>
                        <Card className="bg-grey-100 p-8 text-center dark:bg-gray-800">
                            <div className="flex flex-col items-center gap-3">
                                <div className="rounded-full bg-yellow-50 p-3 dark:bg-yellow-950">
                                    <HelpCircle className="h-6 w-6 text-yellow-500"></HelpCircle>
                                </div>
                                <div>
                                    <CardTitle className="text-lg">
                                        Lupa ID Pelacakan
                                    </CardTitle>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Dapatkan Kembali ID tiket Anda melalui
                                        email
                                    </p>
                                </div>
                                <a
                                    href="#"
                                    className="mt-3 text-sm text-blue-600 hover:underline"
                                >
                                    Lupa ID Pelacakan
                                </a>
                            </div>
                        </Card>
                    </section>
                </div>
            </div>
        </>
    );
}
