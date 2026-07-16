"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, Filter, ChevronDown, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { households } from "@/data/mockData"; // adjust to your actual import path

// ── Types ──────────────────────────────────────────────────────────────────
export interface HouseholdFilters {
  search: string;
  barangay: string | null;
  cluster: string | null;
}

interface Props {
  onChange: (filters: HouseholdFilters) => void;
  csvInputRef?: React.RefObject<HTMLInputElement>;
  onCsvImport?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// ── Build barangay → clusters map dynamically from real data ───────────────
function buildBarangayClusterMap(
  data: typeof households
): Record<string, string[]> {
  const map: Record<string, Set<string>> = {};
  for (const hh of data) {
    if (!map[hh.barangay]) map[hh.barangay] = new Set();
    map[hh.barangay].add(hh.cluster);
  }
  return Object.fromEntries(
    Object.entries(map).map(([b, clusters]) => [b, [...clusters].sort()])
  );
}

// ── Reusable searchable dropdown ───────────────────────────────────────────
interface DropdownProps {
  label: string;
  value: string | null;
  options: string[];
  hint?: string;
  onSelect: (v: string | null) => void;
}

function FilterDropdown({ label, value, options, hint, onSelect }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () => options.filter((o) => o.toLowerCase().includes(query.toLowerCase())),
    [options, query]
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = (opt: string) => {
    onSelect(value === opt ? null : opt); // toggle off if same
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex items-center gap-1.5 h-9 px-3 rounded-md border text-sm transition-colors whitespace-nowrap",
          "bg-background hover:bg-muted",
          value
            ? "border-primary/50 bg-muted"
            : "border-input text-muted-foreground hover:text-foreground",
          open ? "ring-2 ring-ring/25" : "",
        ].join(" ")}
      >
        <Filter className="h-3.5 w-3.5 shrink-0" />

        {value ? (
          <span className="flex items-center gap-1">
            <span
              className="max-w-[120px] truncate font-medium text-foreground"
              title={value}
            >
              {value}
            </span>
            <X
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground hover:text-foreground"
              onClick={handleClear}
            />
          </span>
        ) : (
          label
        )}

        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute top-[calc(100%+4px)] right-0 z-[2000] w-45 rounded-lg border bg-popover shadow-lg">
          {/* Search input */}
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${label.toLowerCase()}…`}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <X
                className="h-3.5 w-3.5 shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => setQuery("")}
              />
            )}
          </div>

          {/* Options list */}
          <div className="max-h-[120px] overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-center text-sm text-muted-foreground">
                No results
              </p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                >
                  <span className="flex-1 text-left">{opt}</span>
                  {value === opt && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Cascade hint */}
          {hint && (
            <p className="border-t bg-muted/40 px-3 py-1.5 text-[11px] text-muted-foreground">
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main filter bar ────────────────────────────────────────────────────────
export function HouseholdFilterBar({ onChange }: Props) {
  const [search, setSearch] = useState("");
  const [barangay, setBarangay] = useState<string | null>(null);
  const [cluster, setCluster] = useState<string | null>(null);

  // Derived from real data — stable reference
  const barangayClusterMap = useMemo(
    () => buildBarangayClusterMap(households),
    []
  );
  const allBarangays = useMemo(
    () => Object.keys(barangayClusterMap).sort(),
    [barangayClusterMap]
  );
  // When a barangay is selected, only show that barangay's clusters.
  // Otherwise show all unique clusters so you can filter by cluster alone.
  const clusterOptions = useMemo(() => {
    if (barangay) return barangayClusterMap[barangay] ?? [];
    return [...new Set(Object.values(barangayClusterMap).flat())].sort();
  }, [barangay, barangayClusterMap]);

  const emit = (s: string, b: string | null, c: string | null) =>
    onChange({ search: s, barangay: b, cluster: c });

  const handleSearch = (v: string) => {
    setSearch(v);
    emit(v, barangay, cluster);
  };

  const handleBarangay = (v: string | null) => {
    // If the selected cluster no longer exists in the new barangay, clear it
    const nextCluster =
      v && cluster && !(barangayClusterMap[v] ?? []).includes(cluster)
        ? null
        : cluster;
    setBarangay(v);
    setCluster(nextCluster);
    emit(search, v, nextCluster);
  };

  const handleCluster = (v: string | null) => {
    setCluster(v);
    emit(search, barangay, v);
  };

  const clearAll = () => {
    setSearch("");
    setBarangay(null);
    setCluster(null);
    onChange({ search: "", barangay: null, cluster: null });
  };

  const hasFilters = !!(search || barangay || cluster);

  return (
    <div className="flex flex-col gap-2">
      {/* Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Text search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search households…"
            className="pl-9 pt-4.5 pb-4.5"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Forwarded CSV input */}
        {/* {csvInputRef && (
          <input
            ref={csvInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={onCsvImport}
          />
        )} */}

        {/* Barangay */}
        <FilterDropdown
          label="Barangay"
          value={barangay}
          options={allBarangays}
          onSelect={handleBarangay}
        />

        {/* Cluster — cascades from barangay */}
        <FilterDropdown
          label="Cluster"
          value={cluster}
          options={clusterOptions}
          hint={barangay ? `Showing clusters in ${barangay}` : undefined}
          onSelect={handleCluster}
        />

        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active filter tags */}
      {(barangay || cluster) && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Filtered by:</span>
          {barangay && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-0.5 text-xs font-medium">
              {barangay}
              <X
                className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => handleBarangay(null)}
              />
            </span>
          )}
          {cluster && (
            <span className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-0.5 text-xs font-medium">
              {cluster}
              <X
                className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={() => handleCluster(null)}
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── applyHouseholdFilters — use this to filter your table data ─────────────
/**
 * Call this with your full households array + the filters object
 * emitted by onChange to get the filtered subset.
 *
 * Search matches: headOfFamily, barangay, cluster, precinct, id, occupation
 * Location filters are applied first (exact match), then the text search
 * runs only within that narrowed pool — exactly the UX you described.
 */
export function applyHouseholdFilters(
  data: typeof households,
  filters: HouseholdFilters
): typeof households {
  const q = filters.search.toLowerCase().trim();

  return data.filter((hh) => {
    if (filters.barangay && hh.barangay !== filters.barangay) return false;
    if (filters.cluster && hh.cluster !== filters.cluster) return false;
    if (q) {
      return (
        hh.headOfFamily.toLowerCase().includes(q) ||
        hh.barangay.toLowerCase().includes(q) ||
        hh.cluster.toLowerCase().includes(q) ||
        hh.precinct.toLowerCase().includes(q) ||
        hh.id.toLowerCase().includes(q)
      );
    }
    return true;
  });
}