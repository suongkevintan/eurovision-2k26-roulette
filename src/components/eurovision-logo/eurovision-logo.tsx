import Image from "next/image";

type EurovisionLogoProps = {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  xs: 32,
  sm: 40,
  md: 56,
  lg: 80
} as const;

export function EurovisionLogo({ size = "md", className }: EurovisionLogoProps) {
  const px = sizeMap[size];
  const classNames = ["eurovision-logo", className].filter(Boolean).join(" ");
  return (
    <span
      className={classNames}
      role="img"
      aria-label="Eurovision Roulette"
      style={{ width: px, height: px }}
    >
      <Image
        src="/assets/Eurovision_Logo.png"
        alt=""
        width={px}
        height={px}
        className={"eurovision-logo__img"}
      />
    </span>
  );
}
