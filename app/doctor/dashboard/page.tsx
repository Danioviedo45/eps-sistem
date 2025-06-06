"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarCheck, Users, Clock, FileText } from "lucide-react"
import { DoctorNavbar } from "@/components/doctor-navbar"
import { DoctorHeader } from "@/components/doctor-header"
import Link from "next/link"

export default function DoctorDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState("today")
  const [selectedHistorial, setSelectedHistorial] = useState(null)
  const [showHistorialModal, setShowHistorialModal] = useState(false)
  const [citasHoy, setCitasHoy] = useState([])
  const [proximasCitas, setProximasCitas] = useState([])
  const [pacientesRegistrados, setPacientesRegistrados] = useState([])
  const [doctorActual, setDoctorActual] = useState(null)
  const [dataCargada, setDataCargada] = useState(false)
  const [historialMedico, setHistorialMedico] = useState([])

  // Modificar la carga de datos del doctor para usar directamente la información guardada en el login
  useEffect(() => {
    if (typeof window !== "undefined" && !dataCargada) {
      console.log("Cargando datos iniciales (Doctor Dashboard)")

      // Cargar usuario actual (doctor)
      const usuarioGuardado = localStorage.getItem("usuarioEPS")
      if (usuarioGuardado) {
        try {
          const usuario = JSON.parse(usuarioGuardado)
          console.log("Usuario actual:", usuario)
          setDoctorActual(usuario)
        } catch (error) {
          console.error("Error al cargar usuario actual:", error)
        }
      }

      // Cargar pacientes
      const pacientesGuardados = localStorage.getItem("pacientesEPS")
      if (pacientesGuardados) {
        try {
          const pacientes = JSON.parse(pacientesGuardados)
          setPacientesRegistrados(pacientes)
          console.log("Pacientes cargados:", pacientes)
        } catch (error) {
          console.error("Error al cargar pacientes:", error)
          // Datos por defecto
          const pacientesPorDefecto = [
            {
              id: 1,
              nombre: "Carlos González",
              cedula: "1234567890",
              edad: 35,
              genero: "Masculino",
              telefono: "3001234567",
              direccion: "Calle 123 #45-67",
              usuario: "paciente1",
            },
            {
              id: 2,
              nombre: "Laura Martínez",
              cedula: "0987654321",
              edad: 28,
              genero: "Femenino",
              telefono: "3009876543",
              direccion: "Avenida 456 #78-90",
              usuario: "paciente2",
            },
          ]
          setPacientesRegistrados(pacientesPorDefecto)
        }
      }

      // Cargar historial médico
      const historialGuardado = localStorage.getItem("historialMedicoEPS")
      if (historialGuardado) {
        try {
          const historial = JSON.parse(historialGuardado)
          setHistorialMedico(historial)
          console.log("Historial médico cargado:", historial)
        } catch (error) {
          console.error("Error al cargar historial médico:", error)
          // Datos por defecto solo para el paciente 1 (paciente existente)
          const historialPorDefecto = [
            {
              id: 101,
              pacienteId: 1,
              fecha: "2025-04-10",
              doctor: "Dr. Juan Pérez",
              especialidad: "Medicina General",
              diagnostico: "Gripe estacional",
              tratamiento: "Acetaminofén 500mg cada 8 horas por 5 días. Reposo y abundantes líquidos.",
              observaciones: "Paciente presenta fiebre de 38.5°C, dolor de garganta y congestión nasal.",
            },
            {
              id: 102,
              pacienteId: 1,
              fecha: "2025-03-15",
              doctor: "Dra. Ana Martínez",
              especialidad: "Dermatología",
              diagnostico: "Dermatitis",
              tratamiento: "Crema de hidrocortisona al 1% dos veces al día por 7 días.",
              observaciones: "Erupción cutánea en brazos y cuello. Se recomienda evitar alérgenos conocidos.",
            },
          ]
          setHistorialMedico(historialPorDefecto)
          localStorage.setItem("historialMedicoEPS", JSON.stringify(historialPorDefecto))
        }
      } else {
        // Datos por defecto solo para el paciente 1 (paciente existente)
        const historialPorDefecto = [
          {
            id: 101,
            pacienteId: 1,
            fecha: "2025-04-10",
            doctor: "Dr. Juan Pérez",
            especialidad: "Medicina General",
            diagnostico: "Gripe estacional",
            tratamiento: "Acetaminofén 500mg cada 8 horas por 5 días. Reposo y abundantes líquidos.",
            observaciones: "Paciente presenta fiebre de 38.5°C, dolor de garganta y congestión nasal.",
          },
          {
            id: 102,
            pacienteId: 1,
            fecha: "2025-03-15",
            doctor: "Dra. Ana Martínez",
            especialidad: "Dermatología",
            diagnostico: "Dermatitis",
            tratamiento: "Crema de hidrocortisona al 1% dos veces al día por 7 días.",
            observaciones: "Erupción cutánea en brazos y cuello. Se recomienda evitar alérgenos conocidos.",
          },
        ]
        setHistorialMedico(historialPorDefecto)
        localStorage.setItem("historialMedicoEPS", JSON.stringify(historialPorDefecto))
      }

      setDataCargada(true)
    }
  }, [dataCargada])

  // Cargar citas cuando cambian los datos
  useEffect(() => {
    if (dataCargada && doctorActual) {
      console.log("Cargando citas para el doctor:", doctorActual)
      const hoy = format(new Date(), "yyyy-MM-dd")

      // Cargar citas
      const citasGuardadas = localStorage.getItem("citasEPS")
      if (citasGuardadas) {
        try {
          const todasCitas = JSON.parse(citasGuardadas)
          console.log("Todas las citas:", todasCitas)
          console.log("ID del doctor actual:", doctorActual.id)

          // Filtrar citas del doctor actual
          const citasDoctor = todasCitas.filter((cita) => cita && cita.doctorId === doctorActual.id)
          console.log("Citas del doctor:", citasDoctor)

          // Filtrar citas de hoy
          const citasDeHoy = citasDoctor
            .filter((cita) => cita.fecha === hoy && cita.estado !== "completada")
            .map((cita) => {
              const paciente = pacientesRegistrados.find((p) => p && p.id === cita.pacienteId)
              return {
                id: cita.id,
                pacienteId: cita.pacienteId,
                paciente: paciente ? paciente.nombre : "Paciente desconocido",
                cedula: paciente ? paciente.cedula : "N/A",
                hora: cita.hora,
                motivo: cita.motivo,
                estado: cita.estado,
              }
            })

          // Filtrar próximas citas (futuras)
          const citasFuturas = citasDoctor
            .filter((cita) => cita.fecha > hoy && cita.estado !== "completada")
            .map((cita) => {
              const paciente = pacientesRegistrados.find((p) => p && p.id === cita.pacienteId)
              return {
                id: cita.id,
                pacienteId: cita.pacienteId,
                paciente: paciente ? paciente.nombre : "Paciente desconocido",
                cedula: paciente ? paciente.cedula : "N/A",
                fecha: cita.fecha,
                hora: cita.hora,
                motivo: cita.motivo,
                estado: cita.estado,
              }
            })

          console.log("Citas de hoy:", citasDeHoy)
          console.log("Próximas citas:", citasFuturas)

          setCitasHoy(citasDeHoy)
          setProximasCitas(citasFuturas)
        } catch (error) {
          console.error("Error al procesar citas:", error)
        }
      }
    }
  }, [dataCargada, doctorActual, pacientesRegistrados])

  // Función para mostrar el historial detallado
  const verHistorialDetallado = (pacienteId) => {
    // Buscar historial del paciente específico
    const historialPaciente = historialMedico.filter((h) => h.pacienteId === pacienteId)

    if (historialPaciente.length > 0) {
      setSelectedHistorial(historialPaciente)
      setShowHistorialModal(true)
    } else {
      // Si el paciente no tiene historial, mostrar un mensaje
      setSelectedHistorial([])
      setShowHistorialModal(true)
    }
  }

  // Filtrar citas por fecha seleccionada
  const citasFiltradas = proximasCitas.filter((cita) => cita.fecha === format(selectedDate, "yyyy-MM-dd"))

  return (
    <div className="flex min-h-screen flex-col">
      <DoctorHeader />
      <div className="flex flex-1">
        <DoctorNavbar activeItem="dashboard" />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Panel de Doctor</h1>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{citasHoy.length}</div>
                <p className="text-xs text-muted-foreground">{citasHoy.length} pacientes programados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pacientesRegistrados.length}</div>
                <p className="text-xs text-muted-foreground">Pacientes registrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próxima Cita</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {citasHoy.length > 0 ? (
                  <div>
                    <div className="text-2xl font-bold">{citasHoy[0].hora}</div>
                    <p className="text-xs text-muted-foreground">{citasHoy[0].paciente}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No hay citas hoy</p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jornada</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{doctorActual?.jornada || "No especificada"}</div>
                <p className="text-xs text-muted-foreground">
                  {doctorActual?.jornada === "Matutina" ? "08:00 - 12:00" : "14:00 - 18:00"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="today">Citas de Hoy</TabsTrigger>
              <TabsTrigger value="upcoming">Próximas Citas</TabsTrigger>
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Agenda del Día</CardTitle>
                  <CardDescription>{format(new Date(), "PPPP", { locale: es })}</CardDescription>
                </CardHeader>
                <CardContent>
                  {citasHoy.length > 0 ? (
                    <div className="space-y-6">
                      {citasHoy.map((cita) => (
                        <div key={cita.id} className="flex items-start justify-between border-b pb-4">
                          <div className="flex items-start gap-4">
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                              <Clock className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{cita.paciente}</p>
                              <p className="text-sm text-muted-foreground">Cédula: {cita.cedula}</p>
                              <p className="text-sm text-muted-foreground">Motivo: {cita.motivo}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{cita.hora}</p>
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => verHistorialDetallado(cita.pacienteId)}
                              >
                                Ver historial
                              </Button>
                              <Link href={`/doctor/atender-paciente/${cita.id}`}>
                                <Button size="sm">Atender</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay citas programadas para hoy</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="upcoming" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Próximas Citas</CardTitle>
                  <CardDescription>Visualice sus próximas citas programadas</CardDescription>
                </CardHeader>
                <CardContent>
                  {proximasCitas.length > 0 ? (
                    <div className="space-y-6">
                      {proximasCitas.map((cita) => (
                        <div key={cita.id} className="flex items-start justify-between border-b pb-4">
                          <div className="flex items-start gap-4">
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                              <CalendarCheck className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{cita.paciente}</p>
                              <p className="text-sm text-muted-foreground">Cédula: {cita.cedula}</p>
                              <p className="text-sm text-muted-foreground">Motivo: {cita.motivo}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {new Date(cita.fecha).toLocaleDateString()} - {cita.hora}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => verHistorialDetallado(cita.pacienteId)}
                            >
                              Ver historial
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No hay próximas citas programadas</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="calendar" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Calendario de Citas</CardTitle>
                  <CardDescription>Visualice sus citas por fecha</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Citas para {format(selectedDate, "PPP", { locale: es })}</h3>
                      {citasFiltradas.length > 0 ? (
                        <div className="space-y-4">
                          {citasFiltradas.map((cita) => (
                            <div key={cita.id} className="flex items-center justify-between border-b pb-2">
                              <div>
                                <p className="font-medium">{cita.paciente}</p>
                                <p className="text-sm text-muted-foreground">{cita.motivo}</p>
                              </div>
                              <p className="font-medium">{cita.hora}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground">No hay citas para esta fecha</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {/* Modal de Historial Médico */}
      {showHistorialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[80vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Historial Médico del Paciente</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowHistorialModal(false)}>
                ✕
              </Button>
            </div>

            {selectedHistorial && selectedHistorial.length > 0 ? (
              <div className="space-y-6">
                {selectedHistorial.map((registro) => (
                  <div key={registro.id} className="border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">{new Date(registro.fecha).toLocaleDateString()}</h3>
                      <p className="text-sm text-muted-foreground">
                        {registro.doctor} - {registro.especialidad}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <h4 className="text-sm font-semibold">Diagnóstico:</h4>
                        <p>{registro.diagnostico}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Tratamiento:</h4>
                        <p>{registro.tratamiento}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold">Observaciones:</h4>
                        <p>{registro.observaciones}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">Este paciente no tiene historial médico registrado</p>
                <p className="text-sm">El historial se creará cuando se complete la primera consulta</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowHistorialModal(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
