"use client";

import { Calendar, LayoutDashboard, List } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import logoWhite from '../../public/logo-white.webp';
import { LoggedUser } from './LoggedUser';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuItem } from './ui/sidebar';

const menuItems = [
    {
        href: "/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard"
    },
    {
        href: "/dashboard/applications",
        icon: List,
        label: "Applications"
    },
    {
        href: "/dashboard/calendar",
        icon: Calendar,
        label: "Calendar"
    }
]

export function Menu() {
    const pathname = usePathname()
    return (
        <Sidebar>
            <SidebarHeader className='p-4'>
                <Image src={logoWhite} alt="Recall" width={70} height={70} className="invert dark:invert-0" />
                <a className='text-xs text-gray-600 dark:text-gray-400' href="https://jeremiassnts.vercel.app/en" target='_blank'>created by Jeremias Santos</a>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className='gap-1'>
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.href} data-active={pathname === item.href} className='data-[active=true]:bg-gray-200 dark:data-[active=true]:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md transition-colors duration-200'>
                            <Link href={item.href} className='flex flex-row items-center gap-2'>
                                <item.icon className='w-4 h-4' />
                                <span className='text-sm font-medium'>{item.label}</span>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <LoggedUser showUserInfo={true} />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}