"use client"

import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { PacienteNavbar } from "@/components/paciente-navbar"
import { PacienteHeader } from "@/components/paciente-header"
import { toast } from "@/components/ui/use-toast"

// Datos iniciales para especialidades
const especialidadesIniciales = [
  { id: 1, nombre: "Medicina General" },
  { id: 2, nombre: "Cardiología" },
  { id: 3, nombre: "Dermatología" },
  { id: 4, nombre: "Pediatría" },
  { id: 5, nombre: "Oftalmología" },
]

// Datos iniciales para doctores (con especialidades correctamente asignadas)
const doctoresIniciales = [
  {
    id: 1,
    nombre: "Dr. Juan Pérez",
    cedula: "1122334455",
    especialidad: "Medicina General",
    jornada: "Matutina",
    citas: 0,
    usuario: "doctor1",
    password: "123456",
    tipo: "doctor",
  },
  {
    id: 2,
    nombre: "Dra. María López",
    cedula: "2233445566",
    especialidad: "Cardiología",
    jornada: "Matutina",
    citas: 0,
    usuario: "doctor2",
    password: "123456",
    tipo: "doctor",
  },
  {
    id: 3,
    nombre: "Dr. Carlos Rodríguez",
    cedula: "3344556677",
    especialidad: "Dermatología",
    jornada: "Vespertina",
    citas: 0,
    usuario: "doctor3",
    password: "123456",
    tipo: "doctor",
  },
  {
    id: 4,
    nombre: "Dra. Ana Martínez",
    cedula: "4455667788",
    especialidad: "Pediatría",
    jornada: "Vespertina",
    citas: 0,
    usuario: "doctor4",
    password: "123456",
    tipo: "doctor",
  },
  {
    id: 5,
    nombre: "Dr. Luis Sánchez",
    cedula: "5566778899",
    especialidad: "Oftalmología",
    jornada: "Matutina",
    citas: 0,
    usuario: "doctor5",
    password: "123456",
    tipo: "doctor",
  },
]

export default function AgendarCitaPage() {
  const router = useRouter()
  const [especialidad, setEspecialidad] = useState("")
  const [doctor, setDoctor] = useState("")
  const [fecha, setFecha] = useState(null)
  const [hora, setHora] = useState("")
  const [motivo, setMotivo] = useState("")
  const [doctoresFiltrados, setDoctoresFiltrados] = useState([])
  const [horariosDisponibles, setHorariosDisponibles] = useState([])
  const [especialidades, setEspecialidades] = useState(especialidadesIniciales)
  const [doctoresRegistrados, setDoctoresRegistrados] = useState(doctoresIniciales) // Usar datos iniciales como valor por defecto
  const [citasOcupadas, setCitasOcupadas] = useState([])
  const [citasRegistradas, setCitasRegistradas] = useState([])
  const [usuarioActual, setUsuarioActual] = useState(null)
  const [dataCargada, setDataCargada] = useState(false)

  // Estado para controlar si estamos reprogramando una cita
  const [reprogramando, setReprogramando] = useState(false)
  const [citaReprogramar, setCitaReprogramar] = useState(null)

  // Cargar datos iniciales
  useEffect(() => {
    if (typeof window !== "undefined" && !dataCargada) {
      console.log("Cargando datos iniciales para agendar cita...")

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

      // Cargar doctores
      const doctoresGuardados = localStorage.getItem("doctoresEPS")
      if (doctoresGuardados) {
        try {
          const doctores = JSON.parse(doctoresGuardados)
          console.log("Doctores cargados (sin procesar):", doctores)

          // Si no hay doctores o el array está vacío, usar los datos iniciales
          if (!doctores || doctores.length === 0) {
            console.log("No hay doctores guardados, usando datos iniciales")
            setDoctoresRegistrados(doctoresIniciales)
            localStorage.setItem("doctoresEPS", JSON.stringify(doctoresIniciales))
          } else {
            // Asegurarse de que todos los doctores tengan un ID válido, especialidad y filtrar valores nulos
            const doctoresProcesados = doctores
              .filter((doc) => doc) // Filtrar valores nulos
              .map((doc, index) => ({
                ...doc,
                id: doc.id || index + 1,
                // Asegurarse de que tenga una especialidad válida
                especialidad: doc.especialidad || "Medicina General",
              }))

            setDoctoresRegistrados(doctoresProcesados)
            console.log("Doctores procesados:", doctoresProcesados)
          }
        } catch (error) {
          console.error("Error al cargar doctores:", error)
          // En caso de error, usar los datos iniciales
          setDoctoresRegistrados(doctoresIniciales)
          localStorage.setItem("doctoresEPS", JSON.stringify(doctoresIniciales))
        }
      } else {
        console.log("No se encontraron doctores, usando valores por defecto")
        setDoctoresRegistrados(doctoresIniciales)
        localStorage.setItem("doctoresEPS", JSON.stringify(doctoresIniciales))
      }

      // Cargar citas
      const citasGuardadas = localStorage.getItem("citasEPS")
      if (citasGuardadas) {
        try {
          const citas = JSON.parse(citasGuardadas)
          setCitasRegistradas(citas)
          console.log("Citas cargadas:", citas)

          // Extraer citas ocupadas
          const ocupadas = citas
            .filter((cita) => cita) // Filtrar valores nulos
            .map((cita) => ({
              doctorId: cita.doctorId,
              fecha: cita.fecha,
              hora: cita.hora,
            }))
          setCitasOcupadas(ocupadas)
          console.log("Citas ocupadas:", ocupadas)
        } catch (error) {
          console.error("Error al cargar citas:", error)
        }
      }

      setDataCargada(true)
    }
  }, [dataCargada])

  // Verificar si venimos de reprogramar
  useEffect(() => {
    if (!dataCargada) return

    const params = new URLSearchParams(window.location.search)
    const reprogramarId = params.get("reprogramar")

    if (reprogramarId && citasRegistradas.length > 0) {
      // Buscar la cita a reprogramar
      const cita = citasRegistradas.find((c) => c && c.id.toString() === reprogramarId)
      if (cita) {
        setReprogramando(true)
        setCitaReprogramar(cita)
        setMotivo(cita.motivo)

        // Pre-seleccionar la especialidad
        const esp = especialidades.find((e) => e.nombre === cita.especialidad)
        if (esp) {
          handleEspecialidadChange(esp.id.toString())
        }
      }
    }
  }, [citasRegistradas, especialidades, dataCargada])

  // Filtrar doctores por especialidad
  const handleEspecialidadChange = (value) => {
    console.log("Especialidad seleccionada:", value)
    setEspecialidad(value)
    setDoctor("")
    setFecha(null)
    setHora("")

    if (!value) return

    const espSeleccionada = especialidades.find((e) => e.id.toString() === value)?.nombre
    if (!espSeleccionada) {
      console.error("No se encontró la especialidad seleccionada")
      return
    }

    console.log("Nombre de especialidad:", espSeleccionada)
    console.log("Doctores disponibles:", doctoresRegistrados)

    // Filtrar doctores que tengan la especialidad seleccionada y un ID válido
    const filtrados = doctoresRegistrados.filter(
      (doc) => doc && doc.especialidad === espSeleccionada && doc.id !== undefined,
    )

    console.log("Doctores filtrados:", filtrados)
    setDoctoresFiltrados(filtrados)
  }

  // Actualizar horarios disponibles según el doctor y la fecha
  const handleFechaChange = (date) => {
    setFecha(date)
    setHora("")

    if (!doctor || !date) return

    const doctorSeleccionado = doctoresRegistrados.find((doc) => doc && doc.id.toString() === doctor)
    if (!doctorSeleccionado) return

    const fechaFormateada = format(date, "yyyy-MM-dd")

    // Determinar horarios según jornada del doctor
    const horariosMatutinos = ["08:00", "09:00", "10:00", "11:00", "12:00"]
    const horariosVespertinos = ["14:00", "15:00", "16:00", "17:00", "18:00"]
    const horariosBase = doctorSeleccionado.jornada === "Matutina" ? horariosMatutinos : horariosVespertinos

    // Filtrar horarios ocupados
    const ocupados = citasOcupadas
      .filter((cita) => cita.doctorId === Number.parseInt(doctor) && cita.fecha === fechaFormateada)
      .map((cita) => cita.hora)

    const disponibles = horariosBase.filter((h) => !ocupados.includes(h))
    setHorariosDisponibles(disponibles)
  }

  const handleDoctorChange = (value) => {
    console.log("Doctor seleccionado:", value)
    setDoctor(value)
    setFecha(null)
    setHora("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!especialidad || !doctor || !fecha || !hora || !motivo) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      })
      return
    }

    // Obtener información del doctor
    const doctorSeleccionado = doctoresRegistrados.find((d) => d && d.id.toString() === doctor)
    if (!doctorSeleccionado) {
      toast({
        title: "Error",
        description: "Doctor no encontrado",
        variant: "destructive",
      })
      return
    }

    const especialidadSeleccionada = especialidades.find((e) => e.id.toString() === especialidad)
    if (!especialidadSeleccionada) {
      toast({
        title: "Error",
        description: "Especialidad no encontrada",
        variant: "destructive",
      })
      return
    }

    // Obtener ID del paciente actual
    let pacienteId = 1 // Valor por defecto
    if (usuarioActual) {
      // Buscar el ID del paciente por su nombre de usuario
      const pacientesGuardados = localStorage.getItem("pacientesEPS")
      if (pacientesGuardados) {
        try {
          const pacientes = JSON.parse(pacientesGuardados)
          const pacienteEncontrado = pacientes.find((p) => p && p.usuario === usuarioActual.usuario)
          if (pacienteEncontrado) {
            pacienteId = pacienteEncontrado.id
          }
        } catch (error) {
          console.error("Error al buscar paciente:", error)
        }
      }
    }

    // Crear nueva cita
    const nuevaCita = {
      id: reprogramando && citaReprogramar ? citaReprogramar.id : Date.now(),
      pacienteId: pacienteId,
      doctorId: Number.parseInt(doctor),
      especialidad: especialidadSeleccionada.nombre,
      doctor: doctorSeleccionado.nombre,
      fecha: format(fecha, "yyyy-MM-dd"),
      hora: hora,
      motivo: motivo,
      estado: "pendiente",
    }

    // Actualizar citas registradas
    let nuevasCitas
    if (reprogramando && citaReprogramar) {
      // Actualizar la cita existente
      nuevasCitas = citasRegistradas.map((c) => (c.id === citaReprogramar.id ? nuevaCita : c))
    } else {
      // Agregar nueva cita
      nuevasCitas = [...citasRegistradas, nuevaCita]
    }

    // Actualizar citas ocupadas
    const nuevasOcupadas = nuevasCitas.map((cita) => ({
      doctorId: cita.doctorId,
      fecha: cita.fecha,
      hora: cita.hora,
    }))

    // Guardar en localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("citasEPS", JSON.stringify(nuevasCitas))
      setCitasRegistradas(nuevasCitas)
      setCitasOcupadas(nuevasOcupadas)
      console.log("Cita guardada:", nuevaCita)
      console.log("Nuevas citas:", nuevasCitas)
    }

    toast({
      title: reprogramando ? "Cita reprogramada" : "Cita agendada",
      description: `Su cita ha sido ${reprogramando ? "reprogramada" : "agendada"} para el ${format(fecha, "PPP", { locale: es })} a las ${hora}`,
    })

    // Redireccionar al dashboard después de agendar
    setTimeout(() => {
      router.push("/paciente/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PacienteHeader />
      <div className="flex flex-1">
        <PacienteNavbar activeItem="agendar" />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">{reprogramando ? "Reprogramar Cita" : "Agendar Nueva Cita"}</h1>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>
                {reprogramando ? `Reprogramar cita con ${citaReprogramar?.doctor}` : "Formulario de Agendamiento"}
              </CardTitle>
              <CardDescription>Complete los campos para agendar su cita médica</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="especialidad">Especialidad</Label>
                  <Select value={especialidad} onValueChange={handleEspecialidadChange}>
                    <SelectTrigger id="especialidad">
                      <SelectValue placeholder="Seleccione una especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {especialidades.map((esp) => (
                        <SelectItem key={esp.id} value={esp.id.toString()}>
                          {esp.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select value={doctor} onValueChange={handleDoctorChange} disabled={!especialidad}>
                    <SelectTrigger id="doctor">
                      <SelectValue placeholder="Seleccione un doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctoresFiltrados.length > 0 ? (
                        doctoresFiltrados.map((doc) => (
                          <SelectItem key={doc.id} value={doc.id.toString()}>
                            {doc.nombre} ({doc.jornada === "Matutina" ? "Mañana" : "Tarde"})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-doctores" disabled>
                          No hay doctores disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !fecha && "text-muted-foreground")}
                        disabled={!doctor}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fecha ? format(fecha, "PPP", { locale: es }) : "Seleccione una fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={fecha}
                        onSelect={handleFechaChange}
                        initialFocus
                        //disabled={
                          //(date) =>
                            //date < new Date() ||
                            //date.getDay() === 0
                        //}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hora">Hora</Label>
                  <Select value={hora} onValueChange={setHora} disabled={!fecha}>
                    <SelectTrigger id="hora">
                      <SelectValue placeholder="Seleccione una hora" />
                    </SelectTrigger>
                    <SelectContent>
                      {horariosDisponibles.length > 0 ? (
                        horariosDisponibles.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-horarios" disabled>
                          No hay horarios disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo de la consulta</Label>
                  <input
                    id="motivo"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describa brevemente el motivo de su consulta"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {reprogramando ? "Reprogramar Cita" : "Agendar Cita"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
