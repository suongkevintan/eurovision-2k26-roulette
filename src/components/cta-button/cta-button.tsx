import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "panel" | "icon-only" | "secondary";
type Surface = "light" | "dark";

type CtaButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  surface?: Surface;
  icon?: ReactNode;
  children?: ReactNode;
};

export function CtaButton({
  variant = "primary",
  surface = "light",
  icon,
  children,
  className,
  ...rest
}: CtaButtonProps) {
  const classNames = [
    "cta-button",
    `cta-button--${variant}`,
    surface !== "light" ? `cta-button--surface-${surface}` : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classNames} {...rest}>
      <span className={"cta-button__bevel"} aria-hidden="true" />
      <span className={"cta-button__inner"}>
        {icon ? <span className={"cta-button__icon"} aria-hidden="true">{icon}</span> : null}
        {children ? <span className={"cta-button__label"}>{children}</span> : null}
      </span>
    </button>
  );
}
