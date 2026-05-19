import Image from "next/image";
import Link from "next/link";

interface BrandProps {
  href?: string;
  title?: string;
  caption?: string;
}

export function Brand({ href = "/", title = "Eagle Courier", caption }: BrandProps) {
  return (
    <Link href={href} className="brand">
      <Image src="/logo.svg" alt="Eagle Courier logo" width={48} height={48} className="brand-logo" />
      <div>
        <span className="brand-name">{title}</span>
        {caption ? <span className="brand-caption">{caption}</span> : null}
      </div>
    </Link>
  );
}
