import { 
  households, 
  POLITICAL_CANDIDATES,
  type Household,
  type Person, 
  type PoliticalOrientation,
  getPersonVulnerabilityAssessment,
} from "@/data/mockData";
import { Database, ArrowRight } from "lucide-react";
import { type HouseholdWorkspaceTab } from "@/components/data-repository/HouseholdWorkspaceHeader";

type HouseholdColorResult =
    | { mode: "majority"; orientation: PoliticalOrientation }
    | { mode: "lean"; orientation: PoliticalOrientation }
    | { mode: "inconclusive" };

interface HouseholdPopupProps {
  household: (typeof households)[number];
  persons: Person[];
  color: string;
  colorResult: HouseholdColorResult;
  openWorkspace?: (household: Household, tab?: HouseholdWorkspaceTab) => void;
  onNavigate?: (path: string, options?: { householdId?: string }) => void;
}

const EMPLOYMENT_LABELS = ["Regular", "Seasonal", "Irregular", "Unemployed"];
const HOUSING_LABELS    = ["Permanent", "Semi-permanent", "Temporary", "Makeshift"];
const INCOME_LABELS     = ["Sufficient", "Low", "Very low", "Insufficient"];
const UTILITY_LABELS    = ["Complete", "Missing 1", "Missing 2", "Missing 3"];

const TONE_MAP: Record<string, string> = {
  rose: "bg-rose-50 text-rose-700 border-rose-100",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  amber: "bg-amber-50 text-amber-800 border-amber-100",
};

export function HouseholdPopup({ 
  household, 
  persons, 
  color, 
  colorResult, 
  openWorkspace,
  onNavigate
}: HouseholdPopupProps) {
  const goToDataRepository = () => {
    if (onNavigate) {
      onNavigate(`/data?householdId=${household.id}`);
    }
  };

  const head = persons.find(
    (p) => p.householdId === household.id && p.relation === "Head"
  );

  // Vulnerability scores are per-person now — pull the head's, with the
  // helper falling back to household-derived defaults if no curated record.
  const assess = head ? getPersonVulnerabilityAssessment(head.id) : null;
  const scores = assess?.indicatorScores;

  const tiles = [
    { key: "emp",  value: scores?.employment ?? 0, tone: "rose",    label: EMPLOYMENT_LABELS[scores?.employment ?? 0], title: "Employment" },
    { key: "hs",   value: scores?.housing ?? 0,     tone: "emerald", label: HOUSING_LABELS[scores?.housing ?? 0],       title: "Housing" },
    { key: "inc",  value: scores?.income ?? 0,      tone: "rose",    label: INCOME_LABELS[scores?.income ?? 0],         title: "Income" },
    { key: "util", value: scores?.utilities ?? 0,   tone: "amber",   label: UTILITY_LABELS[scores?.utilities ?? 0],     title: "Utilities" },
  ];

  function colorClasses(result: HouseholdColorResult): { label: string } {
    if (result.mode === "inconclusive") return { label: "Inconclusive" };
    const pol = POLITICAL_CANDIDATES.find((c) => c.key === result.orientation)!;
    return { label: result.mode === "majority" ? pol.label : `Leans ${pol.label}` };
  }

  return (
    <div className="w-[380px] font-sans text-xs">
      {/* Identity */}
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="relative shrink-0">
          <div className="rounded-full p-[2px] bg-none from-primary to-primary/40">
            <img
              src={head?.profileImage}
              alt={head?.name ?? household.headOfFamily}
              className="h-12 w-12 rounded-full border-2 object-cover p-1"
              style={{ borderColor: color }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-[13px] m-0 font-semibold leading-tight truncate text-foreground">
            {head ? `${head.firstName} ${head.lastName}` : household.headOfFamily}
          </h1>
          <h2 className="text-[10px] m-0 text-muted-foreground">{household.id}</h2>
        </div>
        <span
          className="shrink-0 text-[9px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full text-white"
          style={{ background: color }}
        >
          {colorClasses(colorResult).label}
        </span>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-1 mb-2.5">
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-medium">
          {head?.relation ?? "—"}
        </span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-medium">
          💍 {head?.civilStatus ?? "—"}
        </span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-medium">
          {head?.sex === "Female" ? "♀" : "♂"} {head?.sex ?? "—"}
        </span>
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-muted text-[10px] font-medium">
          🕒 {head?.age ?? "—"}
        </span>
      </div>

      <div className="flex gap-2">
        {/* Meta strip */}
        <div className="grid grid-cols-2 gap-x-0 gap-y-2.5 bg-muted/40 rounded-lg px-2.5 py-2 mb-2.5 border border-border w-full">
          <div className="min-w-0">
            <h2 className="text-[9px] text-muted-foreground leading-none">Barangay</h2>
            <h1 className="text-[11px] font-semibold mt-0.5 truncate">{household.barangay}</h1>
          </div>
          <div className="min-w-0">
            <h2 className="text-[9px] text-muted-foreground leading-none">Cluster</h2>
            <h1 className="text-[11px] font-semibold mt-0.5 truncate">{household.cluster}</h1>
          </div>
          <div className="min-w-0">
            <h2 className="text-[9px] text-muted-foreground leading-none">Precinct</h2>
            <h1 className="text-[11px] font-semibold mt-0.5 truncate">{household.precinct}</h1>
          </div>
          <div className="min-w-0">
            <h2 className="text-[9px] text-muted-foreground leading-none">Members</h2>
            <h1 className="text-[11px] font-semibold mt-0.5">{household.members}</h1>
          </div>
          <div className="min-w-0 col-span-2">
            <h2 className="text-[9px] text-muted-foreground leading-none">Address</h2>
            <h1 className="text-[11px] font-semibold mt-0.5">{household.address}</h1>
          </div>
        </div>

        {/* Stat tiles 2x2 */}
        <div className="grid grid-cols-2 gap-1.5 mb-3 w-full">
          {tiles.map(t => (
            <div key={t.key} className={`rounded-lg border p-1.5 relative ${TONE_MAP[t.tone]}`}>
              <h1 className="text-base font-bold leading-none">{t.value}</h1>
              <h2 className="absolute top-1.5 right-1.5 text-[8px] font-medium opacity-80">{t.label}</h2>
              <h2 className="text-[9px] font-medium mt-1 leading-tight">{t.title}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Footer actions — same triggers/handlers as before, restyled */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        {/* <div className="h-7 w-7 rounded-full border border-border bg-white flex items-center justify-center shrink-0">
          <Pencil className="h-3.5 w-3.5 text-primary" />
        </div> */}
        <div className="flex items-center gap-1.5">
          <span
            role="button"
            tabIndex={0}
            onClick={goToDataRepository}
            onKeyDown={(e) => e.key === "Enter" && goToDataRepository()}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 px-2.5 py-1.5 text-[10px] font-medium cursor-pointer transition"
          >
            <Database className="h-3 w-3" /> Data Repository
          </span>
          <span
            role="button"
            tabIndex={0}
            onClick={() => openWorkspace?.(household)}
            onKeyDown={(e) => e.key === "Enter" && openWorkspace?.(household)}
            className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-2.5 py-1.5 text-[10px] font-medium cursor-pointer transition"
          >
            View Profile <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}