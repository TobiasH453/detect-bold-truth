import logo from "@/assets/aisore-logo.png";

interface Props {
  size?: number;
  className?: string;
  pulse?: boolean;
}

export function Logo({ size = 40, className = "", pulse = false }: Props) {
  return (
    <img
      src={logo}
      alt="AIsore"
      width={size}
      height={size}
      className={`${pulse ? "pulse-eye" : ""} ${className}`}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>AIsore</span>
  );
}
