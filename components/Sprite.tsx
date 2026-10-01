import { memo, useMemo } from "react";
import { spritePaths, SPRITE_SIZE, type Part } from "../lib/sprites";
import type { Creature } from "../lib/cards";
function Sprite({
  creature,
  seed,
  silhouette = false,
  animated = true,
  onlyPart,
}: {
  creature: Creature;
  seed?: number;
  silhouette?: boolean;
  animated?: boolean;
  onlyPart?: Part;
}) {
  const paths = useMemo(() => spritePaths(creature, seed), [creature, seed]);
  return (
    <svg
      className={`sprite sprite-${creature.id} ${animated && !silhouette ? "sprite-alive" : "sprite-still"}`}
      viewBox={`0 0 ${SPRITE_SIZE} ${SPRITE_SIZE}`}
      role="img"
      aria-label={silhouette ? "Créature inconnue" : creature.name}
      shapeRendering="crispEdges"
    >
      <ellipse
        className="sprite-shadow"
        cx="32"
        cy="60"
        rx="19"
        ry="2"
        fill="#111c30"
        opacity=".25"
      />
      <g className="sprite-anatomy">
        {(["tail", "wings", "body", "crown", "face"] as Part[])
          .filter((p) => !onlyPart || p === onlyPart)
          .map((part) => (
            <g className={`sprite-part part-${part}`} key={part}>
              {paths
                .filter((p) => p.part === part)
                .map((p) => (
                  <path
                    key={p.color}
                    d={p.d}
                    fill={silhouette ? "#344654" : p.color}
                  />
                ))}
            </g>
          ))}
      </g>
    </svg>
  );
}
export default memo(Sprite);
