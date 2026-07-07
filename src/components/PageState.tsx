import { Link } from "@tanstack/react-router";

interface Props {
  variant?: "notfound" | "error";
  eyebrow?: string;
  title: string;
  message?: string;
  primary?: { label: string; onClick?: () => void; to?: string };
  secondary?: { label: string; to?: string };
}

export function PageState({ variant = "notfound", eyebrow, title, message, primary, secondary }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        {variant === "notfound" && (
          <h1 className="font-serif text-7xl font-bold text-foreground">{eyebrow ?? "404"}</h1>
        )}
        <h2 className={variant === "notfound"
          ? "mt-4 text-xl font-semibold text-foreground"
          : "font-serif text-2xl font-semibold text-foreground"}>
          {title}
        </h2>
        {message && (
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {primary && (
            primary.onClick ? (
              <button
                onClick={primary.onClick}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                {primary.label}
              </button>
            ) : (
              <Link
                to={primary.to ?? "/"}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                {primary.label}
              </Link>
            )
          )}
          {secondary && (
            <Link
              to={secondary.to ?? "/"}
              className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
