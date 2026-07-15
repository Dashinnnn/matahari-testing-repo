import { useState } from "react";
import { PageHeader } from "../components/shared/PageHeader";
import { StatCard } from "../components/shared/StatCard";
import { StatusBadge } from "../components/shared/StatusBadge";
import { SeverityBadge } from "../components/shared/SeverityBadge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { households, koboSubmissions, threatIndicators, persons } from "@/data/mockData";
import { Home, Target, FileText, Compass, AlertTriangle, Users, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [spinAssignOpen, setSpinAssignOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [terrainOpen, setTerrainOpen] = useState(false);
  const [alertDetailOpen, setAlertDetailOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<typeof threatIndicators[0] | null>(null);

  const totalHouseholds = households.length;
  const totalClusters = 5;
  const activePrograms = 8;
  const turnoutProjection = "76.2%";

  const getPersonName = (personId: string) => {
    const p = persons.find(p => p.id === personId);
    return p ? `${p.firstName} ${p.lastName}` : personId;
  };

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="System overview — Last updated: March 17, 2026">
        <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </PageHeader>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Households" value={totalHouseholds} trend={5} icon={<Home className="h-4 w-4" />} />
        <StatCard label="Clusters" value={totalClusters} icon={<Users className="h-4 w-4" />} />
        <StatCard label="Active Programs" value={activePrograms} trend={2} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Turnout Projection" value={turnoutProjection} trend={3} icon={<Target className="h-4 w-4" />} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1" onClick={() => setSpinAssignOpen(true)}>
          <Target className="h-4 w-4" />
          <span className="text-xs">SPIN Assign</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1" onClick={() => setReportOpen(true)}>
          <FileText className="h-4 w-4" />
          <span className="text-xs">Generate Report</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-1" onClick={() => setTerrainOpen(true)}>
          <Compass className="h-4 w-4" />
          <span className="text-xs">Terrain Map</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Submissions */}
        <Card className="lg:col-span-2 border border-border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent KoboToolBox Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Household</TableHead>
                  <TableHead>Submitter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {koboSubmissions.slice(0, 7).map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs tabular-nums">{s.id}</TableCell>
                    <TableCell className="font-mono text-xs">{s.householdId}</TableCell>
                    <TableCell className="text-sm">{s.submitter}</TableCell>
                    <TableCell className="text-sm tabular-nums">{s.date}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Priority Alerts */}
        <Card className="border border-border shadow-xs">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Priority Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {threatIndicators.filter(t => t.severity === "Critical" || t.severity === "High").map((t) => (
              <button
                key={t.id}
                className="w-full text-left p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                onClick={() => { setSelectedAlert(t); setAlertDetailOpen(true); }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">{getPersonName(t.personId)}</span>
                  <SeverityBadge severity={t.severity} />
                </div>
                <p className="text-sm line-clamp-2">{t.description}</p>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* SPIN Assign Modal */}
      <Dialog open={spinAssignOpen} onOpenChange={setSpinAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign SPIN Intervention</DialogTitle>
            <DialogDescription>Assign an engagement strategy to priority households.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Household</Label><Select><SelectTrigger><SelectValue placeholder="Select household" /></SelectTrigger><SelectContent>{households.map(h => <SelectItem key={h.id} value={h.id}>{h.id} — {h.headOfFamily}</SelectItem>)}</SelectContent></Select></div>
            <div><Label>Strategy</Label><Select><SelectTrigger><SelectValue placeholder="Select strategy" /></SelectTrigger><SelectContent><SelectItem value="dialogue">Community Dialogue</SelectItem><SelectItem value="welfare">Welfare Enrollment Support</SelectItem><SelectItem value="info">Information Campaign</SelectItem><SelectItem value="leadership">Leadership Engagement</SelectItem></SelectContent></Select></div>
            <div><Label>Priority</Label><Select><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger><SelectContent><SelectItem value="critical">Critical</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setSpinAssignOpen(false)}>Cancel</Button><Button onClick={() => setSpinAssignOpen(false)}>Assign</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Report Modal */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>Select report parameters to generate.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Report Type</Label><Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="terrain">Political Terrain Report</SelectItem><SelectItem value="threat">Threat Assessment Summary</SelectItem><SelectItem value="appraisal">Periodic Appraisal Report</SelectItem><SelectItem value="turnout">Voter Turnout Report</SelectItem></SelectContent></Select></div>
            <div><Label>Scope</Label><Select><SelectTrigger><SelectValue placeholder="Select scope" /></SelectTrigger><SelectContent><SelectItem value="all">All Clusters</SelectItem><SelectItem value="c1">Cluster 1</SelectItem><SelectItem value="c2">Cluster 2</SelectItem><SelectItem value="c3">Cluster 3</SelectItem><SelectItem value="c4">Cluster 4</SelectItem><SelectItem value="c5">Cluster 5</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-4"><div><Label>From Date</Label><Input type="date" defaultValue="2026-03-01" /></div><div><Label>To Date</Label><Input type="date" defaultValue="2026-03-17" /></div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setReportOpen(false)}>Cancel</Button><Button onClick={() => setReportOpen(false)}>Generate</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terrain Map Quick View Modal */}
      <Dialog open={terrainOpen} onOpenChange={setTerrainOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Political Terrain Overview</DialogTitle>
            <DialogDescription>Quick summary of the current political landscape.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Strong Support", value: "33%", color: "bg-success" },
              { label: "Leaning", value: "25%", color: "bg-info" },
              { label: "Undecided", value: "17%", color: "bg-warning" },
              { label: "Opposed", value: "25%", color: "bg-destructive" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <p className="text-2xl font-bold tabular-nums">{item.value}</p>
              </div>
            ))}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setTerrainOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert Detail Modal */}
      <Dialog open={alertDetailOpen} onOpenChange={setAlertDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Threat Detail — {selectedAlert?.id}</DialogTitle>
            <DialogDescription>{selectedAlert ? getPersonName(selectedAlert.personId) : ""} • {selectedAlert?.type}</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">Severity:</span><SeverityBadge severity={selectedAlert.severity} /></div>
              <div><span className="text-sm text-muted-foreground">Description:</span><p className="text-sm mt-1">{selectedAlert.description}</p></div>
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-sm text-muted-foreground">Frequency:</span><p className="text-sm font-medium tabular-nums">{selectedAlert.frequency} incidents</p></div>
                <div><span className="text-sm text-muted-foreground">Date Reported:</span><p className="text-sm tabular-nums">{selectedAlert.dateReported}</p></div>
              </div>
              <div><span className="text-sm text-muted-foreground">Household:</span><p className="text-sm font-mono">{selectedAlert.householdId}</p></div>
              <div><span className="text-sm text-muted-foreground">Reported By:</span><p className="text-sm">{selectedAlert.reportedBy}</p></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setAlertDetailOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
