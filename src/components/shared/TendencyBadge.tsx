import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PoliticalTendency } from "@/data/mockData";

const tendencyColors: Record<PoliticalTendency, string> = {
  "Strong Support": "bg-success text-success-foreground hover:bg-success/80",
  "Leaning": "bg-info text-info-foreground hover:bg-info/80",
  "Undecided": "bg-warning text-warning-foreground hover:bg-warning/80",
  "Opposed": "bg-destructive text-destructive-foreground hover:bg-destructive/80",
};

export function TendencyBadge({ tendency }: { tendency: PoliticalTendency }) {
  return (
    <Badge className={cn("border-0", tendencyColors[tendency])}>
      {tendency}
    </Badge>
  );
}
