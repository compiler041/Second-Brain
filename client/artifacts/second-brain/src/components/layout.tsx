import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, CheckSquare, FileText, Twitter,
  Youtube, Tags, User, LogOut, Menu, BrainCircuit, Moon, Sun, X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth-wrapper";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "text-violet-500" },
  { href: "/tasks", label: "Tasks", icon: CheckSquare, color: "text-blue-500" },
  { href: "/notes", label: "Notes", icon: FileText, color: "text-emerald-500" },
  { href: "/tweets", label: "Tweets", icon: Twitter, color: "text-sky-500" },
  { href: "/videos", label: "Videos", icon: Youtube, color: "text-red-500" },
  { href: "/tags-favorites", label: "Tags & Favorites", icon: Tags, color: "text-amber-500" },
  { href: "/account", label: "Account", icon: User, color: "text-pink-500" },
];

function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  }
  return (
    <button
      onClick={toggle}
      className={`rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all ${compact ? "p-1.5" : "p-2"}`}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className={compact ? "w-4 h-4" : "w-[18px] h-[18px]"} /> : <Moon className={compact ? "w-4 h-4" : "w-[18px] h-[18px]"} />}
    </button>
  );
}

function NavItem({ href, label, icon: Icon, color, active, onClick }: {
  href: string; label: string; icon: React.ElementType; color: string; active: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-[13.5px] font-medium
        ${active
          ? "bg-primary/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
        }
      `}
    >
      <div className={`p-1.5 rounded-lg transition-colors ${active ? "bg-primary/15" : "bg-secondary group-hover:bg-secondary/0"}`}>
        <Icon className={`w-4 h-4 ${active ? "text-primary" : color} transition-colors`} />
      </div>
      {label}
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
    </Link>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "SB";

  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-2 py-4 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl" style={{ background: "linear-gradient(135deg, hsl(262 83% 52%), hsl(262 83% 68%))" }}>
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base text-foreground tracking-tight">SecondBrain</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 mb-2 mt-1">Navigation</p>
        {NAV_ITEMS.map(item => (
          <NavItem
            key={item.href}
            {...item}
            active={location === item.href}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-2 pt-4 pb-2 border-t border-border/60 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/50">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback
              className="text-white text-xs font-bold"
              style={{ background: "linear-gradient(135deg, hsl(262 83% 52%), hsl(300 70% 55%))" }}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground truncate">{user?.username || "User"}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
          </div>
          <ThemeToggle compact />
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] h-screen fixed top-0 left-0 border-r border-border/60 bg-sidebar/80 backdrop-blur-xl z-40">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-card/90 backdrop-blur-xl border-b border-border/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ background: "linear-gradient(135deg, hsl(262 83% 52%), hsl(262 83% 68%))" }}>
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">SecondBrain</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle compact />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0 bg-card">
              <div className="h-full p-3">
                <SidebarContent onClose={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-[240px] min-h-screen">
        <div className="pt-14 md:pt-0">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
