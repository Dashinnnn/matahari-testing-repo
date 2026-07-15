import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const severityColors: Record<string, string> = {
  "Low": "bg-success/20 text-success border-success/30",
  "Medium": "bg-warning/20 text-warning border-warning/30",
  "High": "bg-destructive/20 text-destructive border-destructive/30",
  "Critical": "bg-destructive text-destructive-foreground border-destructive hover:bg-destructive/80",
};

export function SeverityBadge({ severity }: { severity: string }) {
  return (
    <Badge variant="outline" className={cn(severityColors[severity])}>
      {severity}
    </Badge>
  );
}
