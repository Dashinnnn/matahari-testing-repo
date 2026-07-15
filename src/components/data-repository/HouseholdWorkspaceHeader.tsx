// HouseholdWorkspaceHeader.tsx
// Reusable workspace header component for household-related modals.
// Shows avatar, household info, and navigation tabs.
// Pass `activeTab` to hide the button for the current modal.

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Vote, Shield, User } from "lucide-react";

import { getCandidateConfig, households, type Household, type Person} from "@/data/mockData";


export type HouseholdWorkspaceTab =
  | "profile"
  | "political"
  | "welfare"
  | "vulnerability";

interface HouseholdWorkspaceHeaderProps {
  /** The household object (requires at minimum these fields) */
  person: Person
  household: Household
  /** Which modal/tab this header is currently rendered inside */
  activeTab: HouseholdWorkspaceTab;
  /** Callbacks for navigating to each tab */
  onNavigate: (tab: HouseholdWorkspaceTab) => void;
  /** Optional: show an "Edit picture" overlay on the avatar */
  onEditAvatar?: () => void;
  /** Optional: extra badge/status to show beside the name */
  statusBadge?: React.ReactNode;
}

const tabs: {
  key: HouseholdWorkspaceTab;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "profile",
    label: "Profile",
    icon: <User className="h-3 w-3" />,
  },
  {
    key: "political",
    label: "Political",
    icon: <Vote className="h-3 w-3" />,
  },
  {
    key: "welfare",
    label: "Welfare",
    icon: <Heart className="h-3 w-3" />,
  },
  {
    key: "vulnerability",
    label: "Vulnerability",
    icon: <Shield className="h-3 w-3" />,
  },
];

export function HouseholdWorkspaceHeader({
  person,
  household,
  activeTab,
  onNavigate,
  onEditAvatar,
  statusBadge,
}: HouseholdWorkspaceHeaderProps) {
    const pol = getCandidateConfig(household.politicalOrientation);
    // const color = pol.bgClass;
  return (
    <div className="rounded-lg bg-accent overflow-hidden mb-5">
      {/* Top section — avatar + info */}
      <div className="flex items-center gap-4 p-4">
        {/* Avatar with optional edit overlay */}
        <div className="flex-shrink-0">
          <div className="relative group">
            <Avatar className={`h-10 w-10 ring-2 ring-offset-1 ${pol.ringClass}`}>
              <AvatarImage src={person.profileImage} />
              <AvatarFallback className="text-lg">
                {person.name.charAt(0)}
              </AvatarFallback>
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

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-lg font-semibold leading-tight">
              {household.headOfFamily}
            </p>
            {statusBadge}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {[household.indId, household.barangay, household.cluster]
              .filter(Boolean)
              .join(" • ")}
          </p>
        </div>
        <div className="flex flex-col justify-center gap-2 mr-3">
          <Button 
            variant="outline" 
            className="h-6 rounded-sm cursor-pointer text-xs" 
            onClick={() => { /* setEditHouseholdOpen(true) */ }}
          >
            Edit Household
          </Button>
          {/* Edit Household Dialog — to be implemented with real DB + react-hook-form
            <Dialog open={editHouseholdOpen} onOpenChange={setEditHouseholdOpen}>
              ...full form...
            </Dialog>
          */}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 px-3 pb-3">
        {tabs
          .filter((t) => t.key !== activeTab)
          .map((t) => (
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

        {/* Current tab indicator — non-clickable */}
        <Badge
          variant="secondary"
          className="h-7 px-2.5 text-xs gap-1.5 rounded-md font-medium ml-auto"
        >
          {tabs.find((t) => t.key === activeTab)?.icon}
          {tabs.find((t) => t.key === activeTab)?.label}
        </Badge>
      </div>
    </div>
  );
}