import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  "Validated": "bg-success/20 text-success border-success/30",
  "Active": "bg-success/20 text-success border-success/30",
  "Completed": "bg-success/20 text-success border-success/30",
  "Read": "bg-muted text-muted-foreground border-border",
  "Unread": "bg-primary/20 text-primary border-primary/30 font-semibold",
  "Pending": "bg-warning/20 text-warning border-warning/30",
  "In Progress": "bg-info/20 text-info border-info/30",
  "Scheduled": "bg-muted text-muted-foreground border-border",
  "Rejected": "bg-destructive/20 text-destructive border-destructive/30",
  "Inactive": "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn(statusColors[status] || "bg-muted text-muted-foreground")}>
      {status}
    </Badge>
  );
}
