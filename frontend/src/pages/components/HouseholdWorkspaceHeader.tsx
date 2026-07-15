import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Vote, Shield, User, ArrowLeft } from "lucide-react";
import { getCandidateConfig, type Household, type Person, type PoliticalOrientation, type PoliticalTendency } from "@/data/mockData";

export type HouseholdWorkspaceTab = "profile" | "political" | "welfare" | "vulnerability";

function tendencyToOrientation(t: PoliticalTendency): PoliticalOrientation {
  if (t === "Pro-Administration" || t === "Leaning Administration") return "maratas";
  if (t === "Opposition" || t === "Leaning Opposition") return "luz";
  return "undecided";
}

interface PersonWorkspaceHeaderProps {
  person: Person;
  household: Household;
  isHead: boolean;
  activeTab: HouseholdWorkspaceTab;
  onNavigate: (tab: HouseholdWorkspaceTab) => void;
  onEditAvatar?: () => void;
  statusBadge?: React.ReactNode;
  canGoBack?: boolean;
  onBack?: () => void;
}

const tabs: { key: HouseholdWorkspaceTab; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile", icon: <User className="h-3 w-3" /> },
  { key: "political", label: "Political", icon: <Vote className="h-3 w-3" /> },
  { key: "welfare", label: "Welfare", icon: <Heart className="h-3 w-3" /> },
  { key: "vulnerability", label: "Vulnerability", icon: <Shield className="h-3 w-3" /> },
];

export function PersonWorkspaceHeader({
  person,
  household,
  isHead,
  activeTab,
  onNavigate,
  onEditAvatar,
  statusBadge,
  canGoBack,
  onBack,
}: PersonWorkspaceHeaderProps) {
  const pol = getCandidateConfig(tendencyToOrientation(person.politicalTendency));

  return (
    <div className="rounded-lg bg-accent overflow-hidden mb-5">
      {canGoBack && (
        <div className="px-3 pt-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1.5 -ml-1"
            onClick={onBack}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </Button>
        </div>
      )}

      <div className="flex items-center gap-4 p-4">
        <div className="flex-shrink-0">
          <div className="relative group">
            <Avatar className={`h-10 w-10 ring-2 ring-offset-1 ${pol.ringClass}`}>
              <AvatarImage src={person.profileImage} />
              <AvatarFallback className="text-lg">{person.firstName.charAt(0)}</AvatarFallback>
            </Avatar>
            {onEditAvatar && (
              <div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                flex items-center justify-center rounded-full transition cursor-pointer"
                onClick={onEditAvatar}
              >
                <span className="text-xs text-white">Edit</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-lg font-semibold leading-tight">{person.name}</p>
            {isHead && (
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 uppercase tracking-wide">
                Head
              </Badge>
            )}
            {!isHead && (
              <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                {person.relation}
              </Badge>
            )}
            {statusBadge}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {[household.id, person.barangay, person.cluster].filter(Boolean).join(" • ")}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-2 mr-3">
          <Button
            variant="outline"
            className="h-6 rounded-sm cursor-pointer text-xs"
            onClick={() => { /* setEditPersonOpen(true) */ }}
          >
            Edit {isHead ? "Household" : "Member"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1 px-3 pb-3">
        {tabs.filter(t => t.key !== activeTab).map(t => (
          <Button
            key={t.key}
            variant="outline"
            size="sm"
            className="h-7 text-xs gap-1.5 bg-background/60 hover:bg-background"
            onClick={() => onNavigate(t.key)}
          >
            {t.icon}
            {t.label}
          </Button>
        ))}
        <Badge variant="secondary" className="h-7 px-2.5 text-xs gap-1.5 rounded-md font-medium ml-auto">
          {tabs.find(t => t.key === activeTab)?.icon}
          {tabs.find(t => t.key === activeTab)?.label}
        </Badge>
      </div>
    </div>
  );
}