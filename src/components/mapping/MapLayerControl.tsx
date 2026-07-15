// components/mapping/MapLayerControl.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Layers, AlertTriangle, ClipboardList, MapPin, ChevronUp, ChevronDown } from "lucide-react";

type LayerKey = "households" | "threats" | "appraisal";

interface MapLayerControlProps {
  activeLayer: LayerKey;
  onLayerChange: (layer: LayerKey) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LAYER_OPTIONS = [
  { key: "households" as const, label: "Household Pins", icon: <MapPin className="h-3.5 w-3.5 text-primary" /> },
  { key: "threats" as const, label: "Threat Assessments", icon: <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> },
  { key: "appraisal" as const, label: "Periodic Appraisal", icon: <ClipboardList className="h-3.5 w-3.5 text-blue-500" /> },
];

export const MapLayerControl = ({ activeLayer, onLayerChange, open, onOpenChange }: MapLayerControlProps) => {
  return (
    <Card className="border border-border py-2 shadow-lg bg-card/95 backdrop-blur-sm">
      <Collapsible open={open} onOpenChange={onOpenChange}>
        <CollapsibleTrigger asChild>
          <CardHeader className="p-3 pb-2 cursor-pointer">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" /> Map Layers
              </CardTitle>
              {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="p-3 pt-0 space-y-2">
            {LAYER_OPTIONS.map(opt => (
              <button
                key={opt.key}
                onClick={() => onLayerChange(opt.key)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors ${
                  activeLayer === opt.key
                    ? "bg-primary/10 text-foreground font-medium ring-1 ring-primary/40"
                    : "hover:bg-accent text-muted-foreground"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${activeLayer === opt.key ? "bg-primary" : "bg-muted-foreground/30"}`} />
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};