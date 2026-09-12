import Link from "next/link";

type KrifthLogoProps = {
  href?: string;
  className?: string;
  dotClassName?: string;
  showDot?: boolean;
};

export default function KrifthLogo({
  href = "#top",
  className = "",
  dotClassName = "wordmark-dot",
  showDot = true,
}: KrifthLogoProps) {
  return (
    <Link href={href} className={['wordmark', className].filter(Boolean).join(' ')}>
      Krifth{showDot ? <span className={dotClassName} /> : null}
    </Link>
  );
}
