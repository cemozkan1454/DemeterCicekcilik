import { useId } from "react";

function Vine({ side }: { side: "left" | "right" }) {
  const id = useId();
  return (
    <svg
      className={`botanical-vine botanical-${side}`}
      width="120"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id={id}
          width="120"
          height="720"
          patternUnits="userSpaceOnUse"
          y={side === "right" ? -260 : 0}
        >
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M60 0C94 60 94 120 60 180S26 300 60 360S94 480 60 540S26 660 60 720" />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => {
              const y = 45 + n * 86;
              const t = (y % 180) / 180;
              const x =
                60 + (Math.floor(y / 180) % 2 ? -1 : 1) * 102 * t * (1 - t);
              return (
                <g
                  key={n}
                  transform={`translate(${x} ${y}) scale(${n % 2 ? -1 : 1} 1) rotate(${(n % 3) * 12 - 25})`}
                >
                  <path d="M0 0Q4 6 12-9" strokeOpacity=".7" />
                  <path
                    d="M0 0C-7-12 4-27 25-36C31-14 22 6 0 0Z"
                    fill="#9ead88"
                    fillOpacity=".24"
                  />
                  <path
                    d="M1 7Q11-11 23-32M9-7L3-15M14-15L22-18"
                    strokeOpacity=".55"
                    strokeWidth="1"
                  />
                </g>
              );
            })}
            <path d="M72 145Q26 131 28 101" />
            {[{ x: 28, y: 96 }].map(({ x, y }, i) => (
              <g
                key={i}
                transform={`translate(${x} ${y})`}
                stroke="#b59d8e"
                strokeWidth="1"
              >
                {[0, 1, 2, 3, 4].map((n) => (
                  <ellipse
                    key={n}
                    cy="-10"
                    rx="6"
                    ry="10"
                    transform={`rotate(${n * 72})`}
                    fill={i ? "#eee4cb" : "#e6c3be"}
                    fillOpacity=".85"
                  />
                ))}
                <circle r="4" fill="#c3a66b" />
              </g>
            ))}
            <path
              d="M60 360Q101 339 105 309Q107 292 98 297Q91 304 102 307"
              strokeOpacity=".6"
            />
          </g>
        </pattern>
      </defs>
      <rect width="120" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default function BotanicalDecor() {
  return (
    <div className="botanical-decor" aria-hidden="true">
      <Vine side="left" />
      <Vine side="right" />
    </div>
  );
}
