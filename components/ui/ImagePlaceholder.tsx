import { cn } from "@/lib/utils"

interface ImagePlaceholderProps {
  label: string
  className?: string
}

export function ImagePlaceholder({ label, className }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "bg-gray-200 flex items-center justify-center",
        className
      )}
    >
      <span className="text-[11px] text-gray-400 font-mono text-center px-4 leading-relaxed">
        {label}
      </span>
    </div>
  )
}
