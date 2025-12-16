'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { BookOpen, Home, Library, Settings, Smile, Upload } from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/mood-matcher', label: 'Mood Matcher', icon: Smile },
  { href: '/library', label: 'My Library', icon: Library },
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary-foreground" />
          <span className="font-bold text-lg text-primary-foreground font-headline">
            GlobalLib
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === href}
                tooltip={{ children: label }}
              >
                <Link href={href}>
                  <Icon />
                  <span>{label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>{/* Add footer content if needed */}</SidebarFooter>
    </Sidebar>
  );
}
