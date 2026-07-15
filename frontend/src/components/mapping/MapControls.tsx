import { Search, Navigation, Save, ChevronDown, ChevronUp, Trash2, Info, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
// import { PRESET_LOCATIONS } from '@/lib/sampleData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SavedLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom: number;
}

interface MapControlsProps {
  onFlyTo: (lat: number, lng: number, zoom: number) => void;
  pendingCoords?: { lat: number; lng: number } | null; // Add this
  onSaveComplete?: () => void; // Add this
}
const ZOOM_LEVELS = [
  { label: 'Province', value: '9' },
  { label: 'Region', value: '11' },
  { label: 'City', value: '13' },
  { label: 'Barangay', value: '15' },
  { label: 'Streets', value: '18' },
];

const getZoomLabel = (zoomValue: number): string => {
  const zoomLevel = ZOOM_LEVELS.find(z => Number(z.value) === zoomValue);
  return zoomLevel?.label || `${zoomValue}`;
};

const STORAGE_KEY = 'map-saved-locations';

const loadSaved = (): SavedLocation[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const MapControls = ({ onFlyTo, pendingCoords, onSaveComplete }: MapControlsProps) => {
  const [latInput, setLatInput] = useState('');
  const [lngInput, setLngInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [zoomLevel, setZoomLevel] = useState('13');
  const [collapsed, setCollapsed] = useState(false);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(loadSaved);
  const [showSaved, setShowSaved] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [editingLocationName, setEditingLocationName] = useState('');

  const persist = (locs: SavedLocation[]) => {
    setSavedLocations(locs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(locs));
  };

  const handleGo = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      onFlyTo(lat, lng, parseInt(zoomLevel));
    }
  };

  useEffect(() => {
    if (pendingCoords) {
      setLatInput(pendingCoords.lat.toString());
      setLngInput(pendingCoords.lng.toString());
      // Optionally focus the name input after a short delay
      setTimeout(() => {
        const nameInputEl = document.querySelector('input[placeholder="Name (optional)"]') as HTMLInputElement;
        nameInputEl?.focus();
      }, 100);
    }
  }, [pendingCoords]);

  // Modify handleSave to notify parent
  const handleSave = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      const loc: SavedLocation = {
        id: crypto.randomUUID(),
        name: nameInput.trim() || `${lat.toFixed(2)}, ${lng.toFixed(2)}`,
        lat,
        lng,
        zoom: parseInt(zoomLevel),
      };
      persist([...savedLocations, loc]);
      setNameInput('');
      
      // Notify parent that save is complete
      onSaveComplete?.();
    }
  };

  const handleDeleteSaved = (id: string) => {
    persist(savedLocations.filter((l) => l.id !== id));
  };

  const handleEditLocationName = (id: string, newName: string) => {
    const updatedLocations = savedLocations.map(loc => 
      loc.id === id ? { ...loc, name: newName } : loc
    );
    persist(updatedLocations);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleGo();
  };

  if (collapsed) {
    return (
      <div className="absolute top-4 left-4 panel-glass w-10 h-10">
        <button
          onClick={() => setCollapsed(false)}
          className="w-full h-full flex items-center shadow-md justify-center text-primary"
          title="Open navigation"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    );
  }
  

  return (
    <div className={` panel-glass p-3 w-auto`}>
      {/* Coordinate input */}
      <div className="flex flex-col gap-1.5 mb-3 pb-3 border-b border-border">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="lat" className="text-xs text-muted-foreground">Latitude</label>
            <input
              id="lat"
              type="text"
              placeholder="Lat"
              value={latInput}
              onChange={(e) => setLatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 px-2 py-1 text-xs rounded-sm bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="lng" className="text-xs text-muted-foreground">Longitude</label>
            <input
              id="lng"
              type="text"
              placeholder="Lng"
              value={lngInput}
              onChange={(e) => setLngInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-0 px-2 py-1 text-xs rounded-sm bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary font-mono"
            />
          </div>
        </div>

        {/* Zoom level selector */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <label htmlFor="zoom" className="text-xs text-muted-foreground">
              Zoom Level
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="right" className="w-[180px] z-[2000]">
                  <p className="text-[10px]">Select an option for the scope of how much the map will zoom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <Select value={zoomLevel} onValueChange={setZoomLevel}>
            <SelectTrigger id="zoom" className="w-full h-7 text-xs bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              {ZOOM_LEVELS.map((z) => (
                <SelectItem key={z.value} value={z.value} className="text-xs">
                  {z.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        

        <button
          onClick={handleGo}
          className="flex items-center justify-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Navigation className="w-3 h-3" />
          Go to Location
        </button>

        {/* Save input */}
        <div className="flex gap-1.5 mt-1">
          <input
            type="text"
            placeholder="Name (optional)"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="flex-1 min-w-0 px-2 py-1 text-xs rounded-sm bg-secondary text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={() => {
              handleSave();
              setLatInput("");
              setLngInput("");
              setZoomLevel(zoomLevel);
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs rounded-sm bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
            title="Save location"
          >
            <Save className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Saved locations */}
      {savedLocations.length > 0 && (
        <div className="border-border max-h-[204px] overflow-y-auto">
          <button
            onClick={() => setShowSaved((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-0 hover:text-foreground transition-colors w-full"
          >
            <Save className="w-3 h-3" />
            <span>Saved ({savedLocations.length})</span>
            {showSaved ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
          </button>
          {showSaved && (
            <div className="flex flex-col gap-1 mt-2">
              {savedLocations.map((loc) => {
                const isEditing = editingLocationId === loc.id;
                
                const handleStartEdit = () => {
                  setEditingLocationId(loc.id);
                  setEditingLocationName(loc.name);
                };
                
                const handleSaveEdit = () => {
                  if (editingLocationName.trim() && editingLocationName !== loc.name) {
                    handleEditLocationName(loc.id, editingLocationName.trim());
                  }
                  setEditingLocationId(null);
                  setEditingLocationName('');
                };
                
                const handleKeyDown = (e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit();
                  } else if (e.key === 'Escape') {
                    setEditingLocationId(null);
                    setEditingLocationName('');
                  }
                };
                
                return (
                  <div key={loc.id} className="flex items-center justify-between p-1.5 rounded border border-border hover:bg-accent transition-colors group">
                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-1">
                        <input
                          type="text"
                          value={editingLocationName}
                          onChange={(e) => setEditingLocationName(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          className="flex-1 text-xs font-medium bg-background border border-border rounded px-1.5 py-0.5 focus:outline-none focus:border-primary"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => onFlyTo(loc.lat, loc.lng, loc.zoom)}
                        className="flex-1 text-left"
                      >
                        <p className="text-xs font-medium">{loc.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono tabular-nums">
                          {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)} • {getZoomLabel(loc.zoom)}
                        </p>
                      </button>
                    )}
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!isEditing && (
                        <button
                          onClick={handleStartEdit}
                          className="p-1 text-muted-foreground hover:text-primary rounded"
                          title="Edit name"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSaved(loc.id)}
                        className="p-1 text-destructive/60 hover:text-destructive rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapControls;
