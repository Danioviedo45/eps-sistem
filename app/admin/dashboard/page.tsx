"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Users, UserCog, CalendarClock, Search, Plus } from "lucide-react"
import { AdminNavbar } from "@/components/admin-navbar"
import { AdminHeader } from "@/components/admin-header"
import { toast } from "@/components/ui/use-toast"

// Datos iniciales para doctores
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

// Datos iniciales para pacientes
const pacientesIniciales = [
  {
    id: 1,
    nombre: "Carlos González",
    cedula: "1234567890",
    edad: 35,
    genero: "Masculino",
    telefono: "3001234567",
    direccion: "Calle 123 #45-67",
    usuario: "paciente1",
    password: "123456",
    tipo: "paciente",
    ultimaCita: "2025-05-01",
    proximaCita: "2025-05-10",
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
    password: "123456",
    tipo: "paciente",
    ultimaCita: null,
    proximaCita: "2025-05-15",
  },
]

export default function AdminDashboard() {
  const [searchDoctor, setSearchDoctor] = useState("")
  const [searchPaciente, setSearchPaciente] = useState("")
  const [filtroEspecialidad, setFiltroEspecialidad] = useState("Medicina General")
  const [filtroJornada, setFiltroJornada] = useState("Matutina")
  const [showAddDoctorDialog, setShowAddDoctorDialog] = useState(false)
  const [showAddPacienteDialog, setShowAddPacienteDialog] = useState(false)
  const [doctoresRegistrados, setDoctoresRegistrados] = useState(doctoresIniciales)
  const [pacientesRegistrados, setPacientesRegistrados] = useState(pacientesIniciales)
  const [citasRegistradas, setCitasRegistradas] = useState([])
  const [dataCargada, setDataCargada] = useState(false)

  // Estados para nuevo doctor
  const [nuevoDoctor, setNuevoDoctor] = useState({
    nombre: "",
    cedula: "",
    especialidad: "Medicina General",
    jornada: "Matutina",
    usuario: "",
    password: "",
  })

  // Estados para nuevo paciente
  const [nuevoPaciente, setNuevoPaciente] = useState({
    nombre: "",
    cedula: "",
    edad: "",
    genero: "Masculino",
    telefono: "",
    direccion: "",
    usuario: "",
    password: "",
  })

  // Inicializar datos en localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && !dataCargada) {
      console.log("Inicializando datos en localStorage (Admin Dashboard)")

      // Inicializar doctores si no existen
      if (!localStorage.getItem("doctoresEPS")) {
        localStorage.setItem("doctoresEPS", JSON.stringify(doctoresIniciales))
        setDoctoresRegistrados(doctoresIniciales)
        console.log("Doctores inicializados:", doctoresIniciales)
      } else {
        try {
          const doctoresGuardados = JSON.parse(localStorage.getItem("doctoresEPS"))

          // Si no hay doctores o el array está vacío, usar los datos iniciales
          if (!doctoresGuardados || doctoresGuardados.length === 0) {
            console.log("No hay doctores guardados, usando datos iniciales")
            setDoctoresRegistrados(doctoresIniciales)
            localStorage.setItem("doctoresEPS", JSON.stringify(doctoresIniciales))
          } else {
            // Asegurarse de que todos los doctores tengan especialidad
            const doctoresProcesados = doctoresGuardados
              .filter((doc) => doc) // Filtrar valores nulos
              .map((doc) => ({
                ...doc,
                especialidad: doc.especialidad || "Medicina General", // Asignar especialidad por defecto si no tiene
                jornada: doc.jornada || "Matutina", // Asignar jornada por defecto si no tiene
              }))

            setDoctoresRegistrados(doctoresProcesados)
            localStorage.setItem("doctoresEPS", JSON.stringify(doctoresProcesados))
            console.log("Doctores cargados y procesados:", doctoresProcesados)
          }
        } catch (error) {
          console.error("Error al cargar doctores:", error)
          localStorage.setItem("doctoresEPS", JSON.stringify(doctoresIniciales))
          setDoctoresRegistrados(doctoresIniciales)
        }
      }

      // Inicializar pacientes si no existen
      if (!localStorage.getItem("pacientesEPS")) {
        localStorage.setItem("pacientesEPS", JSON.stringify(pacientesIniciales))
        setPacientesRegistrados(pacientesIniciales)
        console.log("Pacientes inicializados:", pacientesIniciales)
      } else {
        try {
          const pacientesGuardados = JSON.parse(localStorage.getItem("pacientesEPS"))
          setPacientesRegistrados(pacientesGuardados)
          console.log("Pacientes cargados:", pacientesGuardados)
        } catch (error) {
          console.error("Error al cargar pacientes:", error)
          localStorage.setItem("pacientesEPS", JSON.stringify(pacientesIniciales))
          setPacientesRegistrados(pacientesIniciales)
        }
      }

      // Inicializar citas si no existen
      const citasGuardadas = localStorage.getItem("citasEPS")
      if (citasGuardadas) {
        try {
          const citas = JSON.parse(citasGuardadas)
          setCitasRegistradas(citas)
          console.log("Citas cargadas:", citas)
        } catch (error) {
          console.error("Error al cargar citas:", error)
          setCitasRegistradas([])
        }
      } else {
        setCitasRegistradas([])
      }

      setDataCargada(true)
    }
  }, [dataCargada])

  // Filtrar doctores
  const doctoresFiltrados = doctoresRegistrados.filter((doctor) => {
    if (!doctor) return false

    const matchesSearch =
      doctor.nombre.toLowerCase().includes(searchDoctor.toLowerCase()) || doctor.cedula.includes(searchDoctor)
    const matchesEspecialidad = filtroEspecialidad === "" || doctor.especialidad === filtroEspecialidad
    const matchesJornada = filtroJornada === "" || doctor.jornada === filtroJornada

    return matchesSearch && matchesEspecialidad && matchesJornada
  })

  // Filtrar pacientes
  const pacientesFiltrados = pacientesRegistrados.filter(
    (paciente) =>
      paciente &&
      (paciente.nombre.toLowerCase().includes(searchPaciente.toLowerCase()) ||
        paciente.cedula.includes(searchPaciente)),
  )

  // Obtener citas de hoy
  const hoy = new Date().toISOString().split("T")[0]
  const citasHoy = citasRegistradas
    .filter((cita) => cita && cita.fecha === hoy)
    .map((cita) => {
      const paciente = pacientesRegistrados.find((p) => p && p.id === cita.pacienteId)
      const doctor = doctoresRegistrados.find((d) => d && d.id === cita.doctorId)
      return {
        id: cita.id,
        paciente: paciente ? paciente.nombre : "Paciente desconocido",
        doctor: doctor ? doctor.nombre : "Doctor desconocido",
        hora: cita.hora,
        estado: cita.estado,
      }
    })

  // Manejar cambios en formulario de doctor
  const handleDoctorChange = (e) => {
    const { name, value } = e.target
    setNuevoDoctor((prev) => ({ ...prev, [name]: value }))
  }

  // Manejar cambios en formulario de paciente
  const handlePacienteChange = (e) => {
    const { name, value } = e.target
    setNuevoPaciente((prev) => ({ ...prev, [name]: value }))
  }

  // Agregar nuevo doctor
  const agregarDoctor = () => {
    // Validar campos
    if (!nuevoDoctor.nombre || !nuevoDoctor.cedula || !nuevoDoctor.usuario || !nuevoDoctor.password) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    // Verificar usuario único
    const todosLosUsuarios = [
      ...doctoresRegistrados.filter((d) => d).map((d) => d.usuario),
      ...pacientesRegistrados.filter((p) => p).map((p) => p.usuario),
    ]

    if (todosLosUsuarios.includes(nuevoDoctor.usuario)) {
      toast({
        title: "Error",
        description: "El nombre de usuario ya existe",
        variant: "destructive",
      })
      return
    }

    // Agregar doctor
    const nuevoId =
      doctoresRegistrados.length > 0 ? Math.max(...doctoresRegistrados.filter((d) => d).map((d) => d.id)) + 1 : 1

    const nuevoDocObj = {
      id: nuevoId,
      nombre: nuevoDoctor.nombre,
      cedula: nuevoDoctor.cedula,
      especialidad: nuevoDoctor.especialidad,
      jornada: nuevoDoctor.jornada,
      citas: 0,
      usuario: nuevoDoctor.usuario,
      password: nuevoDoctor.password,
      tipo: "doctor", // Importante: añadir el tipo para el login
    }

    const nuevaListaDoctores = [...doctoresRegistrados, nuevoDocObj]
    setDoctoresRegistrados(nuevaListaDoctores)

    // Actualizar localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("doctoresEPS", JSON.stringify(nuevaListaDoctores))
      console.log("Doctor agregado:", nuevoDocObj)
      console.log("Nueva lista de doctores:", nuevaListaDoctores)
    }

    toast({
      title: "Doctor agregado",
      description: "El doctor ha sido registrado exitosamente",
    })

    // Limpiar formulario y cerrar diálogo
    setNuevoDoctor({
      nombre: "",
      cedula: "",
      especialidad: "Medicina General",
      jornada: "Matutina",
      usuario: "",
      password: "",
    })
    setShowAddDoctorDialog(false)
  }

  // Agregar nuevo paciente
  const agregarPaciente = () => {
    // Validar campos
    if (!nuevoPaciente.nombre || !nuevoPaciente.cedula || !nuevoPaciente.usuario || !nuevoPaciente.password) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    // Verificar usuario único
    const todosLosUsuarios = [
      ...doctoresRegistrados.filter((d) => d).map((d) => d.usuario),
      ...pacientesRegistrados.filter((p) => p).map((p) => p.usuario),
    ]

    if (todosLosUsuarios.includes(nuevoPaciente.usuario)) {
      toast({
        title: "Error",
        description: "El nombre de usuario ya existe",
        variant: "destructive",
      })
      return
    }

    // Agregar paciente
    const nuevoId =
      pacientesRegistrados.length > 0 ? Math.max(...pacientesRegistrados.filter((p) => p).map((p) => p.id)) + 1 : 1

    const nuevoPacObj = {
      id: nuevoId,
      nombre: nuevoPaciente.nombre,
      cedula: nuevoPaciente.cedula,
      edad: Number.parseInt(nuevoPaciente.edad) || 0,
      genero: nuevoPaciente.genero,
      telefono: nuevoPaciente.telefono || "",
      direccion: nuevoPaciente.direccion || "",
      usuario: nuevoPaciente.usuario,
      password: nuevoPaciente.password,
      tipo: "paciente", // Importante: añadir el tipo para el login
      ultimaCita: null,
      proximaCita: null,
    }

    const nuevaListaPacientes = [...pacientesRegistrados, nuevoPacObj]
    setPacientesRegistrados(nuevaListaPacientes)

    // Actualizar localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("pacientesEPS", JSON.stringify(nuevaListaPacientes))
      console.log("Paciente agregado:", nuevoPacObj)
      console.log("Nueva lista de pacientes:", nuevaListaPacientes)
    }

    toast({
      title: "Paciente agregado",
      description: "El paciente ha sido registrado exitosamente",
    })

    // Limpiar formulario y cerrar diálogo
    setNuevoPaciente({
      nombre: "",
      cedula: "",
      edad: "",
      genero: "Masculino",
      telefono: "",
      direccion: "",
      usuario: "",
      password: "",
    })
    setShowAddPacienteDialog(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminNavbar activeItem="dashboard" />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Doctores</CardTitle>
                <UserCog className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{doctoresRegistrados.filter((d) => d).length}</div>
                <p className="text-xs text-muted-foreground">
                  {doctoresRegistrados.filter((d) => d && d.jornada === "Matutina").length} matutina,{" "}
                  {doctoresRegistrados.filter((d) => d && d.jornada === "Vespertina").length} vespertina
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pacientesRegistrados.filter((p) => p).length}</div>
                <p className="text-xs text-muted-foreground">Pacientes registrados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{citasHoy.length}</div>
                <p className="text-xs text-muted-foreground">
                  {citasHoy.filter((c) => c.estado === "completada").length} completadas,{" "}
                  {citasHoy.filter((c) => c.estado !== "completada").length} pendientes
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="doctors" className="space-y-4">
            <TabsList>
              <TabsTrigger value="doctors">Doctores</TabsTrigger>
              <TabsTrigger value="patients">Pacientes</TabsTrigger>
              <TabsTrigger value="appointments">Citas de Hoy</TabsTrigger>
            </TabsList>
            <TabsContent value="doctors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Doctores</CardTitle>
                  <CardDescription>Administre los doctores registrados en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nombre o cédula"
                        className="pl-8"
                        value={searchDoctor}
                        onChange={(e) => setSearchDoctor(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select value={filtroEspecialidad} onValueChange={setFiltroEspecialidad}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Especialidad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Medicina General">Medicina General</SelectItem>
                          <SelectItem value="Cardiología">Cardiología</SelectItem>
                          <SelectItem value="Dermatología">Dermatología</SelectItem>
                          <SelectItem value="Pediatría">Pediatría</SelectItem>
                          <SelectItem value="Oftalmología">Oftalmología</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filtroJornada} onValueChange={setFiltroJornada}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Jornada" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Matutina">Matutina</SelectItem>
                          <SelectItem value="Vespertina">Vespertina</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Cédula</TableHead>
                          <TableHead>Especialidad</TableHead>
                          <TableHead>Jornada</TableHead>
                          <TableHead>Usuario</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {doctoresFiltrados.length > 0 ? (
                          doctoresFiltrados.map((doctor) => (
                            <TableRow key={doctor.id}>
                              <TableCell className="font-medium">{doctor.nombre}</TableCell>
                              <TableCell>{doctor.cedula}</TableCell>
                              <TableCell>{doctor.especialidad}</TableCell>
                              <TableCell>{doctor.jornada}</TableCell>
                              <TableCell>{doctor.usuario}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  Editar
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  Eliminar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                              No se encontraron doctores
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Dialog open={showAddDoctorDialog} onOpenChange={setShowAddDoctorDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar Doctor
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Agregar Nuevo Doctor</DialogTitle>
                          <DialogDescription>
                            Complete el formulario para registrar un nuevo doctor en el sistema.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">
                              Nombre
                            </Label>
                            <Input
                              id="nombre"
                              name="nombre"
                              value={nuevoDoctor.nombre}
                              onChange={handleDoctorChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cedula" className="text-right">
                              Cédula
                            </Label>
                            <Input
                              id="cedula"
                              name="cedula"
                              value={nuevoDoctor.cedula}
                              onChange={handleDoctorChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="especialidad" className="text-right">
                              Especialidad
                            </Label>
                            <Select
                              name="especialidad"
                              value={nuevoDoctor.especialidad}
                              onValueChange={(value) => setNuevoDoctor((prev) => ({ ...prev, especialidad: value }))}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Seleccione especialidad" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Medicina General">Medicina General</SelectItem>
                                <SelectItem value="Cardiología">Cardiología</SelectItem>
                                <SelectItem value="Dermatología">Dermatología</SelectItem>
                                <SelectItem value="Pediatría">Pediatría</SelectItem>
                                <SelectItem value="Oftalmología">Oftalmología</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Jornada</Label>
                            <RadioGroup
                              className="col-span-3"
                              value={nuevoDoctor.jornada}
                              onValueChange={(value) => setNuevoDoctor((prev) => ({ ...prev, jornada: value }))}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Matutina" id="matutina" />
                                <Label htmlFor="matutina">Matutina</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Vespertina" id="vespertina" />
                                <Label htmlFor="vespertina">Vespertina</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="usuario" className="text-right">
                              Usuario
                            </Label>
                            <Input
                              id="usuario"
                              name="usuario"
                              value={nuevoDoctor.usuario}
                              onChange={handleDoctorChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                              Contraseña
                            </Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={nuevoDoctor.password}
                              onChange={handleDoctorChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={agregarDoctor}>
                            Guardar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="patients" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Pacientes</CardTitle>
                  <CardDescription>Administre los pacientes registrados en el sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nombre o cédula"
                        className="pl-8"
                        value={searchPaciente}
                        onChange={(e) => setSearchPaciente(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre</TableHead>
                          <TableHead>Cédula</TableHead>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Última Cita</TableHead>
                          <TableHead>Próxima Cita</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pacientesFiltrados.length > 0 ? (
                          pacientesFiltrados.map((paciente) => (
                            <TableRow key={paciente.id}>
                              <TableCell className="font-medium">{paciente.nombre}</TableCell>
                              <TableCell>{paciente.cedula}</TableCell>
                              <TableCell>{paciente.usuario}</TableCell>
                              <TableCell>
                                {paciente.ultimaCita
                                  ? new Date(paciente.ultimaCita).toLocaleDateString()
                                  : "Sin citas previas"}
                              </TableCell>
                              <TableCell>
                                {paciente.proximaCita
                                  ? new Date(paciente.proximaCita).toLocaleDateString()
                                  : "Sin citas programadas"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  Ver Historial
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Editar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                              No se encontraron pacientes
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Dialog open={showAddPacienteDialog} onOpenChange={setShowAddPacienteDialog}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar Paciente
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
                          <DialogDescription>
                            Complete el formulario para registrar un nuevo paciente en el sistema.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nombre" className="text-right">
                              Nombre
                            </Label>
                            <Input
                              id="nombre"
                              name="nombre"
                              value={nuevoPaciente.nombre}
                              onChange={handlePacienteChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cedula" className="text-right">
                              Cédula
                            </Label>
                            <Input
                              id="cedula"
                              name="cedula"
                              value={nuevoPaciente.cedula}
                              onChange={handlePacienteChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edad" className="text-right">
                              Edad
                            </Label>
                            <Input
                              id="edad"
                              name="edad"
                              type="number"
                              value={nuevoPaciente.edad}
                              onChange={handlePacienteChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Género</Label>
                            <RadioGroup
                              className="col-span-3"
                              value={nuevoPaciente.genero}
                              onValueChange={(value) => setNuevoPaciente((prev) => ({ ...prev, genero: value }))}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Masculino" id="masculino" />
                                <Label htmlFor="masculino">Masculino</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="Femenino" id="femenino" />
                                <Label htmlFor="femenino">Femenino</Label>
                              </div>
                            </RadioGroup>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="telefono" className="text-right">
                              Teléfono
                            </Label>
                            <Input
                              id="telefono"
                              name="telefono"
                              value={nuevoPaciente.telefono}
                              onChange={handlePacienteChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="direccion" className="text-right">
                              Dirección
                            </Label>
                            <Input
                              id="direccion"
                              name="direccion"
                              value={nuevoPaciente.direccion}
                              onChange={handlePacienteChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="usuario" className="text-right">
                              Usuario
                            </Label>
                            <Input
                              id="usuario"
                              name="usuario"
                              value={nuevoPaciente.usuario}
                              onChange={handlePacienteChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                              Contraseña
                            </Label>
                            <Input
                              id="password"
                              name="password"
                              type="password"
                              value={nuevoPaciente.password}
                              onChange={handlePacienteChange}
                              className="col-span-3"
                              required
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={agregarPaciente}>
                            Guardar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Citas de Hoy</CardTitle>
                  <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Paciente</TableHead>
                          <TableHead>Doctor</TableHead>
                          <TableHead>Hora</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {citasHoy.length > 0 ? (
                          citasHoy.map((cita) => (
                            <TableRow key={cita.id}>
                              <TableCell className="font-medium">{cita.paciente}</TableCell>
                              <TableCell>{cita.doctor}</TableCell>
                              <TableCell>{cita.hora}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    cita.estado === "completada"
                                      ? "bg-green-100 text-green-800"
                                      : cita.estado === "en_curso"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {cita.estado === "completada"
                                    ? "Completada"
                                    : cita.estado === "en_curso"
                                      ? "En curso"
                                      : "Pendiente"}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  Ver Detalles
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground">
                              No hay citas programadas para hoy
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
