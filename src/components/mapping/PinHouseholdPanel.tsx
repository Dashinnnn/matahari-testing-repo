// import { type PinData, type PinGroup, createPin, createGroup, GROUP_COLORS } from "@/data/pinTypes";
import { useState, useMemo, useEffect } from "react";
import {
  House,
  MapPin,
  ChevronDown, ChevronLeft, ChevronRight as ChevronRightIcon,
} from "lucide-react";
import { 
  households,
  POLITICAL_CANDIDATES,
  type Person, 
  persons,
  type PoliticalTendency,
  type PoliticalOrientation
} from "@/data/mockData";
import { CardHeader, CardTitle } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HouseholdFilterBar, applyHouseholdFilters, type HouseholdFilters } from "../data-repository/HouseholdFilterBar";

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
} {
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
 
// ─── Tendency badge ───────────────────────────────────────────────────────────
 
const TENDENCY_STYLES: Record<
  PoliticalTendency,
  { bg: string; text: string; label: string }
> = {
  "Pro-Administration": {
    bg: "pol-bg-maratas",
    text: "text-white",
    label: "Pro-Admin",
  },
  "Leaning Administration": {
    bg: "pol-tint-maratas",
    text: "pol-text-maratas",
    label: "Leaning Admin",
  },
  Neutral: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    label: "Neutral",
  },
  "Leaning Opposition": {
    bg: "pol-tint-luz",
    text: "pol-text-luz",
    label: "Leaning Opp.",
  },
  Opposition: {
    bg: "pol-bg-luz",
    text: "text-white",
    label: "Opposition",
  },
};
 
function TendencyBadge({ tendency }: { tendency: PoliticalTendency }) {
  const s = TENDENCY_STYLES[tendency];
  return (
    <span
      className={`inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] w-23 font-medium ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  );
}
 
// ─── Mock data augmentation ───────────────────────────────────────────────────
// In production, politicalTendency would come from the DB.
// Here we seed it deterministically from person ID so it's stable.
 
// const TENDENCY_CYCLE: PoliticalTendency[] = [
//   "Pro-Administration",
//   "Leaning Administration",
//   "Neutral",
//   "Leaning Opposition",
//   "Opposition",
// ];
 
// function seedTendency(personId: string): PoliticalTendency {
//   const n = parseInt(personId.replace(/\D/g, ""), 10) || 0;
//   return TENDENCY_CYCLE[n % TENDENCY_CYCLE.length];
// }
 



// ─── Panel ────────────────────────────────────────────────────────────────────
 
interface PinHouseholdPanelProps {
  onFocusPin: (lat: number, lng: number, householdId: string) => void;
  onSwitchToHouseholds?: () => void;
  onFiltersChange?: (filters: HouseholdFilters) => void;
}
 
export const PinHouseholdPanel = ({ onFocusPin, onSwitchToHouseholds, onFiltersChange }: PinHouseholdPanelProps) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<HouseholdFilters>({
      search: "", barangay: null, cluster: null
    });

  const handleFiltersChange = (f: HouseholdFilters) => {
    setFilters(f);
    onFiltersChange?.(f);
  };
 
  const toggleRow = (id: string) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
 
  // Augment persons with politicalTendency
  // const augmentedPersons = useMemo(
  //   () =>
  //     persons.map((p) => ({
  //       ...p,
  //       politicalTendency: seedTendency(p.id),
  //     })),
  //   []
  // );
 
  const filtered = useMemo(
    () => applyHouseholdFilters(households, filters),
    [filters, households]
  );

  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);
  
  // Reset to page 1 whenever the search query changes
  useEffect(() => setPage(1), [filters]);
  
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );
 
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <CardHeader className="flex items-center justify-between px-4 py-1 border-b border-border shrink-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <House className="h-4 w-4 text-primary" /> Households
        </CardTitle>
        <span className="text-[10px] font-mono text-muted-foreground">
          {filtered.length} / {households.length}
        </span>
      </CardHeader>
 
      {/* Search */}
      <div className="px-3 py-2 border-b border-border shrink-0">
        <div className="relative">
          {/* <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" /> */}
          <HouseholdFilterBar
            onChange={handleFiltersChange}
          />
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border shrink-0 flex-wrap">
        {POLITICAL_CANDIDATES.map((pol) => (
          <div key={pol.key} className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full inline-block ${pol.bgClass}`}
            />
            <span className="text-[10px] text-muted-foreground">
              {pol.label}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block bg-muted border border-border" />
          <span className="text-[10px] text-muted-foreground">Inconclusive</span>
        </div>
      </div>
 
      {/* List */}
      {/* <CardContent className="p-0 max-h-[280px] overflow-y-auto">
        <Table>
          
        </Table>
      </CardContent> */}
      <div className="flex flex-col flex-1 min-h-0">
 
        {/* Scrollable list */}
        <div className="flex-1 max-h-[200px] overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-10">
              No households found
            </p>
          )}
      
          {paginated.map((hh) => {
            const hhPersons = persons.filter((p) => p.householdId === hh.id);
            const head = hhPersons.find((p) => p.relation === "Head");
            const nonHeadMembers = hhPersons.filter((p) => p.relation !== "Head");
            const isExpanded = expandedRows.has(hh.id);
            const colorResult = deriveHouseholdColor(hhPersons);
            const  cc = colorClasses(colorResult);
      
            return (
              <div key={hh.id}>
                <div
                  className={`flex items-center gap-2 px-3 py-2 border-b border-l-4 border-border hover:bg-secondary/40 transition-colors cursor-pointer ${cc.border}`}
                  onClick={() => toggleRow(hh.id)}
                >
                  <button className="shrink-0 text-muted-foreground">
                    {nonHeadMembers.length > 0 ? (
                      isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRightIcon className="w-3 h-3" />
                      )
                    ) : (
                      <span className="w-3 h-3 block" />
                    )}
                  </button>
      
                  <span className="font-mono text-[10px] text-muted-foreground w-14 shrink-0">
                    {hh.id}
                  </span>
      
                  <span className="flex-1 text-xs font-medium text-foreground truncate">
                    {hh.headOfFamily}
                  </span>
      
                  {/* <span className="text-[10px]  w-14 font-mono text-muted-foreground shrink-0 hidden sm:block">
                    {hh.precinct}
                  </span> */}
      
                  <span className={`text-[10px] text-center w-20 px-1.5 py-0.5 rounded font-medium shrink-0 ${cc.badge} ${cc.badgeText}`}>
                    {cc.label}
                  </span>
      
                  {hh.lat && hh.lng && (
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onFocusPin(hh.lat, hh.lng, hh.id);
                        onSwitchToHouseholds?.();
                      }}
                      className="shrink-0 p-0.5 text-primary hover:text-primary/70 transition-colors"
                      title="Fly to household"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                  )}
                </div>
      
                {isExpanded && nonHeadMembers.length > 0 && (
                  <div className="bg-muted/20 border-b border-border">
                    {head && <MemberRow member={head} isHead />}
                    {nonHeadMembers.map((m) => (
                      <MemberRow key={m.id} member={m} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      
        {/* Prev / Next bar — only shown when there is more than one page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-3 py-2 border-t border-border shrink-0 bg-background">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3 h-3" />
              Prev
            </button>
      
            <span className="text-[10px] font-mono text-muted-foreground">
              {page} / {totalPages}
            </span>
      
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRightIcon className="w-3 h-3" />
            </button>
          </div>
        )}
      
      </div>
    </div>
  );
};
 
// ─── Member sub-row ───────────────────────────────────────────────────────────
 
function MemberRow({
  member,
  isHead = false,
}: {
  member: Person & { politicalTendency: PoliticalTendency };
  isHead?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 pl-8 pr-3 py-1.5 border-b border-border/40 last:border-b-0">
      <span className="font-mono text-[10px] text-muted-foreground/60 w-12 shrink-0">
        {member.id}
      </span>
      <span className="flex-1 text-[11px] text-foreground truncate">
        {member.name}
        {isHead && (
          <span className="ml-1 text-[9px] font-medium text-muted-foreground uppercase tracking-wide">
            Head
          </span>
        )}
      </span>
      <span className="text-[10px] w-14 text-muted-foreground shrink-0 hidden sm:block">
        {member.relation}
      </span>
      <span className="text-[10px] w-14 text-muted-foreground shrink-0 hidden sm:block">
        {member.precinct}
      </span>
      <TendencyBadge tendency={member.politicalTendency} />
    </div>
  );
}