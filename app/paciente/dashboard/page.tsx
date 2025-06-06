"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarCheck, Clock, FileText } from "lucide-react"
import { PacienteNavbar } from "@/components/paciente-navbar"
import { PacienteHeader } from "@/components/paciente-header"
import { useSearchParams } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function PacienteDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [proximasCitas, setProximasCitas] = useState([])
  const [historialConsultas, setHistorialConsultas] = useState([])
  const [usuarioActual, setUsuarioActual] = useState(null)
  const [citasRegistradas, setCitasRegistradas] = useState([])
  const [dataCargada, setDataCargada] = useState(false)
  const searchParams = useSearchParams()

  // Cargar datos iniciales - solo una vez
  useEffect(() => {
    if (typeof window !== "undefined" && !dataCargada) {
      // Cargar usuario actual
      const usuarioGuardado = localStorage.getItem("usuarioEPS")
      if (usuarioGuardado) {
        try {
          const usuario = JSON.parse(usuarioGuardado)
          setUsuarioActual(usuario)
          console.log("Usuario actual cargado:", usuario)
        } catch (error) {
          console.error("Error al cargar usuario:", error)
        }
      }

      // Cargar citas
      const citasGuardadas = localStorage.getItem("citasEPS")
      if (citasGuardadas) {
        try {
          const citas = JSON.parse(citasGuardadas)
          setCitasRegistradas(citas)
          console.log("Citas cargadas:", citas)
        } catch (error) {
          console.error("Error al cargar citas:", error)
          // No establecer citas por defecto si hay un error
          setCitasRegistradas([])
        }
      } else {
        // No establecer citas por defecto si no hay citas guardadas
        setCitasRegistradas([])
      }

      setDataCargada(true)
    }
  }, [dataCargada])

  // Cargar historial médico cuando cambia el usuario
  useEffect(() => {
    if (usuarioActual) {
      // Cargar historial médico del paciente
      const historialGuardado = localStorage.getItem("historialMedicoEPS")
      if (historialGuardado) {
        try {
          const historial = JSON.parse(historialGuardado)
          // Filtrar historial del paciente actual
          const historialPaciente = historial.filter((h) => h && h.pacienteId === usuarioActual.id)
          setHistorialConsultas(historialPaciente)
          console.log("Historial médico del paciente:", historialPaciente)
        } catch (error) {
          console.error("Error al cargar historial médico:", error)
          setHistorialConsultas([])
        }
      } else {
        setHistorialConsultas([])
      }
    }
  }, [usuarioActual])

  // Procesar citas cuando cambian los datos
  useEffect(() => {
    if (citasRegistradas.length > 0 && usuarioActual) {
      // Buscar el ID del paciente actual
      const pacienteId = usuarioActual.id || 1 // Usar el ID del usuario o valor por defecto

      // Filtrar citas del paciente actual que no estén completadas
      const citasPaciente = citasRegistradas.filter(
        (cita) => cita && cita.pacienteId === pacienteId && cita.estado !== "completada",
      )

      // Ordenar citas por fecha
      const citasOrdenadas = [...citasPaciente].sort(
        (a, b) => new Date(a.fecha + "T" + a.hora) - new Date(b.fecha + "T" + b.hora),
      )

      setProximasCitas(citasOrdenadas)
    }
  }, [citasRegistradas, usuarioActual])

  // Manejar cambio de pestaña desde URL
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const cancelarCita = (citaId) => {
    // Filtrar la cita a cancelar
    const nuevasCitas = citasRegistradas.filter((c) => c.id !== citaId)

    // Actualizar estado local y localStorage
    setCitasRegistradas(nuevasCitas)
    localStorage.setItem("citasEPS", JSON.stringify(nuevasCitas))

    toast({
      title: "Cita cancelada",
      description: "Su cita ha sido cancelada exitosamente",
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PacienteHeader />
      <div className="flex flex-1">
        <PacienteNavbar activeItem="dashboard" />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Panel de Paciente</h1>
            <Link href="/paciente/agendar-cita">
              <Button>Agendar Nueva Cita</Button>
            </Link>
          </div>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="appointments">Mis Citas</TabsTrigger>
              <TabsTrigger value="consultations">Mis Consultas</TabsTrigger>
              <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Próxima Cita</CardTitle>
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {proximasCitas.length > 0 ? (
                      <div>
                        <p className="text-xl font-bold">{proximasCitas[0].doctor}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(proximasCitas[0].fecha).toLocaleDateString()} - {proximasCitas[0].hora}
                        </p>
                        <p className="text-sm">{proximasCitas[0].especialidad}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tiene citas programadas</p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Citas</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{proximasCitas.length + historialConsultas.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {proximasCitas.length} pendientes, {historialConsultas.length} completadas
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Última Consulta</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    {historialConsultas.length > 0 ? (
                      <div>
                        <p className="text-xl font-bold">{historialConsultas[0].doctor}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(historialConsultas[0].fecha).toLocaleDateString()}
                        </p>
                        <p className="text-sm">Consulta realizada</p>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No tiene consultas previas</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Próximas Citas</CardTitle>
                  <CardDescription>Visualice sus próximas citas médicas programadas</CardDescription>
                </CardHeader>
                <CardContent>
                  {proximasCitas.length > 0 ? (
                    <div className="space-y-4">
                      {proximasCitas.map((cita) => (
                        <div key={cita.id} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">{cita.doctor}</p>
                            <p className="text-sm text-muted-foreground">{cita.especialidad}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {new Date(cita.fecha).toLocaleDateString()} - {cita.hora}
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              Ver detalles
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No tiene citas programadas</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Citas</CardTitle>
                  <CardDescription>Gestione todas sus citas médicas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Citas Pendientes</h3>
                    {proximasCitas.length > 0 ? (
                      <div className="space-y-4">
                        {proximasCitas.map((cita) => (
                          <div key={cita.id} className="flex items-center justify-between border-b pb-4">
                            <div>
                              <p className="font-medium">{cita.doctor}</p>
                              <p className="text-sm text-muted-foreground">{cita.especialidad}</p>
                              <p className="text-sm text-muted-foreground">Motivo: {cita.motivo}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {new Date(cita.fecha).toLocaleDateString()} - {cita.hora}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Link href={`/paciente/agendar-cita?reprogramar=${cita.id}`}>
                                  <Button variant="outline" size="sm">
                                    Reprogramar
                                  </Button>
                                </Link>
                                <Button variant="destructive" size="sm" onClick={() => cancelarCita(cita.id)}>
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No tiene citas pendientes</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="consultations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Consultas</CardTitle>
                  <CardDescription>Consulte su historial de visitas médicas</CardDescription>
                </CardHeader>
                <CardContent>
                  {historialConsultas.length > 0 ? (
                    <div className="space-y-4">
                      {historialConsultas.map((consulta) => (
                        <div key={consulta.id} className="border rounded-lg p-4">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-semibold">{new Date(consulta.fecha).toLocaleDateString()}</h3>
                            <p className="text-sm text-muted-foreground">
                              {consulta.doctor} - {consulta.especialidad}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <h4 className="text-sm font-semibold">Diagnóstico:</h4>
                              <p className="p-2 bg-muted/30 rounded">{consulta.diagnostico}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Tratamiento:</h4>
                              <p className="p-2 bg-muted/30 rounded">{consulta.tratamiento}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold">Observaciones:</h4>
                              <p className="p-2 bg-muted/30 rounded">{consulta.observaciones}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Button variant="outline" size="sm">
                              Imprimir historial
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-2">No tiene consultas médicas registradas</p>
                      <p className="text-sm">Su historial médico se creará después de su primera consulta</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mi Perfil</CardTitle>
                  <CardDescription>Gestione su información personal</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="cedula">Cédula</Label>
                        <Input id="cedula" defaultValue="1234567890" disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input id="nombre" defaultValue="Carlos" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellidos">Apellidos</Label>
                        <Input id="apellidos" defaultValue="González" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo Electrónico</Label>
                        <Input id="email" type="email" defaultValue="carlos.gonzalez@ejemplo.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input id="telefono" defaultValue="3001234567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input id="direccion" defaultValue="Calle 123 #45-67" />
                      </div>
                    </div>
                    <Button type="submit">Guardar Cambios</Button>
                  </form>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Cambiar Contraseña</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Contraseña Actual</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nueva Contraseña</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button type="submit">Cambiar Contraseña</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
