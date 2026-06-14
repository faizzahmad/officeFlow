"use client";

import { Building2, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserProfileMenu({
  name,
  email,
  image,
  organizationName,
  role,
}: {
  name: string;
  email: string;
  image?: string | null;
  organizationName: string;
  role: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-auto items-center gap-3 rounded-lg px-2 py-1.5 outline-none hover:bg-muted"
        >
          <Avatar size="sm">
            {image ? <AvatarImage src={image} alt={name} /> : null}
            <AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-left md:block">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="mt-1 text-xs capitalize text-muted-foreground">
              {role}
            </p>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <p className="font-medium">{name}</p>
                <p className="text-xs text-muted-foreground">{email}</p>
              </div>
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
            <Building2 className="size-4" />
            {organizationName}
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/profile" />}>
            <User className="size-4" />
            My profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              await authClient.signOut();
              toast.success("Signed out");
              router.push("/login");
              router.refresh();
            }}
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
