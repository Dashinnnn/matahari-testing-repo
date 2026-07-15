import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation, ChevronUp, ChevronDown } from "lucide-react";

import MapControls from "../components/mapping/MapControls";
import LeafletMap from "../components/mapping/LeafletMap";
import { PinHouseholdPanel } from "../components/mapping/PinHouseholdPanel";
import { MapLayerControl } from "../components/mapping/MapLayerControl";
import { type HouseholdWorkspaceTab } from "@/pages/components/HouseholdWorkspaceHeader";
import { HouseholdWorkspace } from "../components/shared/HouseholdWorkspace";
import { type HouseholdFilters } from "../components/data-repository/HouseholdFilterBar";

import { type Household, type Person } from "@/data/mockData";

export default function PoliticalMapping() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [householdFilters, setHouseholdFilters] = useState<HouseholdFilters>({
    search: "", barangay: null, cluster: null
  });

  const [navOpen, setNavOpen] = useState(true);
  const [flyToTarget, setFlyToTarget] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [pendingMapCoords, setPendingMapCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeLayer, setActiveLayer] = useState<"households" | "threats" | "appraisal">("households");
  const [layersOpen, setLayersOpen] = useState(true);

  // ── workspace ──────────────────────────────────────────────────────────────
  // HouseholdWorkspace owns its own tab/person navigation history internally
  // (including the back button). The page only needs to tell it which
  // household/person/tab to open with.
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [selectedHH, setSelectedHH] = useState<Household | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [initialTab, setInitialTab] = useState<HouseholdWorkspaceTab>("profile");

  const [focusRequest, setFocusRequest] = useState<{ householdId: string; nonce: number } | null>(null);

  const openWorkspace = useCallback((
    household: Household,
    tab: HouseholdWorkspaceTab = "profile",
    person?: Person
  ) => {
    setSelectedHH(household);
    setSelectedPerson(person ?? null);
    setInitialTab(tab);
    setWorkspaceOpen(true);
  }, []); // no external deps — it only calls setters, which are always stable

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const householdId = searchParams.get("householdId");

    let handled = false;

    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      if (!isNaN(latNum) && !isNaN(lngNum)) {
        setFlyToTarget({ lat: latNum, lng: lngNum, zoom: 19 });
        handled = true;
      }
    }

    if (householdId) {
      setFocusRequest({ householdId, nonce: Date.now() });
      setActiveLayer("households");
      handled = true;
    }

    if (handled) {
      // Consume the URL params so a refresh/back-nav doesn't replay this
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  return (
    <div>
      <PageHeader title="Political Mapping" subtitle="Geotagged household distribution and geospatial analytics" />

      {/* Household Panel */}
      <Card className="border border-border shadow-sm mt-4 mb-4">
        <PinHouseholdPanel
          onFocusPin={(lat, lng, householdId) => {
            setFocusRequest({ householdId, nonce: Date.now() });
            setFlyToTarget({ lat, lng, zoom: 20 });
          }}
          onSwitchToHouseholds={() => setActiveLayer("households")}
          onFiltersChange={setHouseholdFilters}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        {/* LEFT SIDEBAR */}
        <div className="space-y-3 order-2 lg:order-1">

          {/* Navigate Panel */}
          <Card className="border border-border shadow-sm">
            <CardHeader className="px-3 pt-0 pb-0 cursor-pointer" onClick={() => setNavOpen(!navOpen)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                  <Navigation className="h-3.5 w-3.5 text-primary" /> Navigate
                </CardTitle>
                {navOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </div>
            </CardHeader>
            {navOpen && (
              <MapControls
                onFlyTo={(lat, lng, zoom) => setFlyToTarget({ lat, lng, zoom })}
                pendingCoords={pendingMapCoords}
                onSaveComplete={() => setPendingMapCoords(null)}
              />
            )}
          </Card>

          {/* Map Layers Panel */}
          <MapLayerControl
            activeLayer={activeLayer}
            onLayerChange={setActiveLayer}
            open={layersOpen}
            onOpenChange={setLayersOpen}
          />

        </div>

        {/* MAP */}
        <div className="relative order-1 lg:order-2">
          <LeafletMap
            flyToTarget={flyToTarget}
            onFlyToDone={() => setFlyToTarget(null)}
            onSaveCoordinates={(coords) => {
              setPendingMapCoords(coords);
              setNavOpen(true);
            }}
            activeLayer={activeLayer}
            onRequestLayer={setActiveLayer}
            filters={householdFilters}
            openWorkspace={openWorkspace}
            focusRequest={focusRequest}
            onFocusHandled={() => setFocusRequest(null)}
          />

          <HouseholdWorkspace
            open={workspaceOpen}
            household={selectedHH}
            initialPerson={selectedPerson}
            initialTab={initialTab}
            onClose={() => setWorkspaceOpen(false)}
          />
        </div>
      </div>
    </div>
  );
}