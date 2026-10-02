import { memo, useMemo } from "react";
import { CONTENT_PARTS, contentPaths, type ContentPart } from "../../lib/content/directed-sprites";
import type { CardDesign } from "../../lib/content/model";
function ContentSprite({ card, seed = card.seed, size = 160, silhouette = false, animated = true, onlyPart }: {
  card: CardDesign; seed?: number; size?: number; silhouette?: boolean; animated?: boolean; onlyPart?: ContentPart;
}) {
  const paths=useMemo(()=>contentPaths(card,seed),[card,seed]);
  return <svg className={`content-sprite idle-${card.sprite!.idle} ${animated && !silhouette ? "content-alive" : "content-still"}`}
    width={size} height={size} viewBox="0 0 64 64" shapeRendering="crispEdges" role="img"
    aria-label={silhouette ? "Créature inconnue" : `Sprite de ${card.name}`} data-design-id={card.id}>
    {!silhouette && !onlyPart && <ellipse cx="32" cy="61" rx="19" ry="2" fill="#0e1c30" opacity=".18" />}
    {CONTENT_PARTS.filter(part=>!onlyPart||part===onlyPart).map(part=><g className={`content-part cp-${part}`} key={part}>
      {paths.filter(p=>p.part===part).map(p=><path key={p.color} d={p.d} fill={silhouette ? "#000000" : p.color} />)}
    </g>)}
  </svg>;
}
export default memo(ContentSprite);
