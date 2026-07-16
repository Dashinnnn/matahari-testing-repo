import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
  programCategories,
  persons,
  getPersonWelfare,
  getPersonVulnerabilityAssessment,
  type Household,
  type Person,
  type DependencyLevel,
} from "@/data/mockData";

import {
  ArrowDown, ArrowRight, Eye, MapPin, Users,
  Heart, Shield
} from "lucide-react";

import { HouseholdWorkspaceHeader, type HouseholdWorkspaceTab } from "../data-repository/HouseholdWorkspaceHeader";

// ── helpers (same as DataRepository) ────────────────────────────────────────

const computeDependencyLevel = (activeCount: number): { level: DependencyLevel; color: string; emoji: string } => {
  if (activeCount <= 2) return { level: "Low",      color: "bg-success/15 text-success border-success/30",         emoji: "🟢" };
  if (activeCount <= 4) return { level: "Moderate", color: "bg-warning/15 text-warning border-warning/30",         emoji: "🟡" };
  return                       { level: "High",     color: "bg-destructive/15 text-destructive border-destructive/30", emoji: "🔴" };
};

const getDependencyColor = (level: DependencyLevel) => {
  switch (level) {
    case "High":     return "bg-destructive/15 text-destructive border-destructive/30";
    case "Moderate": return "bg-warning/15 text-warning border-warning/30";
    case "Low":      return "bg-success/15 text-success border-success/30";
  }
};

// ── props ────────────────────────────────────────────────────────────────────

interface HouseholdProfileModalProps {
  open: boolean;
  household: Household | null;
  onClose: () => void;
  onNavigate: (tab: HouseholdWorkspaceTab) => void;
  onOpenWelfare: (householdId: string) => void;
  onOpenPolitical: (householdId: string) => void;
  onOpenPerson: (person: Person) => void;
  onOpenVulnerability: () => void;
}

// ── component ────────────────────────────────────────────────────────────────

export function HouseholdProfileModal({
  open,
  household,
  onClose,
  onNavigate,
  onOpenWelfare,
  onOpenPerson,
  onOpenVulnerability,
}: HouseholdProfileModalProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  // reset when household changes
  useEffect(() => {
    setExpanded(false);
    setEditing(false);
  }, [household?.id]);

  const getHouseholdMembers = (id: string) => persons.filter(p => p.householdId === id);

  const goToMapping = (lat: number, lng: number) => navigate(`/mapping?lat=${lat}&lng=${lng}`);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => { if (!o) { onClose(); } }}
    >
      <DialogContent
        className="min-w-3xl max-w-4xl max-h-[90vh] overflow-y-auto transition-all "
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Household Profile — {household?.id}</DialogTitle>
              <DialogDescription>{household?.headOfFamily}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {household && (() => {
          const head = persons.find(p => p.householdId === household.id && p.relation === "Head") || persons.find(p => p.householdId === household.id) || persons[0];
          return (
          <div className="space-y-5">
            <HouseholdWorkspaceHeader
              person={head}
              household={household}
              activeTab="profile"
              onNavigate={onNavigate}
              onEditAvatar={() => {}}
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

            {/* ── Info grid ── */}
            {editing ? (
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Head of Family</Label><Input defaultValue={household.headOfFamily} /></div>
                <div><Label>Age</Label><Input type="number" defaultValue={head?.age} /></div>
                <div>
                  <Label>Sex</Label>
                  <Select defaultValue={head?.sex}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Civil Status</Label>
                  <Select defaultValue={head?.civilStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Widow">Widow</SelectItem>
                      <SelectItem value="Separated">Separated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Education</Label><Input defaultValue={head?.education} /></div>
                <div><Label>Occupation</Label><Input defaultValue={head?.occupation} /></div>
                <div><Label>Religion</Label><Input defaultValue={head?.religion} /></div>
                <div><Label>Income</Label><Input type="number" defaultValue={household.income} /></div>
                <div><Label>Members</Label><Input type="number" defaultValue={household.members} /></div>
                <div>
                  <Label>Housing Type</Label>
                  <Select defaultValue={household.housingType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Concrete">Concrete</SelectItem>
                      <SelectItem value="Semi-concrete">Semi-concrete</SelectItem>
                      <SelectItem value="Wood">Wood</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Water Source</Label><Input defaultValue={household.waterSource} /></div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Checkbox defaultChecked={household.electricity} /><Label>Electricity</Label></div>
                  <div className="flex items-center gap-2"><Checkbox defaultChecked={household.internet} /><Label>Internet</Label></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {([
                  ["Age", head?.age ?? "—"],
                  ["Sex", head?.sex ?? "—"],
                  ["Civil Status", head?.civilStatus ?? "—"],
                  ["Education", head?.education ?? "—"],
                  ["Occupation", head?.occupation ?? "—"],
                  ["Religion", head?.religion ?? "—"],
                  ["Income", `₱${household.income.toLocaleString()}`],
                  ["Members", household.members],
                  ["Housing", household.housingType],
                  ["Water", household.waterSource],
                  ["Electricity", household.electricity ? "Yes" : "No"],
                  ["Internet", household.internet ? "Yes" : "No"],
                ] as [string, string | number][]).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium">{String(value)}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── Expandable welfare / vulnerability summary ── */}
            <div className="rounded-lg bg-accent">
              <button
                className="flex items-center gap-2 p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors w-full text-left"
                onClick={() => setExpanded(!expanded)}
              >
                <ArrowDown className="h-3 w-3 text-primary" />
                <span className="text-sm text-muted-foreground">Expand</span>
              </button>

              {expanded && (() => {
                const head = persons.find(p => p.householdId === household.id && p.relation === "Head");
                const welfare = head ? getPersonWelfare(head.id) : null;
                const natProgs = welfare?.programs.filter(p => programCategories[p.name] === "National") || [];
                const locProgs = welfare?.programs.filter(p => programCategories[p.name] === "Local") || [];
                const natActive = natProgs.filter(p => p.status === "Active").length;
                const locActive = locProgs.filter(p => p.status === "Active").length;
                const natDep = computeDependencyLevel(natActive);
                const locDep = computeDependencyLevel(locActive);
                const assessment = head ? getPersonVulnerabilityAssessment(head.id) : null;

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
                        <Button variant="outline" size="sm" onClick={() => onOpenWelfare(household.id)}>
                          <Heart className="h-4 w-4 mr-2" /> View Full Social Welfare Details
                          <ArrowRight className="h-3 w-3 ml-auto" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg border border-border">
                      <h4 className="text-sm font-semibold mb-3">Household Vulnerability Classification</h4>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">Classification</span>
                        <Badge variant="outline" className={getDependencyColor(assessment?.vulnerabilityClassification || "Low")}>
                          {assessment?.vulnerabilityClassification || "N/A"}
                        </Badge>
                      </div>
                      <Button variant="outline" size="sm" onClick={onOpenVulnerability}>
                        View Full Details
                      </Button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* ── Location ── */}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Location</p>
              <button
                className="flex items-center gap-2 p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors w-full text-left"
                onClick={() => goToMapping(household.lat, household.lng)}
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

            {/* ── Genealogy ── */}
            <div id="genealogy-section">
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Users className="h-3 w-3" /> Household Members ({getHouseholdMembers(household.id).length})
              </p>
              <div className="space-y-2">
                {getHouseholdMembers(household.id).map(member => (
                  <button
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg border border-border hover:bg-accent transition-colors w-full text-left"
                    onClick={() => onOpenPerson(member)}
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
          );
        })()}

        <DialogFooter>
          <Button variant="outline" onClick={() => { onClose(); setEditing(false); }}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}