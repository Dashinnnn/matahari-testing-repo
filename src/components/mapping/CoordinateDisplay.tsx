import { Copy, Check, X, Save} from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface CoordinateDisplayProps {
  lat: number;
  lng: number;
  zoom: number;
  dblClickCoords: { lat: number; lng: number } | null;
  onClearDblClick: () => void;
  onSaveCoords?: (coords: { lat: number; lng: number }) => void;
  onSaveComplete?: () => void;
}

const CoordinateDisplay = ({ lat, lng, zoom, dblClickCoords, onClearDblClick, onSaveCoords, onSaveComplete }: CoordinateDisplayProps) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="absolute bottom-6 left-4 z-[1000] flex flex-col gap-2">
      {/* Double-click coordinates */}
      {dblClickCoords && (
        <div className="panel-glass px-3 py-2 bg-card border border-border rounded-lg p-3 shadow-lg w-64">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium text-primary">Double-clicked</span>
            <button onClick={onClearDblClick} className="p-0.5 text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-1">
              <span className="text-foreground">{dblClickCoords.lat.toFixed(6)}</span>°
              <button
                onClick={() => handleCopy(dblClickCoords.lat.toFixed(6), 'dblLat')}
                className="p-0.5 text-muted-foreground hover:text-primary transition-colors"
                title="Copy latitude"
              >
                {copiedField === 'dblLat' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-foreground">{dblClickCoords.lng.toFixed(6)}</span>°
              <button
                onClick={() => handleCopy(dblClickCoords.lng.toFixed(6), 'dblLng')}
                className="p-0.5 text-muted-foreground hover:text-primary transition-colors"
                title="Copy longitude"
              >
                {copiedField === 'dblLng' ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <div className="flex gap-1.5 mt-3">
            <Button size="sm" variant="outline" className="h-7 w-auto text-xs flex-1" onClick={() => {
                onSaveCoords?.(dblClickCoords);
                onSaveComplete?.(); 
                onClearDblClick();
              }}>
                <Save className="h-3 w-3 mr-1" /> Save
            </Button>
          </div>
        </div>
      )}

      {/* Center coordinates */}
      {/* <div className="panel-glass px-3 py-2">
        <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
          <span>
            <span className="text-foreground">{lat.toFixed(4)}</span>° N
          </span>
          <span>
            <span className="text-foreground">{lng.toFixed(4)}</span>° E
          </span>
          <span>
            z<span className="text-foreground">{zoom}</span>
          </span>
        </div>
      </div> */}
    </div>
  );
};

export default CoordinateDisplay;
