import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./cta-button.module.css";

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
    styles["cta-button"],
    styles[`cta-button--${variant}`],
    styles[`cta-button--surface-${surface}`],
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classNames} {...rest}>
      <span className={styles["cta-button__bevel"]} aria-hidden="true" />
      <span className={styles["cta-button__inner"]}>
        {icon ? <span className={styles["cta-button__icon"]} aria-hidden="true">{icon}</span> : null}
        {children ? <span className={styles["cta-button__label"]}>{children}</span> : null}
      </span>
    </button>
  );
}
