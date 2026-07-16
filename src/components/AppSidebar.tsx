import {
  LayoutDashboard, Database, Map, Vote, PanelLeftClose, PanelLeft
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
// import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Data Repository", url: "/data", icon: Database },
  { title: "Political Mapping", url: "/mapping", icon: Map },
];

// const intelligenceItems = [
//   { title: "Threat Assessment", url: "/threats", icon: ShieldAlert },
//   { title: "Periodic Appraisal", url: "/appraisal", icon: ClipboardCheck },
//   { title: "Terrain Mapping", url: "/terrain", icon: Compass },
// ];

// const operationsItems = [
//   { title: "SPIN Intervention", url: "/spin", icon: Target },
//   { title: "Voter Turnout", url: "/turnout", icon: Users },
//   { title: "Quick Count", url: "/quick-count", icon: BarChart3 },
// ];

function NavGroup({ label, items, collapsed }: { label: string; items: typeof mainItems; collapsed: boolean }) {
//   const location = useLocation();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs text-[#888] uppercase tracking-wider">
        {!collapsed && label}
      </SidebarGroupLabel>
      <SidebarGroupContent> 
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                 <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white transition-colors"
                  activeClassName="bg-primary text-white hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-secondary-foreground">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Vote className="h-6 w-6 text-white shrink-0" />
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold text-white color-tracking-wide">CIVIS CORE</h2>
              <p className="text-[10px] text-white uppercase tracking-widest">Political Intelligence</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Overview" items={mainItems} collapsed={collapsed} />
        {/* <NavGroup label="Intelligence" items={intelligenceItems} collapsed={collapsed} />
        <NavGroup label="Operations" items={operationsItems} collapsed={collapsed} /> */}

        {/* Role Views */}
        {/* <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            {!collapsed && "Role Views"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                   <NavLink
                     to="/roles"
                     className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground/80 transition-colors"
                     activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                   >
                    <Shield className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Access & Roles</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 text-white hover:text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <><PanelLeftClose className="h-4 w-4" /><span className="text-xs">Collapse</span></>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
