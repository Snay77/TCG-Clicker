import { memo, useId } from "react";
import type { CSSProperties } from "react";
import type { Creature } from "../lib/cards";
import { VISUALS, atmosphere } from "../lib/visuals";
import Sprite from "./Sprite";
function CardArt({
  card,
  hidden = false,
  animated = true,
}: {
  card: Creature;
  hidden?: boolean;
  animated?: boolean;
}) {
  const id = useId();
  const { habitat, accent } = VISUALS[card.id];
  const night = ["moon", "astral"].includes(habitat);
  const wet = habitat === "pond";
  const warm = ["embers", "dawn"].includes(habitat);
  return (
    <div
      className={`card-art habitat-${habitat} ${animated ? "art-animated" : "art-still"}`}
      style={{ "--habitat-accent": accent } as CSSProperties}
    >
      <svg
        className="habitat-back"
        viewBox="0 0 160 160"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <defs>
          <linearGradient id={id} x2="0" y2="1">
            <stop
              stopColor={night ? "#232441" : warm ? "#583e4b" : "#214c50"}
            />
            <stop
              offset="1"
              stopColor={night ? "#59477b" : warm ? "#be8466" : "#77a17f"}
            />
          </linearGradient>
        </defs>
        <path fill={`url(#${id})`} d="M0 0h160v160H0z" />
        <g opacity=".7">
          <circle
            cx="111"
            cy="37"
            r={night ? 18 : 24}
            fill={night ? "#dcdaff" : warm ? "#ffdda0" : "#b2ddaa"}
          />
          {night && <circle cx="119" cy="31" r="16" fill="#30314e" />}
        </g>
        <path
          d="M0 95 20 77 40 83 68 61 102 87 134 70 160 82V160H0Z"
          fill={night ? "#383851" : warm ? "#715064" : "#386568"}
        />
        <path
          d="M0 108 32 94 60 99 96 86 131 98 160 89V160H0Z"
          fill={night ? "#44415c" : warm ? "#85646b" : "#527e73"}
        />
        {!night && (
          <g fill={warm ? "#66444d" : "#244953"} opacity=".7">
            {[8, 39, 133, 153].map((x, i) => (
              <g key={x}>
                <path d={`M${x} 0h${5 + (i % 3)}v130h-${5 + (i % 3)}z`} />
                <path d={`M${x} 51l-17-16v-5l17 12 17-17v6l-17 20z`} />
                <path d={`M${x - 18} 0h42v18h-8v15h-22V20h-12z`} />
              </g>
            ))}
          </g>
        )}
        {night && (
          <g fill="#d4c5ff">
            {atmosphere(card.seed, 22).map((p, i) => (
              <rect
                key={i}
                x={p.x * 1.6}
                y={p.y}
                width={p.size / 2}
                height={p.size / 2}
                opacity=".65"
              />
            ))}
          </g>
        )}
        {habitat === "astral" && (
          <g fill="none" stroke="#b891e6" opacity=".6">
            <ellipse
              cx="82"
              cy="80"
              rx="68"
              ry="25"
              transform="rotate(-30 82 80)"
            />
            <path d="M17 31 41 18 71 37 112 14 142 37" strokeDasharray="2 3" />
          </g>
        )}
        <ellipse
          cx="82"
          cy="139"
          rx="90"
          ry="33"
          fill={
            wet ? "#3c8290" : night ? "#373a58" : warm ? "#624952" : "#315c52"
          }
        />
        <ellipse
          cx="80"
          cy="137"
          rx="48"
          ry="12"
          fill={
            wet ? "#8bd6cf" : night ? "#74618f" : warm ? "#b58569" : "#76a27d"
          }
          opacity=".65"
        />
        {wet && (
          <g fill="none" stroke="#b4efe0" opacity=".6">
            <ellipse cx="80" cy="141" rx="62" ry="7" />
            <ellipse cx="70" cy="130" rx="39" ry="4" />
          </g>
        )}
      </svg>
      <div className="habitat-haze" />
      <div className="illustration-creature">
        <Sprite creature={card} silhouette={hidden} animated={animated} />
      </div>
      <svg
        className="habitat-front"
        viewBox="0 0 160 160"
        aria-hidden="true"
        shapeRendering="crispEdges"
      >
        <g fill={night ? "#272d48" : warm ? "#463440" : "#1d4546"}>
          <path d="M0 143 7 125 9 145 17 134 15 150 28 139 24 160H0ZM160 140l-8-17-1 21-10-11 4 20-17-6 6 13h26z" />
          {!night && (
            <path d="M2 0h8v45l12 12-3 5-12-9v35H0ZM160 0h-9v39l-12 10 3 5 11-8v44h7z" />
          )}
        </g>
        {[17, 137].map((x, i) =>
          habitat === "mushrooms" ? (
            <g key={x}>
              <path d={`M${x} 133h3v17h-3z`} fill="#e6d2ad" />
              <path
                d={`M${x - 9} 132h21v4h-21zM${x - 6} 127h15v5h-15zM${x - 2} 123h7v4h-7z`}
                fill="#eaa4c2"
              />
              <path
                d={`M${x - 3} 129h3v2h-3zM${x + 5} 132h3v2h-3z`}
                fill="#fff1d2"
              />
            </g>
          ) : night || warm ? (
            <g key={x} fill={accent}>
              <path d={`M${x} 149l-4-12 5-9 5 10-3 11z`} opacity=".7" />
              <path d={`M${x + 5} 151v-9l4-6 3 11-4 4z`} opacity=".4" />
            </g>
          ) : (
            <g key={x}>
              <path
                d={`M${x} 151v-19h2v19zM${x} 141l-6-6v-3l6 5z`}
                fill="#67a984"
              />
              <path
                d={`M${x - 3} ${130 - i * 6}h8v3h-8zM${x - 1} ${128 - i * 6}h3v7h-3z`}
                fill={i ? "#f8ddb2" : "#eab7d9"}
              />
            </g>
          ),
        )}
      </svg>
      <div className="habitat-particles" aria-hidden="true">
        {atmosphere(card.seed).map((p, i) => (
          <span
            key={i}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
export default memo(CardArt);
