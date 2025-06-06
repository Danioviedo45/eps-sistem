"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { ShieldCheck } from "lucide-react"

// Datos iniciales para doctores y pacientes (como respaldo)
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
]

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
    ultimaCita: null,
    proximaCita: null,
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
    proximaCita: null,
  },
]

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    apellidos: "",
    tipo: "paciente",
    usuario: "",
    password: "",
    confirmPassword: "",
    especialidad: "Medicina General", // Solo para doctores
    jornada: "Matutina", // Solo para doctores
  })
  const [loading, setLoading] = useState(false)
  const [doctoresRegistrados, setDoctoresRegistrados] = useState([])
  const [pacientesRegistrados, setPacientesRegistrados] = useState([])
  const [dataCargada, setDataCargada] = useState(false)

  // Cargar datos existentes
  useEffect(() => {
    if (typeof window !== "undefined" && !dataCargada) {
      console.log("Cargando datos para el formulario de registro...")

      // Cargar doctores
      const doctoresGuardados = localStorage.getItem("doctoresEPS")
      if (doctoresGuardados) {
        try {
          const doctores = JSON.parse(doctoresGuardados)
          console.log("Doctores cargados:", doctores)

          // Si no hay doctores o el array está vacío, usar los datos iniciales
          if (!doctores || doctores.length === 0) {
            console.log("No hay doctores guardados, usando datos iniciales")
            setDoctoresRegistrados(doctoresIniciales)
            localStorage.setItem("doctoresEPS", JSON.stringify(doctoresIniciales))
          } else {
            // Asegurarse de que todos los doctores tengan especialidad
            const doctoresProcesados = doctores
              .filter((doc) => doc) // Filtrar valores nulos
              .map((doc) => ({
                ...doc,
                especialidad: doc.especialidad || "Medicina General", // Asignar especialidad por defecto si no tiene
              }))

            setDoctoresRegistrados(doctoresProcesados)
            localStorage.setItem("doctoresEPS", JSON.stringify(doctoresProcesados))
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

      // Cargar pacientes
      const pacientesGuardados = localStorage.getItem("pacientesEPS")
      if (pacientesGuardados) {
        try {
          const pacientes = JSON.parse(pacientesGuardados)
          console.log("Pacientes cargados:", pacientes)

          // Si no hay pacientes o el array está vacío, usar los datos iniciales
          if (!pacientes || pacientes.length === 0) {
            console.log("No hay pacientes guardados, usando datos iniciales")
            setPacientesRegistrados(pacientesIniciales)
            localStorage.setItem("pacientesEPS", JSON.stringify(pacientesIniciales))
          } else {
            setPacientesRegistrados(pacientes)
          }
        } catch (error) {
          console.error("Error al cargar pacientes:", error)
          // En caso de error, usar los datos iniciales
          setPacientesRegistrados(pacientesIniciales)
          localStorage.setItem("pacientesEPS", JSON.stringify(pacientesIniciales))
        }
      } else {
        console.log("No se encontraron pacientes, usando valores por defecto")
        setPacientesRegistrados(pacientesIniciales)
        localStorage.setItem("pacientesEPS", JSON.stringify(pacientesIniciales))
      }

      setDataCargada(true)
    }
  }, [dataCargada])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log("Procesando registro con datos:", formData)

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    // Verificar si el usuario ya existe
    if (typeof window !== "undefined") {
      let usuarioExistente = false

      // Verificar en doctores
      if (doctoresRegistrados.some((d) => d && d.usuario === formData.usuario)) {
        usuarioExistente = true
      }

      // Verificar en pacientes
      if (pacientesRegistrados.some((p) => p && p.usuario === formData.usuario)) {
        usuarioExistente = true
      }

      if (usuarioExistente) {
        toast({
          title: "Error",
          description: "El nombre de usuario ya existe",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      try {
        // Registrar nuevo usuario
        if (formData.tipo === "paciente") {
          // Registrar paciente
          const nuevoId =
            pacientesRegistrados.length > 0
              ? Math.max(...pacientesRegistrados.filter((p) => p && p.id).map((p) => p.id)) + 1
              : 1

          const nombreCompleto = `${formData.nombre} ${formData.apellidos}`.trim()

          const nuevoPaciente = {
            id: nuevoId,
            nombre: nombreCompleto,
            cedula: formData.cedula,
            edad: 30, // Valor por defecto
            genero: "No especificado",
            telefono: "",
            direccion: "",
            usuario: formData.usuario,
            password: formData.password,
            tipo: "paciente",
            ultimaCita: null,
            proximaCita: null,
          }

          // Filtrar valores nulos antes de agregar el nuevo paciente
          const pacientesFiltrados = pacientesRegistrados.filter((p) => p)
          const nuevaListaPacientes = [...pacientesFiltrados, nuevoPaciente]

          localStorage.setItem("pacientesEPS", JSON.stringify(nuevaListaPacientes))
          setPacientesRegistrados(nuevaListaPacientes)

          console.log("Paciente registrado:", nuevoPaciente)
          console.log("Lista actualizada:", nuevaListaPacientes)
        } else if (formData.tipo === "doctor") {
          // Registrar doctor
          const nuevoId =
            doctoresRegistrados.length > 0
              ? Math.max(...doctoresRegistrados.filter((d) => d && d.id).map((d) => d.id)) + 1
              : 1

          const nombreCompleto = `${formData.nombre} ${formData.apellidos}`.trim()

          const nuevoDoctor = {
            id: nuevoId,
            nombre: nombreCompleto,
            cedula: formData.cedula,
            especialidad: formData.especialidad,
            jornada: formData.jornada,
            citas: 0,
            usuario: formData.usuario,
            password: formData.password,
            tipo: "doctor",
          }

          // Filtrar valores nulos antes de agregar el nuevo doctor
          const doctoresFiltrados = doctoresRegistrados.filter((d) => d)
          const nuevaListaDoctores = [...doctoresFiltrados, nuevoDoctor]

          localStorage.setItem("doctoresEPS", JSON.stringify(nuevaListaDoctores))
          setDoctoresRegistrados(nuevaListaDoctores)

          console.log("Doctor registrado:", nuevoDoctor)
          console.log("Lista actualizada:", nuevaListaDoctores)
        }

        toast({
          title: "Registro exitoso",
          description: "Su cuenta ha sido creada correctamente",
        })

        setTimeout(() => {
          router.push("/login")
          setLoading(false)
        }, 1500)
      } catch (error) {
        console.error("Error al registrar usuario:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al registrar el usuario",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <span className="font-bold">EPS Salud</span>
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Crear una cuenta</CardTitle>
            <CardDescription>Ingrese sus datos para registrarse en el sistema</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cedula">Cédula</Label>
                <Input
                  id="cedula"
                  name="cedula"
                  placeholder="Ingrese su número de cédula"
                  required
                  value={formData.cedula}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  placeholder="Ingrese su nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apellidos">Apellidos</Label>
                <Input
                  id="apellidos"
                  name="apellidos"
                  placeholder="Ingrese sus apellidos"
                  required
                  value={formData.apellidos}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label>Tipo de usuario</Label>
                <RadioGroup
                  name="tipo"
                  value={formData.tipo}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value }))}
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paciente" id="paciente" />
                    <Label htmlFor="paciente">Paciente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="doctor" id="doctor" />
                    <Label htmlFor="doctor">Doctor</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.tipo === "doctor" && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="especialidad">Especialidad</Label>
                    <select
                      id="especialidad"
                      name="especialidad"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.especialidad}
                      onChange={handleChange}
                    >
                      <option value="Medicina General">Medicina General</option>
                      <option value="Cardiología">Cardiología</option>
                      <option value="Dermatología">Dermatología</option>
                      <option value="Pediatría">Pediatría</option>
                      <option value="Oftalmología">Oftalmología</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Jornada</Label>
                    <RadioGroup
                      name="jornada"
                      value={formData.jornada}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, jornada: value }))}
                      className="flex"
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
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="usuario">Usuario</Label>
                <Input
                  id="usuario"
                  name="usuario"
                  placeholder="Ingrese un nombre de usuario único"
                  required
                  value={formData.usuario}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Ingrese su contraseña"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirme su contraseña"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrarse"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="text-center text-sm">
          ¿Ya tiene una cuenta?{" "}
          <Link href="/login" className="underline">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}
