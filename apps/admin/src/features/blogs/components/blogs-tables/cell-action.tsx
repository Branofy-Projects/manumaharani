"use client";

import { deleteBlog } from '@repo/actions';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import type { TBlog } from "@repo/db";

interface CellActionProps {
  data: TBlog;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onConfirm = async () => {
    if (!confirm(`Are you sure you want to delete blog "${data.title}"?`)) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteBlog(data.id);
        toast.success("Blog deleted successfully");
        router.refresh();
      } catch (error) {
        toast.error("Failed to delete blog");
      }
    });
  };

  const onCopy = (id: number) => {
    navigator.clipboard.writeText(id.toString());
    toast.success("Blog ID copied to clipboard");
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 p-0" disabled={isPending} variant="ghost">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onCopy(data.id)}>
          <Copy className="mr-2 h-4 w-4" /> Copy ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/blogs/${data.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          disabled={isPending}
          onClick={onConfirm}
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

