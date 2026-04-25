import { flagPath } from "@/lib/flags";
import styles from "./flag.module.css";

type FlagProps = {
  code: string;
  countryName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const dimensions = {
  sm: { width: 56, height: 42 },
  md: { width: 80, height: 56 },
  lg: { width: 104, height: 72 },
} as const;

export function Flag({ code, countryName, size = "md", className }: FlagProps) {
  const { width, height } = dimensions[size];
  const classNames = [styles["flag"], className].filter(Boolean).join(" ");
  return (
    <span
      className={classNames}
      style={{ width, height }}
      role="img"
      aria-label={`Drapeau ${countryName}`}
    >
      {/* SVG flags don't benefit from next/image optimization */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={flagPath(code)}
        alt=""
        width={width}
        height={height}
        className={styles["flag__img"]}
        loading="lazy"
      />
    </span>
  );
}
