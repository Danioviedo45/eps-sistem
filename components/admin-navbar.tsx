import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LogOut } from "lucide-react"

export function AdminNavbar({ activeItem = "dashboard" }) {
  const navItems = [
    {
      title: "Panel",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      active: activeItem === "dashboard",
    },
  ]

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant={item.active ? "secondary" : "ghost"} className="w-full justify-start">
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
        <Link href="/login">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </Link>
      </div>
    </div>
  )
}
