import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Twitter, 
  Youtube, 
  Tags, 
  User, 
  LogOut,
  Menu,
  BrainCircuit
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth-wrapper";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/tweets", label: "Tweets", icon: Twitter },
  { href: "/videos", label: "Videos", icon: Youtube },
  { href: "/tags-favorites", label: "Tags & Favs", icon: Tags },
  { href: "/account", label: "Account", icon: User },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout.mutate(undefined);
  };

  const NavLinks = () => (
    <div className="flex flex-col gap-2 w-full">
      {NAV_ITEMS.map((item) => {
        const isActive = location === item.href;
        const Icon = item.icon;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
              ${isActive 
                ? "bg-primary/10 text-primary font-semibold" 
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }
            `}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-primary">
          <BrainCircuit className="w-6 h-6" />
          <span className="font-display font-bold text-lg text-foreground">SecondBrain</span>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] bg-card border-r border-border p-6 flex flex-col">
            <div className="flex items-center gap-2 text-primary mb-8 mt-2">
              <BrainCircuit className="w-8 h-8" />
              <span className="font-display font-bold text-xl text-foreground">SecondBrain</span>
            </div>
            <div className="flex-1">
              <NavLinks />
            </div>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </SheetContent>
        </Sheet>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[280px] h-screen fixed top-0 left-0 border-r border-border bg-card/30 backdrop-blur-xl p-6 z-40">
        <div className="flex items-center gap-3 text-primary mb-10 pl-2">
          <div className="p-2 bg-primary/10 rounded-xl">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl text-foreground tracking-tight">SecondBrain</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto">
          <NavLinks />
        </nav>

        <div className="pt-6 border-t border-border mt-auto">
          <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-secondary/50 rounded-xl border border-border/50">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-semibold truncate">{user?.username}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl" 
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            <LogOut className="w-5 h-5 mr-3" />
            {logout.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-[280px] p-4 md:p-8 lg:p-10 animate-fade-in overflow-x-hidden min-h-screen">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
