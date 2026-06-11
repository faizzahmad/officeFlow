import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10">
          <Logo href="/" showText className="[&_p]:text-primary-foreground [&_p:last-child]:text-primary-foreground/75 [&_.font-heading]:text-primary-foreground" />
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="font-heading text-4xl font-bold leading-tight">
            {title}
          </h1>
          <p className="max-w-md text-base text-primary-foreground/85">
            {subtitle}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {["HRMS", "Payroll", "Tasks", "Attendance"].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium backdrop-blur-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-sm text-primary-foreground/70">
          Built for startups, agencies, and growing teams.
        </p>
      </div>

      <div className="relative flex flex-col">
        <div className="absolute right-4 top-4 z-10 flex items-center gap-3 lg:right-6 lg:top-6">
          <ThemeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-3 text-center lg:hidden">
              <div className="flex justify-center">
                <Logo href="/" showText={false} />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
