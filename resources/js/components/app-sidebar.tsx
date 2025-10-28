import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import { route } from 'ziggy-js';

export function AppSidebar() {
    const page = usePage() as any;
    const user = page?.props?.auth?.user; // undefined kalau guest
    const role: string | undefined = user?.role;
    const mainNavItems: NavItem[] =
        role === 'admin'
            ? [
                  {
                      title: 'Admin Dashboard',
                      href: route('admin.dashboard'),
                      icon: LayoutGrid,
                  },
                  {
                      title: 'Buat Kategori dan Operator', // Link ke halaman create kategori dan operator
                      href: route('admin.categories.create'),
                      icon: Folder,
                  },
                  // tambahkan menu admin lainnya di sini...
              ]
            : role === 'operator'
              ? [
                    {
                        title: 'Operator Dashboard',
                        href: route('operator.dashboard'),
                        icon: LayoutGrid,
                    },
                    // tambahkan menu operator lainnya di sini...
                ]
              : [
                    // fallback untuk guest / halaman publik
                    {
                        title: 'Home',
                        href: route('home'),
                        icon: LayoutGrid,
                    },
                ];

    const logoHref =
        role === 'admin'
            ? route('admin.dashboard')
            : role === 'operator'
              ? route('operator.dashboard')
              : route('home');
    // const mainNavItems: NavItem[] = [
    //     {
    //         title: 'Admin Dashboard',
    //         href: route('admin.dashboard'),
    //         icon: LayoutGrid,
    //     },
    // ];

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={logoHref} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
