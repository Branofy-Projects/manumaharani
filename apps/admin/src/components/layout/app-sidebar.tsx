"use client";
import {
  IconBell, IconChevronRight, IconChevronsDown, IconCreditCard, IconLogout, IconPhotoUp,
  IconUserCircle
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as React from 'react';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton,
  SidebarMenuSubItem, SidebarRail
} from '@/components/ui/sidebar';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { navItems } from '@/constants/data';
import { useAuth } from '@/hooks/use-auth';
import { useMediaQuery } from '@/hooks/use-media-query';

import type { Tenant } from "../org-switcher";

import { Icons } from '../icons';

export const company = {
  logo: IconPhotoUp,
  name: "Acme Inc",
  plan: "Enterprise",
};

const tenants: Tenant[] = [
  { id: "1", name: "Acme Inc" },
  { id: "2", name: "Beta Corp" },
  { id: "3", name: "Gamma Ltd" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { isOpen } = useMediaQuery();
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  const handleSwitchTenant = (_tenantId: string) => {
    // Tenant switching functionality would be implemented here
  };

  const activeTenant = tenants[0];

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    // Side effects based on sidebar state changes
  }, [isOpen]);

  if (!mounted) {
    return (
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
        </SidebarHeader>
        <SidebarContent className="overflow-x-hidden">
          <div className="h-64 w-full animate-pulse rounded-md bg-muted" />
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader suppressHydrationWarning>
        <Link
          className="flex items-center justify-center px-2 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md min-h-[3rem]"
          href="/"
        >
          <Image
            alt="Manu Maharani"
            className="h-10 w-auto max-w-full object-contain group-data-[collapsible=icon]:h-8"
            height={112}
            priority
            src="/logo.webp"
            width={160}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden" suppressHydrationWarning>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              return item?.items && item?.items?.length > 0 ? (
                <Collapsible
                  asChild
                  className="group/collapsible"
                  defaultOpen={mounted ? item.isActive : false}
                  key={item.title}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={pathname === item.url}
                        tooltip={item.title}
                      >
                        {item.icon && <Icon />}
                        <span>{item.title}</span>
                        <IconChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent suppressHydrationWarning>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => {
                          // const SubItemIcon = subItem.icon ? Icons[subItem.icon] : undefined
                          return <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url}>
                                {/* {SubItemIcon && <SubItemIcon />} */}
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter suppressHydrationWarning>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild suppressHydrationWarning>
                <SidebarMenuButton
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  size="lg"
                >
                  {user && (
                    <UserAvatarProfile
                      className="h-8 w-8 rounded-lg"
                      showInfo
                      user={user}
                    />
                  )}
                  <IconChevronsDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                sideOffset={4}
                suppressHydrationWarning
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="px-1 py-1.5">
                    {user && (
                      <UserAvatarProfile
                        className="h-8 w-8 rounded-lg"
                        showInfo
                        user={user}
                      />
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/profile")}
                  >
                    <IconUserCircle className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconCreditCard className="mr-2 h-4 w-4" />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconBell className="mr-2 h-4 w-4" />
                    Notifications
                  </DropdownMenuItem>
                </DropdownMenuGroup> */}
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem asChild>
                  <SignOutButton
                    className="w-full justify-start"
                    variant="ghost"
                  />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
