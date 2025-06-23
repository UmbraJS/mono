interface ZoneHitOptions {
  zones: NodeListOf<Element>,
  hit: (zones: Element[], el: Draggable.Vars) => void,
  mis?: (zones: Element[], el: Draggable.Vars) => void,
  dud?: (el: Draggable.Vars) => void
}

export function checkZoneHit(draggable: Draggable.Vars, { zones, hit, mis = () => { }, dud = () => { } }: ZoneHitOptions) {
  const allHitZones = Array.from(zones).filter((zone) => draggable.hitTest(zone, "50%"));
  const allMissedZones = Array.from(zones).filter((zone) => !draggable.hitTest(zone, "50%"));
  const noHitsAllMisses = allHitZones.length === 0
  hit(allHitZones, draggable);
  mis(allMissedZones, draggable);
  if (noHitsAllMisses) dud(draggable);
}
