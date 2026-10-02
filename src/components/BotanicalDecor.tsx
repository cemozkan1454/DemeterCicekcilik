import { useId } from 'react';

function Vine({ side }: { side: 'left' | 'right' }) {
  const id = useId();
  return (
    <svg className={`botanical-vine ${side === 'left' ? 'botanical-left' : 'botanical-right'}`} width="120" height="100%" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={id} width="120" height="720" patternUnits="userSpaceOnUse" y={side === 'right' ? -180 : 0}>
          <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            {/* Matching endpoints and tangents keep every repeat seamless. */}
            <path d="M60 0C94 60 94 120 60 180S26 300 60 360S94 480 60 540S26 660 60 720" />
            {[0, 1, 2, 3].map((index) => (
              <g key={index} transform={`translate(${index % 2 === 0 ? 85.5 : 34.5} ${90 + index * 180}) scale(${index % 2 === 0 ? -1 : 1} 1)`}>
                <path d="M0 0C-5-17 8-33 30-42C33-20 22-2 0 0Z" fill="#a7b79a" fillOpacity=".3" />
                <path d="M0 0Q16-17 30-42" strokeWidth=".85" strokeOpacity=".55" />
              </g>
            ))}
            {[180, 360, 540, 690].map((y, index) => (
              <g className="botanical-desktop-detail" key={y} transform={`translate(${y === 690 ? 45.833 : 60} ${y}) scale(${index % 2 === 0 ? 1 : -1} 1)`}>
                <path d="M0 0C-4-14 10-32 36-40C35-17 21-1 0 0Z" fill="#8fa77f" fillOpacity=".4" />
                <path d="M0 0Q20-17 36-40" strokeWidth=".85" strokeOpacity=".5" />
              </g>
            ))}
            <path d="M60 360Q79 349 83 327" strokeWidth="1.1" />
            <path className="botanical-desktop-detail" d="M60 540Q31 534 25 520" strokeWidth="1.1" />
          </g>
          <g className="botanical-desktop-detail" transform="translate(25 510)">
            {[0, 1, 2, 3, 4].map((index) => (
              <ellipse key={index} cy="-9" rx="6" ry="9" transform={`rotate(${index * 72})`} fill="#e6d7b5" />
            ))}
            <circle r="4" fill="#bd9c60" />
          </g>
          <g transform="translate(83 317)">
            {[0, 1, 2, 3, 4].map((index) => (
              <ellipse key={index} cy="-9" rx="5.5" ry="9" transform={`rotate(${index * 72})`} fill="#e4c4b9" />
            ))}
            <circle r="4" fill="#c4ac73" />
          </g>
        </pattern>
      </defs>
      <rect width="120" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default function BotanicalDecor() {
  return <div className="botanical-decor" aria-hidden="true"><Vine side="left" /><Vine side="right" /></div>;
}
