export default function LogoMJC({ className = "", markColor = "currentColor", textColor = "currentColor" }) {
  return (
    <svg 
      viewBox="0 0 420 160" 
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g 
        fill="none" 
        stroke={markColor} 
        strokeWidth="28" 
        strokeLinejoin="miter" 
        strokeMiterlimit="4" 
        strokeLinecap="butt"
        transform="skewX(-20) translate(50, 0)"
      >
        {/* M */}
        <path d="M 30 100 L 30 24 L 90 84 L 150 24 L 150 100" />
        {/* J */}
        <path d="M 182 24 L 262 24 L 262 100 L 202 100 L 202 60" />
        {/* C */}
        <path d="M 374 24 L 294 24 L 294 100 L 374 100" />
      </g>
      <text 
        x="210" 
        y="148" 
        fontFamily="'Syne', sans-serif" 
        fontSize="20" 
        fontWeight="800" 
        letterSpacing="0.4em" 
        textAnchor="middle" 
        fill={textColor} 
        stroke="none"
      >
        MALCOLM.CUADY
      </text>
    </svg>
  );
}
