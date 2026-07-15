import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/components/shared/PageHeader";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  computePoliticalSummary,
  households,
  politicalProfiles,
  persons,
  type Household,
  type Person,
  type WelfareProgram,
  type DependencyLevel,
} from "@/data/mockData";

import {
  House, Trash2, Baby, HeartHandshake, IdCard,
  Eye, Heart, Vote, User, Plus, Upload,
  ChevronDown, ChevronRight, ChevronLeft, Info,
} from "lucide-react";
import { toast } from "sonner";

import { HouseholdFilterBar, applyHouseholdFilters, type HouseholdFilters } from "../components/data-repository/HouseholdFilterBar";
import { type PersonFields, emptyPerson, PersonFormBlock } from "../components/data-repository/FormFields";
import { type HouseholdWorkspaceTab } from "../components/data-repository/HouseholdWorkspaceHeader";
import { HouseholdWorkspace } from "../components/shared/HouseholdWorkspace";

// ── constants ─────────────────────────────────────────────────────────────────

const nationalPrograms: WelfareProgram[] = ["4Ps", "TUPAD", "AICS", "AKAP"];
const localPrograms: WelfareProgram[]    = ["CALAZEN Card", "Nasa Negosyo", "Nasa Tiyaga", "Nasa Isip"];

const isCoreNoneOrZero = (val: string) => !val || val === "0";

// ── component ─────────────────────────────────────────────────────────────────

export default function DataRepository() {
  // ── filters & pagination ───────────────────────────────────────────────────
  const [filters, setFilters] = useState<HouseholdFilters>({ search: "", barangay: null, cluster: null });

  const filtered = useMemo(() => applyHouseholdFilters(households, filters), [filters]);

  const PAGE_SIZE = 6;
  const [page, setPage]       = useState(1);
  const [polPage, setPolPage] = useState(1);

  const [searchParams] = useSearchParams();

  const skipPageResetRef = useRef(false);

  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  useEffect(() => {
    if (!highlightedId) return;

    const handleOutsideClick = (e: PointerEvent) => {
      const rowElement = document.getElementById(`household-row-${highlightedId}`);
      if (rowElement && !rowElement.contains(e.target as Node)) {
        setHighlightedId(null);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [highlightedId]);
  const toggleSelectedRow = (id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev);
      const isCurrentlyExpanded = next.has(id);

      if (isCurrentlyExpanded) {
        next.delete(id);
        // Collapsing this row — if it was the highlighted one, clear the highlight too
        if (highlightedId === id) setHighlightedId(null);
      } else {
        next.add(id);
        setHighlightedId(id); // Expanding — highlight it
      }

      return next;
    });
  };

  // Existing effect — now guarded
  useEffect(() => {
    if (skipPageResetRef.current) {
      skipPageResetRef.current = false;
      return;
    }
    setPage(1);
  }, [filters]);

  useEffect(() => {
    const targetId = searchParams.get("householdId");
    if (!targetId) return;

    skipPageResetRef.current = true;
    setFilters({ search: "", barangay: null, cluster: null });
    setActiveTab("socio");

    const idx = households.findIndex(h => h.id === targetId);
    if (idx === -1) return;

    const targetPage = Math.floor(idx / PAGE_SIZE) + 1;
    setPage(targetPage);
    setExpandedRows(prev => new Set(prev).add(targetId));
    setHighlightedId(targetId);

    setTimeout(() => {
      document.getElementById(`household-row-${targetId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
  }, [searchParams]);

  // useEffect(() => { setPage(1); }, [filters]);

  const totalPages    = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const polTotalPages = Math.max(1, Math.ceil(politicalProfiles.length / PAGE_SIZE));

  const paginated         = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);
  const paginatedPolitical = useMemo(() => politicalProfiles.slice((polPage - 1) * PAGE_SIZE, polPage * PAGE_SIZE), [polPage]);

  // ── tabs ───────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("socio");
  useEffect(() => { setPolPage(1); }, [activeTab]);

  // ── workspace ──────────────────────────────────────────────────────────────
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [selectedHH, setSelectedHH]           = useState<Household | null>(null);
  const [selectedPerson, setSelectedPerson]   = useState<Person | null>(null);
  const [initialTab, setInitialTab]           = useState<HouseholdWorkspaceTab>("profile");

  const openWorkspace = (household: Household, tab: HouseholdWorkspaceTab = "profile", person?: Person) => {
    setSelectedHH(household);
    setSelectedPerson(person ?? null);
    setInitialTab(tab);
    setWorkspaceOpen(true);
  };
  // ── expandable rows ────────────────────────────────────────────────────────
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  // const toggleRow = (id: string) => {
  //   setExpandedRows(prev => {
  //     const next = new Set(prev);
  //     if (next.has(id)) next.delete(id); else next.add(id);
  //     return next;
  //   });
  // };

  // ── add household form ─────────────────────────────────────────────────────
  const [addHouseholdOpen, setAddHouseholdOpen] = useState(false);
  const [formPage, setFormPage] = useState(1);
  const TOTAL_PAGES = 5;
  const csvInputRef = useRef<HTMLInputElement>(null);

  // form field state
  const [subjectFields, setSubjectFields] = useState<PersonFields>(emptyPerson());
  const updateSubject = (field: keyof PersonFields, val: string | Date | undefined) =>
    setSubjectFields(prev => ({ ...prev, [field]: val }));

  const [partnerFields, setPartnerFields] = useState<PersonFields>(emptyPerson());
  const updatePartner = (field: keyof PersonFields, val: string | Date | undefined) =>
    setPartnerFields(prev => ({ ...prev, [field]: val }));

  type ChildEntry = PersonFields & { id: number };
  const [childrenNoSpouse, setChildrenNoSpouse] = useState<ChildEntry[]>([{ ...emptyPerson(), id: 1 }]);
  const addChild    = () => setChildrenNoSpouse(prev => [...prev, { ...emptyPerson(), id: Date.now() }]);
  const removeChild = (id: number) => setChildrenNoSpouse(prev => prev.filter(c => c.id !== id));
  const updateChild = (id: number, field: keyof PersonFields, val: string | Date | undefined) =>
    setChildrenNoSpouse(prev => prev.map(c => c.id === id ? { ...c, [field]: val } : c));

  const [hasChildren, setHasChildren]               = useState("");
  const [hasPartner, setHasPartner]                 = useState("");
  const [hasChildrenNoSpouse, setHasChildrenNoSpouse] = useState("");

  // political scoring state
  const [orgSector, setOrgSector]   = useState("");
  const [orgName, setOrgName]       = useState("");
  const [coreScore1, setCoreScore1] = useState("");
  const [scopeScore1, setScopeScore1] = useState("");
  const [coreScore2, setCoreScore2] = useState("");
  const [scopeScore2, setScopeScore2] = useState("");
  const [coreScore3, setCoreScore3] = useState("");
  const [scopeScore3, setScopeScore3] = useState("");
  const [coreScore4, setCoreScore4] = useState("");
  const [scopeScore4, setScopeScore4] = useState("");
  const [coreScore5, setCoreScore5] = useState("");
  const [scopeScore5, setScopeScore5] = useState("");
  const [palScore1, setPalScore1]   = useState("");

  const resetForm = () => {
    setFormPage(1);
    setSubjectFields(emptyPerson());
    setPartnerFields(emptyPerson());
    setHasPartner("");
    setHasChildren("");
    setHasChildrenNoSpouse("");
    setChildrenNoSpouse([{ ...emptyPerson(), id: 1 }]);
    setOrgSector(""); setOrgName("");
    setCoreScore1(""); setScopeScore1("");
    setCoreScore2(""); setScopeScore2("");
    setCoreScore3(""); setScopeScore3("");
    setCoreScore4(""); setScopeScore4("");
    setCoreScore5(""); setScopeScore5("");
    setPalScore1("");
  };

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      <PageHeader title="Data Repository" subtitle="Comprehensive household data management" />

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="socio" className="w-full flex flex-col">
        <div className="flex justify-between mb-4">
          <TabsList>
            <TabsTrigger value="socio">Socio-Demographic</TabsTrigger>
            <TabsTrigger value="political">Political Profile</TabsTrigger>
          </TabsList>

          {activeTab === "socio" && (
            <div className="flex items-center gap-2">
              <Button className="p-4" variant="outline" size="sm" onClick={() => csvInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-1" /> Import
              </Button>
              <Button className="p-4" size="sm" onClick={() => setAddHouseholdOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Household
              </Button>
            </div>
          )}
        </div>

        {/* SOCIO-DEMOGRAPHIC TAB */}
        <TabsContent value="socio">
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-base">Household Records</CardTitle>
                <HouseholdFilterBar onChange={setFilters} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="p-0 max-h-[310px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10"></TableHead>
                      <TableHead>Household ID</TableHead>
                      <TableHead>Individual ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Barangay</TableHead>
                      <TableHead>Cluster</TableHead>
                      <TableHead>Precinct</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((h) => {
                      const isExpanded       = expandedRows.has(h.id);
                      const householdPersons = persons.filter(p => p.householdId === h.id);
                      const head             = householdPersons.find(p => p.relation === "Head");
                      const members          = householdPersons.filter(p => p.relation !== "Head");
                      return (
                        <>
                            <TableRow
                              key={h.id}
                              id={`household-row-${h.id}`}
                              highlighted={highlightedId === h.id}
                              className="transition-colors"
                            >
                            <TableCell className="px-2">
                              {members.length > 0 && (
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleSelectedRow(h.id)}>
                                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </Button>
                              )}
                            </TableCell>
                            <TableCell className="font-mono text-xs tabular-nums">{h.id}</TableCell>
                            <TableCell className="font-mono text-xs tabular-nums">{head?.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{h.headOfFamily}</span>
                                <Badge variant="outline" className="ml-2 text-[10px] px-1.5 py-0">Head</Badge>
                              </div>
                            </TableCell>
                            <TableCell>{h.barangay}</TableCell>
                            <TableCell className="tabular-nums">{h.cluster}</TableCell>
                            <TableCell>{h.precinct}</TableCell>
                            <TableCell className="text-right">
                              <Button size="sm" variant="ghost" onClick={() => openWorkspace(h)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>

                          {isExpanded && members.map(m => (
                            <TableRow
                              key={m.id}
                              className="bg-muted/30 transition-colors"
                              highlighted={highlightedId === m.id}
                            >
                              <TableCell></TableCell>
                              <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">{m.householdId}</TableCell>
                              <TableCell className="font-mono text-xs tabular-nums text-muted-foreground">{m.id}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 pl-4">
                                  <span className="text-sm">{m.firstName} {m.lastName}</span>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{m.relation}</Badge>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{m.barangay}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{m.cluster}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">{m.precinct}</TableCell>
                              <TableCell className="text-right">
                                <Button size="sm" variant="ghost" onClick={() => openWorkspace(h, "profile", m)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-4">
                  <button onClick={() => setPage(p => p - 1)} disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-3 h-3" /> Prev
                  </button>
                  <span className="text-xs text-muted-foreground font-mono">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed">
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* POLITICAL PROFILE TAB */}
        <TabsContent value="political">
          <Card className="border border-border shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Political Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Political Influence</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPolitical.map(p => {
                    const hh = households.find(h => h.id === p.householdId)!;
                    const person = persons.find(person => person.id === p.personId);
                    const { summary } = computePoliticalSummary(p);
                    return (
                      <TableRow key={p.personId}>
                        <TableCell className="font-mono text-xs tabular-nums">{p.personId}</TableCell>
                        <TableCell className="font-medium">{person?.name ?? hh.headOfFamily}</TableCell>
                        <TableCell className="tabular-nums">{summary}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost" onClick={() => openWorkspace(hh, "political", person)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {polTotalPages > 1 && (
                <div className="flex items-center justify-between px-2 pt-4">
                  <button onClick={() => setPolPage(p => p - 1)} disabled={polPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-3 h-3" /> Prev
                  </button>
                  <span className="text-xs text-muted-foreground font-mono">{polPage} / {polTotalPages}</span>
                  <button onClick={() => setPolPage(p => p + 1)} disabled={polPage === polTotalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed">
                    Next <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── ADD HOUSEHOLD MODAL ──────────────────────────────────────────────── */}
      <Dialog open={addHouseholdOpen} onOpenChange={(open) => { setAddHouseholdOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="min-w-3xl max-w-4xl max-h-[85vh] overflow-y-auto"
          onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Plus className="h-4 w-4" /> Add New Household</DialogTitle>
            <DialogDescription>Fill in the Inputs Correctly</DialogDescription>
          </DialogHeader>

          {formPage === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3">
                <Label className="text-sm font-medium text-gray-700">Location Type</Label>
                <RadioGroup className="flex flex-row gap-15">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="urban" id="urban" className="border-[#2362EA] text-[#2362EA]" style={{ borderWidth: "1px", borderColor: "#2362EA" }} />
                    <Label htmlFor="urban" className="cursor-pointer">Urban</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="rural" id="rural" className="border-[#2362EA] text-[#2362EA]" style={{ borderWidth: "1px", borderColor: "#2362EA" }} />
                    <Label htmlFor="rural" className="cursor-pointer">Rural</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-gray-700">House Number</Label>
                  <Input placeholder="000 or leave blank" className="w-auto" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-gray-700">Mapping Number (LOC)</Label>
                  <Input placeholder="000 if map unavailable" className="w-auto" />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Personal Information
                </h4>
                <PersonFormBlock value={subjectFields} onChange={updateSubject} idPrefix="subject" showCivilStatus />
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Monthly Combined Household Income</Label>
                  <Input type="number" placeholder="Amount in PHP" className="w-full" />
                </div>

                <h4 className="text-sm font-semibold flex items-center gap-2 pt-2 border-t border-border">
                  <IdCard className="h-4 w-4 text-primary" /> Voter & contact information
                </h4>
                <div className="grid grid-cols-2 gap-10">
                  <div className="grid grid-cols-1 gap-3">
                    <Label className="text-sm font-medium text-gray-700">Register Voter?</Label>
                    <RadioGroup className="flex flex-row gap-15">
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Yes" id="voter-yes" className="border-[#2362EA] text-[#2362EA]" style={{ borderWidth: "1px", borderColor: "#2362EA" }} />
                        <Label htmlFor="voter-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="No" id="voter-no" className="border-[#2362EA] text-[#2362EA]" style={{ borderWidth: "1px", borderColor: "#2362EA" }} />
                        <Label htmlFor="voter-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label className="text-sm font-medium text-gray-700">Precinct Number</Label>
                    <Input type="number" placeholder="000 if unknown" className="w-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Cellphone Number</Label>
                  <div className="flex items-center gap-2 w-full">
                    <p className="text-sm font-medium text-gray-700 w-auto">+63 9</p>
                    <Input type="number" placeholder="12 345 6789" className="w-auto" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-600">Remove first two digits "09" — enter remaining 9 digits</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-gray-700">Barangay</Label>
                    <Input placeholder="Barangay" className="w-auto" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-medium text-gray-700">Purok / Sitio</Label>
                    <Input placeholder="Purok / Sitio" className="w-auto" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">House Number (plaka ng bahay)</Label>
                  <Input type="number" placeholder="N/A if none, 000 if unknown" className="w-full" />
                </div>
              </div>

              <div className="p-4 rounded-lg border border-border space-y-3">
                <Label className="text-sm font-semibold">Children with spouse</Label>
                <div className="grid grid-cols-1 gap-3">
                  <Label className="text-sm font-medium text-gray-700">May mga anak ba si subject na may asawa?</Label>
                  <RadioGroup className="flex flex-row gap-15" value={hasChildren} onValueChange={setHasChildren}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="children-yes" className="border-[#2362EA] text-[#2362EA]" style={{ borderWidth: "1px", borderColor: "#2362EA" }} />
                      <Label htmlFor="children-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="children-no" className="border-[#2362EA] text-[#2362EA]" style={{ borderWidth: "1px", borderColor: "#2362EA" }} />
                      <Label htmlFor="children-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                {hasChildren === "yes" && (
                  <div className="grid grid-cols-1 gap-3">
                    <Label className="text-sm font-medium text-gray-700">Names of married children</Label>
                    <Textarea placeholder="Enter each name on a new line (ALL CAPS: LAST NAME/ FIRST NAME/ MIDDLE NAME)" className="w-full min-h-[120px] resize-y" />
                  </div>
                )}
              </div>
            </div>
          )}

          {formPage === 2 && (
            <div className="space-y-5">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-primary" /> Partner Information
              </h4>
              <div className="p-4 rounded-lg border border-border space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <Label className="text-sm font-medium text-gray-700">Does the subject have a spouse or partner?</Label>
                  <RadioGroup className="flex flex-row gap-15" value={hasPartner} onValueChange={setHasPartner}>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="yes" id="spouse-yes" className="border-[#2362EA] text-[#2362EA]" style={{ borderWidth: "1px", borderColor: "#2362EA" }} />
                      <Label htmlFor="spouse-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="no" id="spouse-no" className="border-[#2362EA] text-[#2362EA]" style={{ borderWidth: "1px", borderColor: "#2362EA" }} />
                      <Label htmlFor="spouse-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                {hasPartner === "yes" && (
                  <PersonFormBlock value={partnerFields} onChange={updatePartner} idPrefix="partner" showVoterAndContact={true} />
                )}
              </div>
            </div>
          )}

          {formPage === 3 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Vote className="h-4 w-4 text-primary" /> Political Influence Level
              </h4>

              <div className="p-3 rounded-lg border border-border space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Organization Affiliation</p>
                <p className="text-sm text-foreground">Is the subject affiliated with any organization?</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Sector</Label>
                    <Input placeholder="Sector" value={orgSector} onChange={e => setOrgSector(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Name of Organization</Label>
                    <Select value={orgName} onValueChange={setOrgName}>
                      <SelectTrigger><SelectValue placeholder="Select organization" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="org-a">Organization A</SelectItem>
                        <SelectItem value="org-b">Organization B</SelectItem>
                        <SelectItem value="org-c">Organization C</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Core Score #1 */}
              <div className="p-3 rounded-lg border border-border space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Core Score #1</p>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">What position does the subject hold?</Label>
                  <Select value={coreScore1} onValueChange={(v) => { setCoreScore1(v); if (v === "0") setScopeScore1(""); }}>
                    <SelectTrigger><SelectValue placeholder="Member" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None (0)</SelectItem>
                      <SelectItem value="1">Member / Former Member (1)</SelectItem>
                      <SelectItem value="2a">Officer / Coordinator (2)</SelectItem>
                      <SelectItem value="2b">Former Officer / Former Senior (2)</SelectItem>
                      <SelectItem value="3">Senior Officer / Federation Role (3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={isCoreNoneOrZero(coreScore1) ? "text-muted-foreground" : ""}>Scope: Geographic reach of the organization?</Label>
                  <Select value={scopeScore1} onValueChange={setScopeScore1} disabled={isCoreNoneOrZero(coreScore1)}>
                    <SelectTrigger><SelectValue placeholder="Cluster" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cluster Only (1)</SelectItem>
                      <SelectItem value="2">Across Multiple Clusters within Barangay (2)</SelectItem>
                      <SelectItem value="3">Across Multiple Barangays / Municipal (3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Core Score #2 */}
              <div className="p-3 rounded-lg border border-border space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Core Score #2</p>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">What is the level of community leadership of the subject?</Label>
                  <Select value={coreScore2} onValueChange={(v) => { setCoreScore2(v); if (v === "0") setScopeScore2(""); }}>
                    <SelectTrigger><SelectValue placeholder="Member" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None (0)</SelectItem>
                      <SelectItem value="1">Informal / Limited Role (1)</SelectItem>
                      <SelectItem value="2">Recognized Local Leader (2)</SelectItem>
                      <SelectItem value="3">Key Community Leader (3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={isCoreNoneOrZero(coreScore2) ? "text-muted-foreground" : ""}>Scope: Area covered</Label>
                  <Select value={scopeScore2} onValueChange={setScopeScore2} disabled={isCoreNoneOrZero(coreScore2)}>
                    <SelectTrigger><SelectValue placeholder="Cluster Only" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cluster Only (1)</SelectItem>
                      <SelectItem value="2">Across Multiple Clusters within Barangay (2)</SelectItem>
                      <SelectItem value="3">Across Multiple Barangays / Municipal (3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Core Score #3 */}
              <div className="p-3 rounded-lg border border-border space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Core Score #3</p>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">What is the mobilization capacity of the subject?</Label>
                  <Select value={coreScore3} onValueChange={(v) => { setCoreScore3(v); if (v === "0") setScopeScore3(""); }}>
                    <SelectTrigger><SelectValue placeholder="16+ Persons" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None (0)</SelectItem>
                      <SelectItem value="1">1-5 Persons (1)</SelectItem>
                      <SelectItem value="2">6-15 Persons (2)</SelectItem>
                      <SelectItem value="3">16+ Persons (3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={isCoreNoneOrZero(coreScore3) ? "text-muted-foreground" : ""}>Scope: Mobilized people come from?</Label>
                  <Select value={scopeScore3} onValueChange={setScopeScore3} disabled={isCoreNoneOrZero(coreScore3)}>
                    <SelectTrigger><SelectValue placeholder="Cluster Only" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cluster Only (1)</SelectItem>
                      <SelectItem value="2">Across Multiple Clusters within Barangay (2)</SelectItem>
                      <SelectItem value="3">Across Multiple Barangays / Municipal (3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Core Score #4 */}
              <div className="p-3 rounded-lg border border-border space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Core Score #4</p>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Opinion Leadership</Label>
                  <Select value={coreScore4} onValueChange={(v) => { setCoreScore4(v); if (v === "0") setScopeScore4(""); }}>
                    <SelectTrigger><SelectValue placeholder="Constantly Regarded" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None (0)</SelectItem>
                      <SelectItem value="1">Occasionally Regarded (1)</SelectItem>
                      <SelectItem value="2">Frequently Regarded (2)</SelectItem>
                      <SelectItem value="3">Constantly Regarded (3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={isCoreNoneOrZero(coreScore4) ? "text-muted-foreground" : ""}>Scope: Area covered</Label>
                  <Select value={scopeScore4} onValueChange={setScopeScore4} disabled={isCoreNoneOrZero(coreScore4)}>
                    <SelectTrigger><SelectValue placeholder="Cluster Only" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Cluster Only (1)</SelectItem>
                      <SelectItem value="2">Across Multiple Clusters within Barangay (2)</SelectItem>
                      <SelectItem value="3">Across Multiple Barangays / Municipal (3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Core Score #5 */}
              <div className="p-3 rounded-lg border border-border space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Core Score #5</p>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Role in Information Dissemination</Label>
                  <Select value={coreScore5} onValueChange={(v) => { setCoreScore5(v); if (v === "0") setScopeScore5(""); }}>
                    <SelectTrigger><SelectValue placeholder="Regular Relay" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None (0)</SelectItem>
                      <SelectItem value="1">Occasional Relay (1)</SelectItem>
                      <SelectItem value="2">Regular Relay (2)</SelectItem>
                      <SelectItem value="3">Key Information Conduit (3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className={isCoreNoneOrZero(coreScore5) ? "text-muted-foreground" : ""}>Scope: Area covered</Label>
                  <Select value={scopeScore5} onValueChange={setScopeScore5} disabled={isCoreNoneOrZero(coreScore5)}>
                    <SelectTrigger><SelectValue placeholder="Multiple Barangays" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Within Household Only (1)</SelectItem>
                      <SelectItem value="2">Extended Family within Barangay (2)</SelectItem>
                      <SelectItem value="3">Extended Family Across Multiple Barangays (3)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PAL Score */}
              <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-3">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">PAL Score #1 — Independent</p>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Political Authority Level</Label>
                  <Select value={palScore1} onValueChange={setPalScore1}>
                    <SelectTrigger><SelectValue placeholder="Barangay Captain" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">None (0)</SelectItem>
                      <SelectItem value="1">Informal Local Political Role (1)</SelectItem>
                      <SelectItem value="2">Barangay Councilor (2)</SelectItem>
                      <SelectItem value="3">Barangay Captain (3)</SelectItem>
                      <SelectItem value="4">City / Municipal Councilor (4)</SelectItem>
                      <SelectItem value="5">City / Municipal Vice Mayor (5)</SelectItem>
                      <SelectItem value="6">City / Municipal Mayor (6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {formPage === 4 && (
            <div className="space-y-5">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Baby className="h-4 w-4 text-primary" /> Children without spouses
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <Label className="text-sm font-medium text-gray-700">May mga anak na walang asawa at kapamilya sa bahay?</Label>
                <RadioGroup className="flex flex-row gap-15" value={hasChildrenNoSpouse} onValueChange={setHasChildrenNoSpouse}>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="yes" id="no-spouse-yes" className="border-[#2362EA] text-[#2362EA]" style={{ borderWidth: "1px", borderColor: "#2362EA" }} />
                    <Label htmlFor="no-spouse-yes" className="cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="no" id="no-spouse-no" className="border-[#2362EA] text-[#2362EA]" style={{ borderWidth: "1px", borderColor: "#2362EA" }} />
                    <Label htmlFor="no-spouse-no" className="cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
              {hasChildrenNoSpouse === "yes" && (
                <div className="space-y-3">
                  {childrenNoSpouse.map((child, index) => (
                    <div key={child.id} className="p-4 rounded-lg border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Child {index + 1}</Label>
                        {childrenNoSpouse.length > 1 && (
                          <Button variant="ghost" size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 px-2"
                            onClick={() => removeChild(child.id)}>
                            <ChevronDown className="h-3.5 w-3.5 mr-1" /> Remove
                          </Button>
                        )}
                      </div>
                      <PersonFormBlock
                        value={child}
                        onChange={(field, val) => updateChild(child.id, field, val)}
                        idPrefix={`child-${child.id}`}
                        showRelationToHead={true}
                      />
                    </div>
                  ))}
                  <Button variant="outline" size="sm"
                    className="w-full border-dashed text-[#2362EA] border-[#2362EA] hover:bg-[#2362EA]/5"
                    onClick={addChild}>
                    <Plus className="h-4 w-4 mr-1" /> Add a Child
                  </Button>
                </div>
              )}
            </div>
          )}

          {formPage === 5 && (
            <div className="space-y-5">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <House className="h-4 w-4 text-primary" /> Household Vulnerability Classification
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label>Housing Description</Label>
                  <Textarea placeholder="Housing description" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Housing Type</Label>
                  <Select>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Concrete">Concrete</SelectItem>
                      <SelectItem value="Semi-concrete">Semi-concrete</SelectItem>
                      <SelectItem value="Wood">Wood</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4 col-span-3">
                <div className="flex items-center gap-2"><Checkbox id="electricity" /><Label htmlFor="electricity">Electricity</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="internet" /><Label htmlFor="internet">Internet</Label></div>
                <div className="flex items-center gap-2"><Checkbox id="water" /><Label htmlFor="water">Water</Label></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-gray-700">Longitude</Label>
                  <Input placeholder="longitude" className="w-auto" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium text-gray-700">Latitude</Label>
                  <Input placeholder="latitude" className="w-auto" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Heart className="h-4 w-4 text-destructive" /> Social Welfare Information
                </h4>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">National Programs</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {nationalPrograms.map((prog) => (
                      <div key={prog} className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                        <Checkbox id={`national-${prog}`} />
                        <Label htmlFor={`national-${prog}`} className="cursor-pointer text-sm">{prog}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Local Programs</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {localPrograms.map((prog) => (
                      <div key={prog} className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent">
                        <Checkbox id={`local-${prog}`} />
                        <Label htmlFor={`local-${prog}`} className="cursor-pointer text-sm">{prog}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between mt-4">
            <div>
              {formPage > 1 && (
                <Button variant="outline" onClick={() => setFormPage(p => p - 1)}>← Back</Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { setAddHouseholdOpen(false); resetForm(); }}>Cancel</Button>
              {formPage < TOTAL_PAGES ? (
                <Button onClick={() => setFormPage(p => p + 1)}>Next →</Button>
              ) : (
                <Button onClick={() => { setAddHouseholdOpen(false); resetForm(); toast.success("Person added successfully!"); }}>
                  <Plus className="h-4 w-4 mr-1" /> Submit
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── HOUSEHOLD WORKSPACE ──────────────────────────────────────────────── */}
      <HouseholdWorkspace
        open={workspaceOpen}
        household={selectedHH}
        initialPerson={selectedPerson}
        initialTab={initialTab}
        onClose={() => setWorkspaceOpen(false)}
      />

      {/* hidden CSV input */}
      <input ref={csvInputRef} type="file" accept=".csv" className="hidden" />
    </div>
  );
}