import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserRound, CalendarCheck, Stethoscope, ShieldCheck } from "lucide-react"
import banner from "../public/banner.png";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">EPS Salud</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
            <Link href="/signup">
              <Button>Registrarse</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Sistema de Gestión de Citas Médicas
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Gestione sus citas médicas de manera eficiente. Pacientes pueden agendar citas con doctores
                  disponibles y doctores pueden administrar su agenda.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/signup">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      Registrarse
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                      Iniciar Sesión
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="banner.png"
                  alt="Sistema EPS"
                  className="rounded-lg object-cover"
                  width={400}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Características Principales
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Nuestro sistema ofrece una experiencia completa para pacientes y doctores.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <UserRound className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Gestión de Usuarios</h3>
                <p className="text-center text-muted-foreground">
                  Registro y autenticación para pacientes, doctores y administradores.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <CalendarCheck className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Agenda de Citas</h3>
                <p className="text-center text-muted-foreground">
                  Programación de citas médicas con disponibilidad en tiempo real.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Stethoscope className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-bold">Historial Médico</h3>
                <p className="text-center text-muted-foreground">
                  Acceso a historial clínico y registro de consultas médicas.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-white py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="font-semibold">EPS Salud</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">© 2025 EPS Salud. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
