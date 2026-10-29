import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

/** Lightweight shadcn/ui-inspired primitives, styled by the shared design tokens. */
type ButtonVariant = "default" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export function Button({
  variant = "default",
  size = "default",
  leadingIcon,
  trailingIcon,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`ui-button ui-button--${variant} ui-button--${size} ${className}`.trim()} {...props}>
      {leadingIcon && <span className="ui-button__icon">{leadingIcon}</span>}
      <span>{children}</span>
      {trailingIcon && <span className="ui-button__icon">{trailingIcon}</span>}
    </button>
  );
}

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  children: ReactNode;
};

export function Card({ interactive = false, className = "", children, ...props }: CardProps) {
  return (
    <div className={`ui-card${interactive ? " ui-card--interactive" : ""} ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`ui-card__header ${className}`.trim()} {...props} />;
}

export function CardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={`ui-card__title ${className}`.trim()} {...props} />;
}

export function CardDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={`ui-card__description ${className}`.trim()} {...props} />;
}

export function CardContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`ui-card__content ${className}`.trim()} {...props} />;
}

export function Badge({
  variant = "default",
  className = "",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "outline" | "success" | "warning" }) {
  return <span className={`ui-badge ui-badge--${variant} ${className}`.trim()} {...props} />;
}

export function Separator({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" className={`ui-separator ${className}`.trim()} {...props} />;
}

export function Skeleton({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div aria-hidden="true" className={`ui-skeleton ${className}`.trim()} {...props} />;
}

/** Magic UI-inspired shimmer CTA. */
export function ShimmerButton({
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`magic-shimmer-button ${className}`.trim()} {...props}>
      <span className="magic-shimmer-button__shine" aria-hidden="true" />
      <span className="magic-shimmer-button__content">{children}</span>
    </button>
  );
}


export type StatusKind = "live" | "upcoming" | "completed" | "draft" | "error" | "success" | "neutral";

export function StatusChip({ status, children }: { status: StatusKind; children: ReactNode }) {
  return <span className={`status-chip status-chip--${status}`}><span className="status-chip__dot" aria-hidden="true" />{children}</span>;
}

export function FormField({
  id, label, hint, error, required, children,
}: {
  id: string; label: string; hint?: string; error?: string; required?: boolean; children: ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={`ui-form-field${error ? " ui-form-field--error" : ""}`}>
      <label className="ui-form-field__label" htmlFor={id}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {children}
      {hint && <small className="ui-form-field__hint" id={hintId}>{hint}</small>}
      {error && <small className="ui-form-field__error" id={errorId} role="alert">{error}</small>}
    </div>
  );
}

export function FeedbackState({
  kind = "empty", title, description, action,
}: {
  kind?: "loading" | "success" | "empty" | "error";
  title: string; description?: string; action?: ReactNode;
}) {
  return (
    <section className={`ui-feedback ui-feedback--${kind}`} role={kind === "error" ? "alert" : "status"} aria-live={kind === "loading" ? "polite" : "off"}>
      <span className="ui-feedback__mark" aria-hidden="true">{kind === "loading" ? "…" : kind === "success" ? "✓" : kind === "error" ? "!" : "—"}</span>
      <div className="ui-feedback__copy"><strong>{title}</strong>{description && <p>{description}</p>}{action && <div className="ui-feedback__action">{action}</div>}</div>
    </section>
  );
}
