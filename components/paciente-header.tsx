"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { PacienteNavbar } from "@/components/paciente-navbar"

export function PacienteHeader() {
  const [pacienteNombre, setPacienteNombre] = useState("Paciente")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const usuarioGuardado = localStorage.getItem("usuarioEPS")
      if (usuarioGuardado) {
        try {
          const usuario = JSON.parse(usuarioGuardado)
          if (usuario.nombre) {
            setPacienteNombre(usuario.nombre)
          }
        } catch (error) {
          console.error("Error al cargar nombre del paciente:", error)
        }
      }
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">EPS Salud</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            <span className="text-sm font-medium">{pacienteNombre}</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="py-4">
                <div className="px-4 mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold">EPS Salud</span>
                </div>
                <PacienteNavbar />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
