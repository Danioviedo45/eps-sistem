import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, FileText, User, LogOut } from "lucide-react"

export function PacienteNavbar({ activeItem = "dashboard" }) {
  const navItems = [
    {
      title: "Panel",
      href: "/paciente/dashboard",
      icon: LayoutDashboard,
      active: activeItem === "dashboard",
    },
    {
      title: "Agendar Cita",
      href: "/paciente/agendar-cita",
      icon: Calendar,
      active: activeItem === "agendar",
    },
    {
      title: "Mis Consultas",
      href: "/paciente/dashboard?tab=consultations",
      icon: FileText,
      active: activeItem === "historial",
    },
    {
      title: "Mi Perfil",
      href: "/paciente/perfil",
      icon: User,
      active: activeItem === "perfil",
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
