"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DoctorNavbar } from "@/components/doctor-navbar"

export function DoctorHeader() {
  const [doctorNombre, setDoctorNombre] = useState("Doctor")
  const [doctorEspecialidad, setDoctorEspecialidad] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const usuarioGuardado = localStorage.getItem("usuarioEPS")
      if (usuarioGuardado) {
        try {
          const usuario = JSON.parse(usuarioGuardado)
          if (usuario.nombre) {
            setDoctorNombre(usuario.nombre)
          }
          if (usuario.especialidad) {
            setDoctorEspecialidad(usuario.especialidad)
          } else {
            // Buscar la especialidad en los datos de doctores si no está en el usuario
            const doctoresGuardados = localStorage.getItem("doctoresEPS")
            if (doctoresGuardados) {
              const doctores = JSON.parse(doctoresGuardados)
              const doctorEncontrado = doctores.find((d) => d && d.usuario === usuario.usuario)
              if (doctorEncontrado && doctorEncontrado.especialidad) {
                setDoctorEspecialidad(doctorEncontrado.especialidad)
              }
            }
          }
        } catch (error) {
          console.error("Error al cargar nombre del doctor:", error)
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
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">{doctorNombre}</span>
            {doctorEspecialidad && <span className="text-xs text-muted-foreground">{doctorEspecialidad}</span>}
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
                <DoctorNavbar />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
