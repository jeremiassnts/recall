import { Calendar, LayoutDashboard, List } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import logoWhite from '../../public/logo-white.webp';

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
    return (
        <nav className="w-[20vw] min-h-screen bg-gray-100 dark:bg-gray-800 border-r-[1px] border-gray-200 dark:border-r-gray-800 p-4 flex flex-col">
            <div>
                <Image src={logoWhite} alt="Recall" width={70} height={70} />
                <a className='text-xs text-gray-600 dark:text-gray-400' href="https://jeremiassnts.vercel.app/en" target='_blank'>created by Jeremias Santos</a>
            </div>
            <ul className='pt-8 flex flex-col gap-1'>
                {menuItems.map((item) => (
                    <li key={item.href} className='hover:bg-gray-200 dark:hover:bg-gray-800 p-2 rounded-md transition-colors duration-200'>
                        <Link href={item.href} className='flex flex-row items-center gap-2'>
                            <item.icon className='w-4 h-4' />
                            <span className='text-sm font-medium'>{item.label}</span>
                        </Link>
                    </li>))}
            </ul>
        </nav>
    );
}