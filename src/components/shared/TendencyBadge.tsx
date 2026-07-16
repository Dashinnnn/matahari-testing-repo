import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PoliticalTendency } from "@/data/mockData";

const tendencyColors: Record<PoliticalTendency, string> = {
  "Pro-Administration": "bg-success text-success-foreground hover:bg-success/80",
  "Leaning Administration": "bg-info text-info-foreground hover:bg-info/80",
  "Neutral": "bg-warning text-warning-foreground hover:bg-warning/80",
  "Leaning Opposition": "bg-destructive/80 text-destructive-foreground hover:bg-destructive/60",
  "Opposition": "bg-destructive text-destructive-foreground hover:bg-destructive/80",
};

export function TendencyBadge({ tendency }: { tendency: PoliticalTendency }) {
  return (
    <Badge className={cn("border-0", tendencyColors[tendency])}>
      {tendency}
    </Badge>
  );
}
