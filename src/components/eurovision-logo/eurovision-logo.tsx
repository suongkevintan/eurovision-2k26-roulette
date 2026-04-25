import styles from "./eurovision-logo.module.css";

type EurovisionLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: 40,
  md: 56,
  lg: 80
} as const;

export function EurovisionLogo({ size = "md", className }: EurovisionLogoProps) {
  const px = sizeMap[size];
  const classNames = [styles["eurovision-logo"], className].filter(Boolean).join(" ");
  return (
    <span className={classNames} aria-label="Eurovision Roulette">
      <img
        src="/assets/eurovision-logo.svg"
        alt=""
        width={px}
        height={px}
        className={styles["eurovision-logo__img"]}
      />
    </span>
  );
}
