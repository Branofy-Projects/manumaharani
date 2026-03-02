"use client";

import * as labIcons from "@lucide/lab";
import { Check, Icon, type IconNode } from "lucide-react";
import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { IconName } from "lucide-react/dynamic";

// --- Lab icon helpers ---

const LAB_PREFIX = "lab:";

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z0-9])/g, "$1-$2").toLowerCase();
}

const labIconMap = new Map<string, IconNode>(
  Object.entries(labIcons).map(([camelName, node]) => [
    toKebabCase(camelName),
    node as IconNode,
  ]),
);

const labIconNames = Array.from(labIconMap.keys()).map(
  (name) => `${LAB_PREFIX}${name}`,
);

// Combined list: standard icons first, then lab icons
const allIconNames = [...(iconNames as readonly string[]), ...labIconNames];

export function getLabIconNode(name: string): IconNode | undefined {
  const kebabName = name.startsWith(LAB_PREFIX)
    ? name.slice(LAB_PREFIX.length)
    : name;
  return labIconMap.get(kebabName);
}

export function isLabIcon(name: string): boolean {
  return name.startsWith(LAB_PREFIX);
}

/** Renders any icon (standard or lab) by name. */
export function RenderIcon({
  className,
  name,
  size = 16,
}: {
  className?: string;
  name: string;
  size?: number;
}) {
  if (isLabIcon(name)) {
    const node = getLabIconNode(name);
    if (!node) return null;
    return <Icon className={className} iconNode={node} size={size} />;
  }
  return (
    <DynamicIcon className={className} name={name as IconName} size={size} />
  );
}

// --- Icon picker ---

const ITEMS_PER_PAGE = 80;

interface IconSelectProps {
  children: React.ReactNode;
  onIconSelect?: (iconName: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  selectedIcon?: string;
}

function displayName(name: string): string {
  return name.startsWith(LAB_PREFIX) ? name.slice(LAB_PREFIX.length) : name;
}

const IconItem = React.memo(
  ({
    iconName,
    isSelected,
    onSelect,
  }: {
    iconName: string;
    isSelected: boolean;
    onSelect: (iconName: string) => void;
  }) => {
    return (
      <CommandItem
        className="hover:bg-accent relative flex h-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md p-2 [&>svg:last-child]:hidden"
        key={iconName}
        onSelect={() => onSelect(iconName)}
        title={displayName(iconName)}
        value={iconName}
      >
        <div className="flex items-center justify-center">
          <RenderIcon name={iconName} size={18} />
        </div>
        <span className="text-muted-foreground w-full truncate text-center text-[10px] leading-tight">
          {displayName(iconName)}
        </span>
        {isSelected && (
          <div className="text-primary absolute top-1 right-1">
            <Check size={12} />
          </div>
        )}
      </CommandItem>
    );
  },
);

IconItem.displayName = "IconItem";

interface IconSelectButtonProps {
  className?: string;
  onIconSelect?: (iconName: string) => void;
  selectedIcon?: string;
  size?: "default" | "lg" | "sm";
  variant?: "default" | "ghost" | "outline";
}

export function IconSelect({
  children,
  onIconSelect,
  selectedIcon,
}: IconSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(0);

  const filteredIcons = React.useMemo(() => {
    if (!searchTerm) return allIconNames;
    const lower = searchTerm.toLowerCase();
    return allIconNames.filter((name) =>
      displayName(name).toLowerCase().includes(lower),
    );
  }, [searchTerm]);

  const paginatedIcons = React.useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredIcons.slice(start, end);
  }, [filteredIcons, currentPage]);

  const totalPages = Math.ceil(filteredIcons.length / ITEMS_PER_PAGE);

  const handleIconSelect = (iconName: string) => {
    onIconSelect?.(iconName);
    setOpen(false);
    setSearchTerm("");
    setCurrentPage(0);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[900px] p-0 sm:max-w-[900px]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Select an Icon</DialogTitle>
          <DialogDescription>
            Choose from {allIconNames.length} available icons (
            {iconNames.length} standard + {labIconNames.length} lab).
            {filteredIcons.length < allIconNames.length && (
              <span> ({filteredIcons.length} filtered)</span>
            )}
          </DialogDescription>
        </DialogHeader>
        <Command className="border-0" shouldFilter={false}>
          <CommandInput
            onValueChange={handleSearchChange}
            placeholder="Search icons..."
          />
          <CommandList className="max-h-[500px]">
            <CommandEmpty>No icons found.</CommandEmpty>
            <div className="grid grid-cols-3 gap-1.5 p-2 pb-8 sm:grid-cols-5 md:grid-cols-7">
              {paginatedIcons.map((iconName) => (
                <IconItem
                  iconName={iconName}
                  isSelected={selectedIcon === iconName}
                  key={iconName}
                  onSelect={handleIconSelect}
                />
              ))}
            </div>
            {currentPage < totalPages - 1 && (
              <div className="flex justify-center p-4">
                <Button
                  className="w-full"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Load More ({ITEMS_PER_PAGE * (currentPage + 1)} of{" "}
                  {filteredIcons.length})
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function IconSelectButton({
  className,
  onIconSelect,
  selectedIcon,
  size = "default",
  variant = "outline",
}: IconSelectButtonProps) {
  return (
    <IconSelect onIconSelect={onIconSelect} selectedIcon={selectedIcon}>
      <Button
        className={cn("gap-2", className)}
        size={size}
        type="button"
        variant={variant}
      >
        {selectedIcon ? <RenderIcon name={selectedIcon} size={16} /> : null}
        {selectedIcon ? displayName(selectedIcon) : "Select Icon"}
      </Button>
    </IconSelect>
  );
}
