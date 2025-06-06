"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DoctorNavbar } from "@/components/doctor-navbar"
import { DoctorHeader } from "@/components/doctor-header"
import { toast } from "@/components/ui/use-toast"

export default function AtenderPacientePage({ params }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("consulta")
  const [consultaData, setConsultaData] = useState({
    sintomas: "",
    diagnostico: "",
    tratamiento: "",
    observaciones: "",
  })
  const [paciente, setPaciente] = useState(null)
  const [cita, setCita] = useState(null)
  const [historialPaciente, setHistorialPaciente] = useState([])
  const [doctorActual, setDoctorActual] = useState(null)

  // Cargar datos de la cita y el paciente
  useEffect(() => {
    if (params.id) {
      // Cargar usuario actual (doctor)
      const usuarioGuardado = localStorage.getItem("usuarioEPS")
      if (usuarioGuardado) {
        try {
          const usuario = JSON.parse(usuarioGuardado)
          setDoctorActual(usuario)
        } catch (error) {
          console.error("Error al cargar usuario actual:", error)
        }
      }

      // Cargar citas
      const citasGuardadas = localStorage.getItem("citasEPS")
      if (citasGuardadas) {
        try {
          const citas = JSON.parse(citasGuardadas)
          // Buscar la cita
          const citaEncontrada = citas.find((c) => c && c.id === Number.parseInt(params.id))
          if (citaEncontrada) {
            setCita(citaEncontrada)

            // Cargar pacientes
            const pacientesGuardados = localStorage.getItem("pacientesEPS")
            if (pacientesGuardados) {
              try {
                const pacientes = JSON.parse(pacientesGuardados)
                // Buscar el paciente
                const pacienteEncontrado = pacientes.find((p) => p && p.id === citaEncontrada.pacienteId)
                if (pacienteEncontrado) {
                  setPaciente(pacienteEncontrado)

                  // Cargar historial médico del paciente
                  const historialGuardado = localStorage.getItem("historialMedicoEPS")
                  if (historialGuardado) {
                    try {
                      const historial = JSON.parse(historialGuardado)
                      // Filtrar historial del paciente
                      const historialPacienteEncontrado = historial.filter(
                        (h) => h && h.pacienteId === pacienteEncontrado.id,
                      )
                      setHistorialPaciente(historialPacienteEncontrado)
                    } catch (error) {
                      console.error("Error al cargar historial médico:", error)
                      setHistorialPaciente([])
                    }
                  } else {
                    setHistorialPaciente([])
                  }
                }
              } catch (error) {
                console.error("Error al cargar pacientes:", error)
              }
            }
          }
        } catch (error) {
          console.error("Error al cargar citas:", error)
        }
      }
    }
  }, [params.id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setConsultaData((prev) => ({ ...prev, [name]: value }))
  }

  // Mejorar la función handleSubmit para asegurar que el doctor pueda atender la cita
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar que se hayan completado los campos obligatorios
    if (!consultaData.sintomas || !consultaData.diagnostico || !consultaData.tratamiento) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    try {
      // Guardar la consulta en el historial médico
      const nuevaConsulta = {
        id: Date.now(), // Generar un ID único
        pacienteId: paciente.id,
        fecha: new Date().toISOString().split("T")[0],
        doctor: doctorActual?.nombre || "Doctor",
        especialidad: doctorActual?.especialidad || "Medicina General",
        diagnostico: consultaData.diagnostico,
        tratamiento: consultaData.tratamiento,
        observaciones: consultaData.observaciones || "Sin observaciones adicionales",
      }

      console.log("Nueva consulta a guardar:", nuevaConsulta)

      // Cargar historial médico actual
      let historialMedico = []
      const historialGuardado = localStorage.getItem("historialMedicoEPS")
      if (historialGuardado) {
        try {
          historialMedico = JSON.parse(historialGuardado)
        } catch (error) {
          console.error("Error al cargar historial médico:", error)
          historialMedico = []
        }
      }

      // Añadir la nueva consulta al historial
      const nuevoHistorial = [nuevaConsulta, ...historialMedico]
      localStorage.setItem("historialMedicoEPS", JSON.stringify(nuevoHistorial))
      console.log("Historial médico actualizado:", nuevoHistorial)

      // Actualizar el estado de la cita a "completada"
      const citasGuardadas = localStorage.getItem("citasEPS")
      if (citasGuardadas) {
        try {
          const citas = JSON.parse(citasGuardadas)
          const citasActualizadas = citas.map((c) => {
            if (c && c.id === Number.parseInt(params.id)) {
              console.log("Marcando cita como completada:", c.id)
              return { ...c, estado: "completada" }
            }
            return c
          })
          localStorage.setItem("citasEPS", JSON.stringify(citasActualizadas))
          console.log("Citas actualizadas:", citasActualizadas)
        } catch (error) {
          console.error("Error al actualizar citas:", error)
        }
      }

      toast({
        title: "Consulta guardada",
        description: "La información de la consulta ha sido guardada exitosamente",
      })

      // Redireccionar al dashboard después de guardar
      setTimeout(() => {
        router.push("/doctor/dashboard")
      }, 1500)
    } catch (error) {
      console.error("Error al guardar la consulta:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la consulta",
        variant: "destructive",
      })
    }
  }

  if (!paciente || !cita) {
    return (
      <div className="flex min-h-screen flex-col">
        <DoctorHeader />
        <div className="flex flex-1 items-center justify-center">
          <p>Cargando información de la cita...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DoctorHeader />
      <div className="flex flex-1">
        <DoctorNavbar activeItem="dashboard" />
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Atender Paciente</h1>
            <Button variant="outline" onClick={() => router.push("/doctor/dashboard")}>
              Volver
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Información del Paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">Nombre:</h3>
                  <p>{paciente.nombre}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Cédula:</h3>
                  <p>{paciente.cedula}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Edad:</h3>
                  <p>{paciente.edad || "No especificada"} años</p>
                </div>
                <div>
                  <h3 className="font-semibold">Género:</h3>
                  <p>{paciente.genero || "No especificado"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Teléfono:</h3>
                  <p>{paciente.telefono || "No especificado"}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Dirección:</h3>
                  <p>{paciente.direccion || "No especificada"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Consulta Médica</CardTitle>
                <CardDescription>
                  Cita: {new Date(cita.fecha).toLocaleDateString()} - {cita.hora}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="consulta" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="consulta">Consulta Actual</TabsTrigger>
                    <TabsTrigger value="historial">Historial Médico</TabsTrigger>
                  </TabsList>
                  <TabsContent value="consulta" className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="motivo">Motivo de Consulta</Label>
                        <Input id="motivo" value={cita.motivo} disabled />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sintomas">Síntomas</Label>
                        <Textarea
                          id="sintomas"
                          name="sintomas"
                          placeholder="Describa los síntomas del paciente"
                          value={consultaData.sintomas}
                          onChange={handleChange}
                          className="min-h-[100px]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="diagnostico">Diagnóstico</Label>
                        <Textarea
                          id="diagnostico"
                          name="diagnostico"
                          placeholder="Ingrese el diagnóstico"
                          value={consultaData.diagnostico}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tratamiento">Tratamiento</Label>
                        <Textarea
                          id="tratamiento"
                          name="tratamiento"
                          placeholder="Describa el tratamiento recomendado"
                          value={consultaData.tratamiento}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones Adicionales</Label>
                        <Textarea
                          id="observaciones"
                          name="observaciones"
                          placeholder="Ingrese observaciones adicionales"
                          value={consultaData.observaciones}
                          onChange={handleChange}
                        />
                      </div>
                    </form>
                  </TabsContent>
                  <TabsContent value="historial">
                    {historialPaciente.length > 0 ? (
                      <div className="space-y-6">
                        {historialPaciente.map((registro) => (
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
                                <p className="p-2 bg-muted/30 rounded">{registro.diagnostico}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold">Tratamiento:</h4>
                                <p className="p-2 bg-muted/30 rounded">{registro.tratamiento}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold">Observaciones:</h4>
                                <p className="p-2 bg-muted/30 rounded">{registro.observaciones}</p>
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
                        <p className="text-muted-foreground mb-2">Este paciente no tiene historial médico registrado</p>
                        <p className="text-sm">Esta será su primera consulta</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.push("/doctor/dashboard")}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>Finalizar Consulta</Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
