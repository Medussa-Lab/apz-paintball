interface PaintSplatterProps {
  className?: string
  opacity?: number
  color?: string
}

export default function PaintSplatter({
  className = '',
  opacity = 0.15,
  color = '#FFD000',
}: PaintSplatterProps) {
  return (
    <svg
      viewBox="0 0 400 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      aria-hidden="true"
    >
      <ellipse cx="200" cy="140" rx="155" ry="95" fill={color} />
      <ellipse cx="330" cy="70" rx="42" ry="28" fill={color} />
      <ellipse cx="60" cy="200" rx="35" ry="22" fill={color} />
      <ellipse cx="355" cy="190" rx="28" ry="18" fill={color} />
      <ellipse cx="100" cy="55" rx="25" ry="16" fill={color} />
      <circle cx="370" cy="130" r="14" fill={color} />
      <circle cx="30" cy="110" r="11" fill={color} />
      <circle cx="200" cy="250" r="18" fill={color} />
      <circle cx="140" cy="20" r="9" fill={color} />
      <circle cx="310" cy="240" r="12" fill={color} />
      <ellipse cx="70" cy="240" rx="16" ry="10" fill={color} />
      <ellipse cx="260" cy="15" rx="18" ry="11" fill={color} />
      {/* Drip drops */}
      <ellipse cx="185" cy="265" rx="5" ry="10" fill={color} />
      <ellipse cx="220" cy="270" rx="4" ry="8" fill={color} />
      <ellipse cx="320" cy="210" rx="4" ry="7" fill={color} />
    </svg>
  )
}
