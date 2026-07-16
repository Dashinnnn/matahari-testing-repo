import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

import {
  ArrowDown, ArrowRight, Eye, MapPin, Users,
  Heart, Shield, Info,
} from "lucide-react";

import { PersonWorkspaceHeader, type HouseholdWorkspaceTab } from "@/pages/components/HouseholdWorkspaceHeader";

import {

  programCategories,
  persons,
  computePoliticalSummary,
  classifyVulnerability,
  getHouseholdHead,
  getPersonWelfare,
  getPersonPoliticalProfile,
  getPersonVulnerabilityAssessment,
  type Household,
  type Person,
  type DependencyLevel,
  type VulnerabilityClassification,
} from "@/data/mockData";

// ── helpers (unchanged) ──────────────────────────────────────────────────────

const computeDependencyLevel = (activeCount: number): { level: DependencyLevel; color: string; emoji: string } => {
  if (activeCount <= 2) return { level: "Low",      color: "bg-success/15 text-success border-success/30",             emoji: "🟢" };
  if (activeCount <= 4) return { level: "Moderate", color: "bg-warning/15 text-warning border-warning/30",             emoji: "🟡" };
  return                       { level: "High",     color: "bg-destructive/15 text-destructive border-destructive/30", emoji: "🔴" };
};

const getVulnerabilityColor = (level: VulnerabilityClassification) => {
  switch (level) {
    case "High":     return "bg-destructive/15 text-destructive border-destructive/30";
    case "Moderate": return "bg-warning/15 text-warning border-warning/30";
    case "Low":      return "bg-success/15 text-success border-success/30";
  }
};

const getDependencyColor = (level: DependencyLevel) => {
  switch (level) {
    case "High":     return "bg-destructive/15 text-destructive border-destructive/30";
    case "Moderate": return "bg-warning/15 text-warning border-warning/30";
    case "Low":      return "bg-success/15 text-success border-success/30";
  }
};

// ── navigation stack ─────────────────────────────────────────────────────────

interface WorkspaceEntry {
  personId: string;
  tab: HouseholdWorkspaceTab;
}

// ── props ─────────────────────────────────────────────────────────────────────

interface HouseholdWorkspaceProps {
  open: boolean;
  household: Household | null;
  initialPerson?: Person | null; // defaults to the household head
  initialTab?: HouseholdWorkspaceTab;
  onClose: () => void;
}

// ── component ─────────────────────────────────────────────────────────────────

export function HouseholdWorkspace({
  open,
  household,
  initialPerson = null,
  initialTab = "profile",
  onClose,
}: HouseholdWorkspaceProps) {
  const navigate = useNavigate();

  const [history, setHistory] = useState<WorkspaceEntry[]>([]);
  const [current, setCurrent] = useState<WorkspaceEntry | null>(null);


  const [polEditing, setPolEditing] = useState(false);
  const [profileExpanded, setProfileExpanded] = useState(false);
  const [polHistoryOpen, setPolHistoryOpen] = useState(false);

  // Reset the whole navigation stack whenever the workspace opens or the
  // household changes — history never survives a close, per spec.
  useEffect(() => {
    if (open && household) {
      const startPerson = initialPerson ?? getHouseholdHead(household.id) ?? null;
      setHistory([]);
      setCurrent(startPerson ? { personId: startPerson.id, tab: initialTab } : null);
      setProfileExpanded(false);
    }
    if (!open) {
      setHistory([]);
      setCurrent(null);
    }
  }, [open, household?.id, initialPerson?.id, initialTab]);

  useEffect(() => {
    setPolEditing(false);

  }, [current?.tab, current?.personId]);

  const person = useMemo(
    () => (current ? persons.find(p => p.id === current.personId) ?? null : null),
    [current?.personId]
  );
  const isHead = !!person && !!household && person.householdId === household.id && person.relation === "Head";
  const activeTab = current?.tab ?? "profile";

  // ── navigation ──────────────────────────────────────────────────────────────
  const dialogContentRef = useRef<HTMLDivElement>(null);


  const navigateWorkspace = (tab: HouseholdWorkspaceTab) => {
    if (!current) return;
    setHistory(h => [...h, current]);
    setCurrent({ personId: current.personId, tab });

    // Smooth scroll to top
    setTimeout(() => {
      if (dialogContentRef.current) {
        dialogContentRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 50);
  };

  const navigateToPerson = (targetPerson: Person, tab: HouseholdWorkspaceTab = "profile") => {
    if (current) setHistory(h => [...h, current]);
    setCurrent({ personId: targetPerson.id, tab });



    // Scroll the dialog content to the top with smooth behavior
    setTimeout(() => {
      if (dialogContentRef.current) {
        // Smooth scroll to top
        dialogContentRef.current.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        
        // Also scroll the window to bring the dialog into view
        dialogContentRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
      

    }, 100);
  };

  const goBack = () => {
    setHistory(h => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setCurrent(prev);
      return h.slice(0, -1);
    });
  };

  // ── helpers ─────────────────────────────────────────────────────────────────
  const getHouseholdMembers = (id: string) => persons.filter(p => p.householdId === id);
  const goToMapping = (household: Household) => {
    navigate(`/mapping?lat=${household.lat}&lng=${household.lng}&householdId=${household.id}`);
  };

  const welfare    = person ? getPersonWelfare(person.id) : null;
  const polProfile = person ? getPersonPoliticalProfile(person.id) : null;

  // ── PAL / core labels (unchanged) ────────────────────────────────────────────
  const coreLabels: Record<string, Record<string, string>> = {
    affiliation:       { "0": "None (0)", "1": "Member / Former Member (1)", "2a": "Officer / Coordinator (2)", "2b": "Former Officer / Former Senior (2)", "3": "Senior Officer / Federation Role (3)" },
    leadership:        { "0": "None (0)", "1": "Informal / Limited Role (1)", "2": "Recognized Local Leader (2)", "3": "Key Community Leader (3)" },
    mobilization:      { "0": "None (0)", "1": "1-5 Persons (1)", "2": "6-15 Persons (2)", "3": "16+ Persons (3)" },
    opinionLeadership: { "0": "None (0)", "1": "Occasionally Regarded (1)", "2": "Frequently Regarded (2)", "3": "Constantly Regarded (3)" },
    infoDissemination: { "0": "None (0)", "1": "Occasional Relay (1)", "2": "Regular Relay (2)", "3": "Key Information Conduit (3)" },
  };
  const scopeLabels: Record<string, string> = {
    "1": "Cluster Only (1)", "2": "Across Multiple Clusters within Barangay (2)", "3": "Across Multiple Barangays / Municipal (3)",
  };
  const infoScopeLabels: Record<string, string> = {
    "1": "Within Household Only (1)", "2": "Extended Family within Barangay (2)", "3": "Extended Family Across Multiple Barangays (3)",
  };
  const palLabels: Record<string, string> = {
    "0": "None (0)", "1": "Informal Local Political Role (1)", "2": "Barangay Councilor (2)",
    "3": "Barangay Captain (3)", "4": "City / Municipal Councilor (4)",
    "5": "City / Municipal Vice Mayor (5)", "6": "City / Municipal Mayor (6)",
  };
  const scoreCategories = [
    { key: "affiliation"       as const, title: "Core Score #1 — Affiliation",            question: "What position does the subject hold?",         scopeQuestion: "Geographic reach of the organization?" },
    { key: "leadership"        as const, title: "Core Score #2 — Leadership",              question: "What is the level of community leadership?",   scopeQuestion: "Area covered" },
    { key: "mobilization"      as const, title: "Core Score #3 — Mobilization",            question: "What is the mobilization capacity?",           scopeQuestion: "Mobilized people come from?" },
    { key: "opinionLeadership" as const, title: "Core Score #4 — Opinion Leadership",      question: "Opinion Leadership level",                     scopeQuestion: "Area covered" },
    { key: "infoDissemination" as const, title: "Core Score #5 — Information Dissemination", question: "Role in Information Dissemination",          scopeQuestion: "Area covered" },
  ];

  const canGoBack = history.length > 0;

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        ref={dialogContentRef}
        className="min-w-3xl max-w-4xl max-h-[90vh] overflow-y-auto transition-all"
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* ── PROFILE PANEL ───────────────────────────────────────────────────── */}
        {activeTab === "profile" && household && person && (
          <>
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>{isHead ? "Household Profile" : "Member Profile"} — {household.id}</DialogTitle>
                  <DialogDescription>{person.name}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5">
              <PersonWorkspaceHeader
                person={person}
                household={household}
                isHead={isHead}
                activeTab="profile"
                onNavigate={navigateWorkspace}
                onEditAvatar={() => {}}
                canGoBack={canGoBack}
                onBack={goBack}
              />

              <div className="flex gap-2">
                <Button
                  variant="outline" size="sm" className="flex items-center gap-2"
                  onClick={() => {
                    setTimeout(() => {
                      document.getElementById("genealogy-section")
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 100);
                  }}
                >
                  <Users className="h-4 w-4 text-primary" /> Genealogy <ArrowDown className="h-3 w-3" />
                </Button>
              </div>

              {/* Info grid — person fields + household fields */}
              <div className="grid grid-cols-2 gap-4">
                {([
                  ["Age",         person.age],
                  ["Sex",         person.sex],
                  ["Civil Status",person.civilStatus],
                  ["Education",   person.education],
                  ["Occupation",  person.occupation],
                  ["Religion",    person.religion],
                  ["Household Income", `₱${household.income.toLocaleString()}`],
                  ["Household Members", household.members],
                  ["Housing",     household.housingType],
                  ["Water",       household.waterSource],
                  ["Electricity", household.electricity ? "Yes" : "No"],
                  ["Internet",    household.internet ? "Yes" : "No"],
                ] as [string, string | number][]).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>

              {/* Expandable welfare / vulnerability summary */}
              <div className="rounded-lg bg-accent">
                <button
                  className="flex items-center gap-2 p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors w-full text-left"
                  onClick={() => setProfileExpanded(!profileExpanded)}
                >
                  <ArrowDown className="h-3 w-3 text-primary" />
                  <span className="text-sm text-muted-foreground">Expand</span>
                </button>

                {profileExpanded && (() => {
                  const natProgs = welfare?.programs.filter(p => programCategories[p.name] === "National") || [];
                  const locProgs = welfare?.programs.filter(p => programCategories[p.name] === "Local") || [];
                  const natActive = natProgs.filter(p => p.status === "Active").length;
                  const locActive = locProgs.filter(p => p.status === "Active").length;
                  const natDep = computeDependencyLevel(natActive);
                  const locDep = computeDependencyLevel(locActive);
                  const assessment = getPersonVulnerabilityAssessment(person.id);
                  return (
                    <div className="space-y-5 p-5">
                      <div className="p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" /> Welfare Dependency Level
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">National Gov't Programs</span>
                            <Badge variant="outline" className={natDep.color}>
                              {natDep.emoji} {natDep.level} ({natActive} active)
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Local Gov't Programs</span>
                            <Badge variant="outline" className={locDep.color}>
                              {locDep.emoji} {locDep.level} ({locActive} active)
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => navigateWorkspace("welfare")}>
                            <Heart className="h-4 w-4 mr-2" /> View Full Social Welfare Details
                            <ArrowRight className="h-3 w-3 ml-auto" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-semibold mb-3">Vulnerability Classification</h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-muted-foreground">Classification</span>
                          <Badge variant="outline" className={getDependencyColor(assessment?.vulnerabilityClassification || "Low")}>
                            {assessment?.vulnerabilityClassification || "N/A"}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigateWorkspace("vulnerability")}>
                          View Full Details
                        </Button>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Location */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Location</p>
                <button
                  className="flex items-center gap-2 p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors w-full text-left"
                  onClick={() => goToMapping(household)}
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-mono tabular-nums">
                    {household.lat.toFixed(4)}, {household.lng.toFixed(4)}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {household.barangay} • {household.precinct}
                  </span>
                  <ArrowRight className="h-3 w-3 ml-auto text-primary" />
                </button>
              </div>

              {/* Genealogy — every member, including the head, opens the full workspace */}
              <div id="genealogy-section">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Users className="h-3 w-3" /> Household Members ({getHouseholdMembers(household.id).length})
                </p>
                <div className="space-y-2">
                  {getHouseholdMembers(household.id).map(member => (
                    <button
                      key={member.id}
                      className={`flex items-center gap-3 p-2 rounded-lg border transition-colors w-full text-left ${
                        member.id === person.id ? "border-primary/40 bg-accent/50" : "border-border hover:bg-accent"
                      }`}
                      onClick={() => navigateToPerson(member, "profile")}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.profileImage} />
                        <AvatarFallback className="text-[10px]">{member.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{member.firstName} {member.lastName}</p>
                        <p className="text-xs text-muted-foreground">{member.relation} • {member.age} yrs • {member.sex}</p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground hidden sm:block">
                        <p>{member.occupation}</p>
                        <p>{member.education}</p>
                      </div>
                      <Eye className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </DialogFooter>
          </>
        )}

        {/* ── WELFARE PANEL ────────────────────────────────────────────────────── */}
        {activeTab === "welfare" && household && person && (() => {
          const w = welfare;
          if (!w) return (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-destructive" /> Social Welfare Details — {person.name}
                </DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">No welfare data found for this person.</p>
              <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
            </>
          );

          const natProgs   = w.programs.filter(p => programCategories[p.name] === "National");
          const locProgs   = w.programs.filter(p => programCategories[p.name] === "Local");
          const natActive  = natProgs.filter(p => p.status === "Active").length;
          const locActive  = locProgs.filter(p => p.status === "Active").length;
          const natDep     = computeDependencyLevel(natActive);
          const locDep     = computeDependencyLevel(locActive);

          return (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-destructive" /> Social Welfare Details — {person.name}
                </DialogTitle>
                <DialogDescription>{household.id}</DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <PersonWorkspaceHeader
                  person={person}
                  household={household}
                  isHead={isHead}
                  activeTab="welfare"
                  onNavigate={navigateWorkspace}
                  canGoBack={canGoBack}
                  onBack={goBack}
                />

                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold">Welfare Dependency Level</span> is computed by counting the number of active or registered programs.
                      🟢 Low: 0–2 | 🟡 Moderate: 3–4 | 🔴 High: 5–7
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" /> National Government Programs
                    </h4>
                    <Badge variant="outline" className={natDep.color}>
                      {natDep.emoji} {natDep.level} ({natActive} active)
                    </Badge>
                  </div>
                  {natProgs.length === 0 ? (
                    <p className="text-sm text-muted-foreground pl-6">No national programs enrolled.</p>
                  ) : (
                    <div className="space-y-2">
                      {natProgs.map(p => (
                        <div key={p.name} className="p-3 rounded-lg border border-border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{p.name}</span>
                            <StatusBadge status={p.status} />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <span>Enrolled: {p.enrolledDate}</span>
                            <span>Last Benefit: {p.lastBenefit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" /> Local Government Programs
                    </h4>
                    <Badge variant="outline" className={locDep.color}>
                      {locDep.emoji} {locDep.level} ({locActive} active)
                    </Badge>
                  </div>
                  {locProgs.length === 0 ? (
                    <p className="text-sm text-muted-foreground pl-6">No local programs enrolled.</p>
                  ) : (
                    <div className="space-y-2">
                      {locProgs.map(p => (
                        <div key={p.name} className="p-3 rounded-lg border border-border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{p.name}</span>
                            <StatusBadge status={p.status} />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <span>Enrolled: {p.enrolledDate}</span>
                            <span>Last Benefit: {p.lastBenefit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => { onClose(); }}>Close</Button>
              </DialogFooter>
            </>
          );
        })()}

        {/* ── POLITICAL PANEL ──────────────────────────────────────────────────── */}
        {activeTab === "political" && household && person && (() => {
          const pol = polProfile;
          if (!pol) return (
            <>
              <DialogHeader>
                <DialogTitle>Political Profile — {person.name}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">No political profile found for this person.</p>
              <DialogFooter><Button variant="outline" onClick={onClose}>Close</Button></DialogFooter>
            </>
          );

          const { coreTotal, adjustedScopeAvg, summary } = computePoliticalSummary(pol);

          return (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle>Political Profile — {person.name}</DialogTitle>
                    <DialogDescription>{household.id}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <PersonWorkspaceHeader
                  person={person}
                  household={household}
                  isHead={isHead}
                  activeTab="political"
                  onNavigate={navigateWorkspace}
                  canGoBack={canGoBack}
                  onBack={goBack}
                />

                <div className="p-4 rounded-lg bg-accent border border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Score Summary</p>
                  <div className="grid grid-cols-[1fr_1fr_1fr_2fr] gap-3 text-center">
                    <div><p className="text-xs text-muted-foreground">Core Total</p><p className="text-lg font-bold">{coreTotal}</p></div>
                    <div><p className="text-xs text-muted-foreground">Scope Avg</p><p className="text-lg font-bold">{adjustedScopeAvg.toFixed(2)}</p></div>
                    <div><p className="text-xs text-muted-foreground">PAL</p><p className="text-lg font-bold">{pol.palScore}</p></div>
                    <div><p className="text-xs text-muted-foreground">Orientation</p><p className="text-lg font-bold">{pol.orientation}</p></div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border text-center">
                    <p className="text-xs text-muted-foreground mb-1">Political Profile Classification</p>
                    <Badge className="text-sm px-3 py-1">{summary}</Badge>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Organization Affiliation</p>
                  {polEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Sector</Label><Input defaultValue={pol.orgSector} /></div>
                      <div><Label>Name of Organization</Label><Input defaultValue={pol.orgName} /></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-xs text-muted-foreground">Sector</p><p className="text-sm font-medium">{pol.orgSector || "—"}</p></div>
                      <div><p className="text-xs text-muted-foreground">Organization</p><p className="text-sm font-medium">{pol.orgName || "—"}</p></div>
                    </div>
                  )}
                </div>

                {scoreCategories.map(cat => {
                  const entry = pol.scores[cat.key];
                  const isNone = entry.core === "0" || !entry.core;
                  const sl = cat.key === "infoDissemination" ? infoScopeLabels : scopeLabels;
                  return (
                    <div key={cat.key} className="p-3 rounded-lg border border-border space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{cat.title}</p>
                      {polEditing ? (
                        <>
                          <div>
                            <Label>{cat.question}</Label>
                            <Select defaultValue={entry.core}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {Object.entries(coreLabels[cat.key]).map(([v, l]) => (
                                  <SelectItem key={v} value={v}>{l}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className={isNone ? "text-muted-foreground" : ""}>Scope: {cat.scopeQuestion}</Label>
                            <Select defaultValue={entry.scope} disabled={isNone}>
                              <SelectTrigger><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {Object.entries(sl).map(([v, l]) => (
                                  <SelectItem key={v} value={v}>{l}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">{cat.question}</p>
                            <p className="text-sm font-medium">{coreLabels[cat.key][entry.core] || "None (0)"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Scope: {cat.scopeQuestion}</p>
                            <p className="text-sm font-medium">{isNone ? "N/A" : (sl[entry.scope] || "—")}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wide">Political Authority Level</p>
                  {polEditing ? (
                    <div>
                      <Label>Political Authority Level</Label>
                      <Select defaultValue={pol.palScore}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(palLabels).map(([v, l]) => (
                            <SelectItem key={v} value={v}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <p className="text-sm font-medium">{palLabels[pol.palScore] || "None (0)"}</p>
                  )}
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Last Updated: {pol.lastUpdated}</span>
                  <Button size="sm" variant="link" onClick={() => setPolHistoryOpen(true)}>View Change History</Button>
                </div>
              </div>

              <DialogFooter>
                {polEditing && (
                  <Button onClick={() => { setPolEditing(false); toast.success("Political profile updated (demo only)"); }}>
                    Save Changes
                  </Button>
                )}
                <Button variant="outline" onClick={() => { setPolEditing(false); onClose(); }}>
                  {polEditing ? "Cancel" : "Close"}
                </Button>
              </DialogFooter>
            </>
          );
        })()}

        {/* ── VULNERABILITY PANEL ──────────────────────────────────────────────── */}
        {activeTab === "vulnerability" && household && person && (() => {
          const assessment = getPersonVulnerabilityAssessment(person.id);
          const scores = assessment?.indicatorScores ?? { income: 0, householdSize: 0, employment: 0, welfareAccess: 0, housing: 0, utilities: 0 };
          const indicators = [
            { key: "income",        label: "Income",        score: scores.income },
            { key: "householdSize", label: "Household Size", score: scores.householdSize },
            { key: "employment",    label: "Employment",    score: scores.employment },
            { key: "welfareAccess", label: "Welfare Access", score: scores.welfareAccess },
            { key: "housing",       label: "Housing",       score: scores.housing },
            { key: "utilities",     label: "Utilities",     score: scores.utilities },
          ];
          const total = indicators.reduce((sum, i) => sum + i.score, 0);
          const classification = classifyVulnerability(total);

          return (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" /> Vulnerability Details — {person.name}
                </DialogTitle>
                <DialogDescription>Breakdown of the vulnerability score by indicator.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <PersonWorkspaceHeader
                  person={person}
                  household={household}
                  isHead={isHead}
                  activeTab="vulnerability"
                  onNavigate={navigateWorkspace}
                  canGoBack={canGoBack}
                  onBack={goBack}
                  statusBadge={
                    <Badge variant="outline" className={getVulnerabilityColor(classification)}>
                      {classification}
                    </Badge>
                  }
                />

                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Indicator</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {indicators.map(i => (
                        <TableRow key={i.key}>
                          <TableCell className="font-medium">{i.label}</TableCell>
                          <TableCell className="text-right font-mono">{i.score}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/40">
                        <TableCell className="font-semibold">Total Score</TableCell>
                        <TableCell className="text-right font-mono font-semibold">{total} / 18</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="p-3 rounded-lg border border-border bg-muted/20 flex gap-2 text-xs text-muted-foreground">
                  <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">How is this computed?</p>
                    <p>The classification is based on this person's total vulnerability score (sum of all six indicators).</p>
                    <p className="mt-1">
                      <span className="text-success font-medium">Low: 0–4</span>
                      {"  |  "}
                      <span className="text-warning font-medium">Moderate: 5–9</span>
                      {"  |  "}
                      <span className="text-destructive font-medium">High: 10–14</span>
                      {"  |  "}
                      <span className="text-destructive font-semibold">Critical: 15–18</span>
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={onClose}>Close</Button>
              </DialogFooter>
            </>
          );
        })()}
      </DialogContent>

      {/* ── POLITICAL HISTORY DIALOG (secondary) ────────────────────────────────── */}
      <Dialog open={polHistoryOpen} onOpenChange={setPolHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change History — {person?.name}</DialogTitle>
            <DialogDescription>Timeline of political profile changes.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {[
              { date: "2026-03-10", change: "Orientation updated from Leaning to Strong Support", by: "PO-Reyes" },
              { date: "2026-02-15", change: "Support level changed from 7 to 9",                 by: "PO-Santos" },
              { date: "2025-12-01", change: "Party affiliation updated to PDP-Laban",            by: "PO-Reyes" },
              { date: "2025-09-20", change: "Initial political profile created",                  by: "Data Management" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm pb-3 border-b border-border last:border-0">
                <span className="font-mono tabular-nums text-muted-foreground shrink-0">{item.date}</span>
                <div>
                  <p>{item.change}</p>
                  <p className="text-xs text-muted-foreground">by {item.by}</p>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPolHistoryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}