import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  showText = true,
  size = "md",
  className,
}: {
  href?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = { sm: 28, md: 36, lg: 44 } as const;
  const dimension = sizes[size];

  const content = (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex size-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
        <Image
          src="/logo.svg"
          alt="Office Flow"
          width={dimension}
          height={dimension}
          className="size-7"
          priority
        />
      </div>
      {showText ? (
        <div className="min-w-0">
          <p className="font-heading text-base font-bold tracking-tight text-foreground">
            Office Flow
          </p>
          <p className="text-xs text-muted-foreground">All-in-One CRM</p>
        </div>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
