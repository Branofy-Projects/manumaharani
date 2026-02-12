'use client';

import { Check, ChevronsUpDown, GalleryVerticalEnd } from 'lucide-react';
import * as React from 'react';

import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
 SidebarMenu,
 SidebarMenuButton,
 SidebarMenuItem,
} from '@/components/ui/sidebar';

export interface Tenant {
 id: string;
 name: string;
}

export function OrgSwitcher({
 defaultTenant,
 onTenantSwitch,
 tenants,
}: {
 defaultTenant: Tenant;
 onTenantSwitch?: (tenantId: string) => void;
 tenants: Tenant[];
}) {
 const [selectedTenant, setSelectedTenant] = React.useState<Tenant | undefined>(
  defaultTenant || (tenants.length > 0 ? tenants[0] : undefined)
 );
 const [mounted, setMounted] = React.useState(false);

 React.useEffect(() => {
  setMounted(true);
 }, []);

 const handleTenantSwitch = (tenant: Tenant) => {
  setSelectedTenant(tenant);
  if (onTenantSwitch) {
   onTenantSwitch(tenant.id);
  }
 };

 if (!selectedTenant) {
  return null;
 }

 if (!mounted) {
  return (
   <SidebarMenu>
    <SidebarMenuItem>
     <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
    </SidebarMenuItem>
   </SidebarMenu>
  );
 }

 return (
  <SidebarMenu>
   <SidebarMenuItem>
    <DropdownMenu>
     <DropdownMenuTrigger asChild suppressHydrationWarning>
      <SidebarMenuButton
       className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
       size="lg"
      >
       <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <GalleryVerticalEnd className="size-4" />
       </div>
       <div className="flex flex-col gap-0.5 leading-none">
        <span className="font-semibold">{selectedTenant.name}</span>
       </div>
       <ChevronsUpDown className="ml-auto" />
      </SidebarMenuButton>
     </DropdownMenuTrigger>
     <DropdownMenuContent
      align="start"
      className="w-[--radix-dropdown-menu-trigger-width]"
      suppressHydrationWarning
     >
      {tenants.map((tenant) => (
       <DropdownMenuItem
        key={tenant.id}
        onSelect={() => handleTenantSwitch(tenant)}
       >
        {tenant.name}{' '}
        {tenant.id === selectedTenant.id && <Check className="ml-auto" />}
       </DropdownMenuItem>
      ))}
     </DropdownMenuContent>
    </DropdownMenu>
   </SidebarMenuItem>
  </SidebarMenu>
 );
}
