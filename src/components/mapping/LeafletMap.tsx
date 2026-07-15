import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CoordinateDisplay from './CoordinateDisplay';
import { HouseholdPopup } from "./HouseholdPopup";
import { HouseholdFilterBar, applyHouseholdFilters, type HouseholdFilters } from '../data-repository/HouseholdFilterBar';
import { 
  households, 
  POLITICAL_CANDIDATES,
  type Household, 
  type Person, 
  persons,
  type PoliticalTendency,
  type PoliticalOrientation,
  threatIndicators,
  type ThreatIndicator,
  appraisals,
  type Appraisal,
  politicalProfiles,
  type PoliticalProfile
} from "@/data/mockData";
// ─── Helpers ─────────────────────────────────────────────────────────────────
 
/**
 * Maps a PoliticalTendency to the candidate orientation bucket.
 * maratas  → Pro-Administration | Leaning Administration
 * luz      → Opposition | Leaning Opposition
 * undecided → Neutral
 */
function tendencyToOrientation(t: PoliticalTendency): PoliticalOrientation {
  if (t === "Pro-Administration" || t === "Leaning Administration")
    return "maratas";
  if (t === "Opposition" || t === "Leaning Opposition") return "luz";
  return "undecided";
}
 
type HouseholdColorResult =
  | { mode: "majority"; orientation: PoliticalOrientation }
  | { mode: "lean"; orientation: PoliticalOrientation }
  | { mode: "inconclusive" };
 
/**
 * Derives the household-level color from its members' individual tendencies.
 *
 * Rules:
 *  1. >50% map to same orientation → solid majority color
 *  2. No majority but ≥1 member is "Pro-Administration" or "Opposition"
 *     (the extremes) → lean color of that orientation
 *  3. Otherwise → inconclusive (gray)
 */
function deriveHouseholdColor(
  members: (Person & { politicalTendency: PoliticalTendency })[]
): HouseholdColorResult {
  if (members.length === 0) return { mode: "inconclusive" };
 
  const buckets: Record<PoliticalOrientation, number> = {
    maratas: 0,
    luz: 0,
    undecided: 0,
  };
 
  for (const m of members) {
    buckets[tendencyToOrientation(m.politicalTendency)]++;
  }
 
  const total = members.length;
  for (const key of ["maratas", "luz", "undecided"] as PoliticalOrientation[]) {
    if (buckets[key] / total > 0.5) {
      return { mode: "majority", orientation: key };
    }
  }
 
  // No majority — check for extreme members
  const hasExtremeMaratas = members.some(
    (m) => m.politicalTendency === "Pro-Administration"
  );
  const hasExtremeLuz = members.some(
    (m) => m.politicalTendency === "Opposition"
  );
 
  if (hasExtremeMaratas && !hasExtremeLuz)
    return { mode: "lean", orientation: "maratas" };
  if (hasExtremeLuz && !hasExtremeMaratas)
    return { mode: "lean", orientation: "luz" };
  if (hasExtremeMaratas && hasExtremeLuz) {
    // Both extremes present — still inconclusive
    return { mode: "inconclusive" };
  }
 
  return { mode: "inconclusive" };
}
 
/** Returns Tailwind / CSS classes for each display mode */
function colorClasses(result: HouseholdColorResult): {
  border: string;
  badge: string;
  badgeText: string;
  label: string;
}
 {
  if (result.mode === "inconclusive") {
    return {
      border: "border-l-border",
      badge: "bg-muted",
      badgeText: "text-muted-foreground",
      label: "Inconclusive",
    };
  }
 
  const pol = POLITICAL_CANDIDATES.find(
    (c) => c.key === result.orientation
  )!;
 
  if (result.mode === "majority") {
    return {
      border: pol.borderClass,
      badge: pol.bgClass,
      badgeText: "text-white",
      label: pol.label,
    };
  }
 
  // lean
  return {
    border: pol.borderClass,
    badge: pol.tintClass,
    badgeText: pol.textClass,
    label: `Leans ${pol.label}`,
  };
}

const POL_COLORS: Record<PoliticalOrientation | "inconclusive", string> = {
  maratas: "hsl(var(--pol-maratas))",    // Red - Administration
  luz: "hsl(var(--pol-luz))",            // Green - Opposition
  undecided: "hsl(var(--pol-undecided))", // Orange/Amber
  inconclusive: "hsl(var(--pol-inconclusive))" // Gray
};

interface LeafletMapProps {
  flyToTarget?: { lat: number; lng: number; zoom: number } | null;
  onFlyToDone?: () => void;
  onSaveCoordinates?: (coords: { lat: number; lng: number }) => void;
  activeLayer: "households" | "threats" | "appraisal"; 
  openWorkspace?: (household: Household, tab?: "profile" | "political" | "welfare" | "vulnerability") => void;
  filters?: HouseholdFilters;
  onRequestLayer?: (layer: "households") => void;
  focusRequest?: { householdId: string; nonce: number } | null;
  onFocusHandled?: () => void;
}

const LeafletMap = ({ flyToTarget, onFlyToDone, onSaveCoordinates, activeLayer, openWorkspace, filters, onRequestLayer, focusRequest, onFocusHandled }: LeafletMapProps) => {
  const isTouchDevice = 'ontouchstart' in window;
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const householdLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const threatLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const appraisalLayerRef = useRef<L.LayerGroup>(L.layerGroup());
  const rootsRef = useRef<ReturnType<typeof createRoot>[]>([]);

  const [center, setCenter] = useState({ lat: 12.8797, lng: 121.774 });
  const [zoom, setZoom] = useState(6);
  const [dblClickCoords, setDblClickCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [isActive, setIsActive] = useState(false);

  // Activate on click inside
  const handleActivate = useCallback(() => {
    setIsActive(true);
  }, []);

  // Deactivate on click outside
  useEffect(() => {
    const handleOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsActive(false);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, []);

  // ESC to deactivate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsActive(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Enable/disable map interactions based on active state
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    if (isActive) {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.touchZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    } else {
      map.dragging.disable();
      map.scrollWheelZoom.disable();
      map.touchZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
    }
  }, [isActive]);
  
  const profileByHH = useMemo(() => {
    const m = new Map<string, (typeof politicalProfiles)[number]>();
    politicalProfiles.forEach(p => m.set(p.householdId, p));
    return m;
  }, []);

  const threatsByHH = useMemo(() => {
    const m = new Map<string, typeof threatIndicators>();
    threatIndicators.forEach(t => {
      if (!m.has(t.householdId)) m.set(t.householdId, []);
      m.get(t.householdId)!.push(t);
    });
    return m;
  }, []);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [12.8797, 121.774],
      zoom: 6,
      zoomControl: true,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
    });

    map.doubleClickZoom.disable();
    map.on('dblclick', (e: L.LeafletMouseEvent) => {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      setDblClickCoords(coords);
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 40,
    }).addTo(map);

    L.control.attribution({ position: 'bottomright', prefix: false })
      .addAttribution('© <a href="https://carto.com/">CARTO</a> © <a href="https://osm.org/">OSM</a>')
      .addTo(map);

    householdLayerRef.current.addTo(map);
    threatLayerRef.current.addTo(map);
    appraisalLayerRef.current.addTo(map);
    mapRef.current = map;

    map.on('moveend', () => {
      const c = map.getCenter();
      setCenter({ lat: c.lat, lng: c.lng });
      setZoom(map.getZoom());
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  // Render household layer
  useEffect(() => {
    // Snapshot and clear the ref immediately, but don't unmount synchronously —
    // this effect runs as part of a React commit (triggered by activeLayer/
    // filters changing), and calling root.unmount() here would mean unmounting
    // a *different* React root while React is still committing this one.
    // Deferring to a macrotask lets React finish the current commit first,
    // avoiding "Attempted to synchronously unmount a root while React was
    // already rendering."
    const rootsToUnmount = rootsRef.current;
    rootsRef.current = [];
    if (rootsToUnmount.length > 0) {
      setTimeout(() => {
        rootsToUnmount.forEach((r) => r.unmount());
      }, 0);
    }

    markerRefs.current.clear();
    householdLayerRef.current.clearLayers();
    if (activeLayer !== "households") return;

    const visibleHouseholds = filters
      ? applyHouseholdFilters(households, filters)
      : households;

    visibleHouseholds.forEach((h) => {
      if (!h.lat || !h.lng) return;

      const hhPersons = persons.filter((p) => p.householdId === h.id);
      const colorResult = deriveHouseholdColor(hhPersons);

      let color = POL_COLORS.inconclusive;
      if (colorResult.mode === "majority" || colorResult.mode === "lean") {
        color = POL_COLORS[colorResult.orientation];
      }

      const icon = L.divIcon({
        className: "custom-pin",
        html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="${color}" stroke-width="1">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3" fill="white" stroke="white"/>
        </svg>`,
        iconSize: [24, 24],
        iconAnchor: [12, 24],
        popupAnchor: [0, -24],
      });

      // React popup
      const popupEl = document.createElement("div");
      const root = createRoot(popupEl);
      root.render(
        <HouseholdPopup
          household={h}
          persons={hhPersons}
          color={color}
          colorResult={colorResult}
          openWorkspace={openWorkspace}
          onNavigate={handleNavigate}
        />
      );
      rootsRef.current.push(root);

      // Create marker and store reference
      const marker = L.marker([h.lat, h.lng], { icon })
        .addTo(householdLayerRef.current)
        .bindPopup(popupEl, {
          maxWidth: 380,
          minWidth: 380,
        });

      markerRefs.current.set(h.id, marker);
    });
    // Note: the previous "read householdId straight from window.location.search"
    // block was removed here. PoliticalMapping now consumes and clears that
    // query param itself, then drives the same behavior through the
    // `focusRequest` prop/effect below — which also retries until the marker
    // exists, so it's strictly more reliable than reading the URL directly
    // inside this effect (which raced against filters/layer changes and had
    // no retry if markers weren't ready yet).
  }, [activeLayer, openWorkspace, filters]);

  // Focus + open the popup for the household requested by the parent page,
  // e.g. from HouseholdWorkspace's "go to mapping" action or the household
  // list's "focus pin" button. Retries briefly in case markers haven't
  // finished rendering yet (e.g. right after switching to the households layer).
  useEffect(() => {
    if (!focusRequest) return;
    const { householdId } = focusRequest;

    if (activeLayer !== "households") {
      onRequestLayer?.("households");
      return;
    }

    let cancelled = false;

    const tryOpenPopup = (attemptsLeft: number) => {
      if (cancelled) return;
      const marker = markerRefs.current.get(householdId);
      if (marker && mapRef.current) {
        const latlng = marker.getLatLng();
        const map = mapRef.current;

        map.flyTo(latlng, 20, { duration: 0.8 });

        // Wait for the flyTo animation to actually finish before opening
        // the popup, so autoPan measures against the real final view.
        map.once('moveend', () => {
          if (cancelled) return;
          marker.openPopup();
          onFocusHandled?.();
        });
      } else if (attemptsLeft > 0) {
        setTimeout(() => tryOpenPopup(attemptsLeft - 1), 150);
      } else {
        onFocusHandled?.(); // give up, but still clear it so it doesn't hang around
      }
    };

    const initialDelay = setTimeout(() => tryOpenPopup(10), 200);

    return () => {
      cancelled = true;
      clearTimeout(initialDelay);
    };
  }, [focusRequest, activeLayer, onRequestLayer, onFocusHandled]);

  // Render threat layer
  useEffect(() => {
    threatLayerRef.current.clearLayers();
    if (activeLayer !== "threats") return;
    households.forEach(h => {
      const threats = threatsByHH.get(h.id);
      if (!threats || threats.length === 0) return;
      const sev = threats[0].severity;
      const color = sev === "Critical" ? "#dc2626" : sev === "High" ? "#ea580c" : sev === "Medium" ? "#f59e0b" : "#facc15";
      const icon = L.divIcon({
        className: "threat-pin",
        html: `<div style="width:22px;height:22px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold">!</div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      const list = threats.map(t => `<li>${t.type} — ${t.severity}</li>`).join("");
      L.marker([h.lat, h.lng], { icon })
        .addTo(threatLayerRef.current)
        .bindPopup(`<b>Threats — ${h.id}</b><br/>${h.headOfFamily}<ul style="margin:4px 0 0 14px;padding:0">${list}</ul>`);
    });
  }, [activeLayer, threatsByHH]);

  // Render appraisal layer
  useEffect(() => {
    appraisalLayerRef.current.clearLayers();
    if (activeLayer !== "appraisal") return;
    const latest = appraisals.find(a => a.status !== "Scheduled") ?? appraisals[0];
    households.forEach(h => {
      const profile = profileByHH.get(h.id);
      const icon = L.divIcon({
        className: "appraisal-pin",
        html: `<div style="width:18px;height:18px;border-radius:4px;background:hsl(217,91%,60%);border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      L.marker([h.lat, h.lng], { icon })
        .addTo(appraisalLayerRef.current)
        .bindPopup(`<b>Appraisal — ${h.id}</b><br/>Period: ${latest.period}<br/>Status: ${latest.status}<br/>Support: ${latest.supportPct}% • Opposed: ${latest.opposedPct}%<br/>Orientation: ${profile?.orientation ?? "—"}`);
    });
  }, [activeLayer, profileByHH]);

  useEffect(() => {
    if (flyToTarget && mapRef.current && onFlyToDone) {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      mapRef.current.flyTo([flyToTarget.lat, flyToTarget.lng], flyToTarget.zoom, { duration: 1 });
      onFlyToDone();
    }
  }, [flyToTarget, onFlyToDone]);

  // Final cleanup on unmount — the main layer effect only unmounts *previous*
  // roots when it re-runs, so the very last batch of roots needs its own
  // teardown here. Deferred for the same synchronous-unmount reason as above.
  useEffect(() => {
    return () => {
      const roots = rootsRef.current;
      rootsRef.current = [];
      if (roots.length > 0) {
        setTimeout(() => {
          roots.forEach((r) => r.unmount());
        }, 0);
      }
      markerRefs.current.clear();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className="w-full h-[430px] lg:h-[calc(100vh-140px)] rounded-lg overflow-hidden z-10"
        style={{ 
          border: isActive ? '2px solid hsl(217, 91%, 60%)' : '1px solid hsl(240, 5.9%, 90%)',
          boxShadow: isActive ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
          transition: 'border 0.2s, box-shadow 0.2s'
        }}
        onPointerDown={handleActivate}
        tabIndex={0}  
      >
        {/* Instruction overlay - subtle, no blur */}
        {!isActive && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full shadow-lg pointer-events-none z-[1000]">
            {isTouchDevice ? "Tap map to activate" : "Click map to activate"}
          </div>
        )}
        
        {/* Active indicator */}
        {isActive && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded shadow-md pointer-events-none z-[1000]">
            Active • Click outside or ESC to exit
          </div>
        )}

        <CoordinateDisplay
          lat={center.lat}
          lng={center.lng}
          zoom={zoom}
          dblClickCoords={dblClickCoords}
          onClearDblClick={() => setDblClickCoords(null)}
          onSaveCoords={onSaveCoordinates}
          onSaveComplete={() => {}}
        />
      </div>
    </div>
  );
};

export default LeafletMap;