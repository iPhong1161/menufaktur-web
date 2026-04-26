/**
 * Logo component — renders the menufaktur logo mark SVG.
 *
 * variant="light"  → cream (#F5E1CC) on transparent — use on Wine Red backgrounds
 * variant="dark"   → burgundy on transparent — use on light backgrounds
 *
 * The cream variants (1300×843) and burgundy variants (769×673) have
 * different native dimensions, so each variant carries its own aspect ratio.
 */

interface LogoProps {
  variant?: "light" | "dark"
  /** Rendered height in pixels; width is calculated from the SVG's native aspect ratio */
  height?: number
  className?: string
}

const VARIANTS = {
  light: {
    src: "/brand/menufaktur-icon-cream.svg",
    aspectRatio: 1300 / 843, // ~1.542
  },
  dark: {
    src: "/brand/menufaktur-icon-burgundy.svg",
    aspectRatio: 769 / 673, // ~1.143
  },
}

export function Logo({ variant = "light", height = 40, className }: LogoProps) {
  const { src, aspectRatio } = VARIANTS[variant]
  const width = Math.round(height * aspectRatio)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="menufaktur"
      width={width}
      height={height}
      className={className}
      draggable={false}
    />
  )
}
