"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [doctoresRegistrados, setDoctoresRegistrados] = useState([])
  const [pacientesRegistrados, setPacientesRegistrados] = useState([])

  // Cargar usuarios registrados
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Cargar doctores
      const doctoresGuardados = localStorage.getItem("doctoresEPS")
      if (doctoresGuardados) {
        try {
          const doctores = JSON.parse(doctoresGuardados)
          console.log("Doctores cargados:", doctores)
          setDoctoresRegistrados(doctores)
        } catch (error) {
          console.error("Error al cargar doctores:", error)
          // Datos por defecto si hay error
          const doctoresPorDefecto = [
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
          setDoctoresRegistrados(doctoresPorDefecto)
          localStorage.setItem("doctoresEPS", JSON.stringify(doctoresPorDefecto))
        }
      } else {
        // Datos por defecto si no hay nada guardado
        const doctoresPorDefecto = [
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
        setDoctoresRegistrados(doctoresPorDefecto)
        localStorage.setItem("doctoresEPS", JSON.stringify(doctoresPorDefecto))
      }

      // Cargar pacientes
      const pacientesGuardados = localStorage.getItem("pacientesEPS")
      if (pacientesGuardados) {
        try {
          const pacientes = JSON.parse(pacientesGuardados)
          console.log("Pacientes cargados:", pacientes)
          setPacientesRegistrados(pacientes)
        } catch (error) {
          console.error("Error al cargar pacientes:", error)
          // Datos por defecto si hay error
          const pacientesPorDefecto = [
            { id: 1, usuario: "paciente1", password: "123456", tipo: "paciente", nombre: "Carlos González" },
            { id: 2, usuario: "paciente2", password: "123456", tipo: "paciente", nombre: "Laura Martínez" },
          ]
          setPacientesRegistrados(pacientesPorDefecto)
          localStorage.setItem("pacientesEPS", JSON.stringify(pacientesPorDefecto))
        }
      } else {
        // Datos por defecto si no hay nada guardado
        const pacientesPorDefecto = [
          { id: 1, usuario: "paciente1", password: "123456", tipo: "paciente", nombre: "Carlos González" },
          { id: 2, usuario: "paciente2", password: "123456", tipo: "paciente", nombre: "Laura Martínez" },
        ]
        setPacientesRegistrados(pacientesPorDefecto)
        localStorage.setItem("pacientesEPS", JSON.stringify(pacientesPorDefecto))
      }
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Modificar la función handleSubmit para guardar correctamente la información del doctor
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Usuarios de prueba (admin siempre disponible)
    const usuarios = [
      { id: 0, usuario: "admin1", password: "123456", tipo: "admin", nombre: "Administrador" },
      ...doctoresRegistrados
        .filter((doc) => doc) // Filtrar valores nulos
        .map((doc) => ({
          id: doc.id,
          usuario: doc.usuario,
          password: doc.password,
          tipo: "doctor",
          nombre: doc.nombre,
          especialidad: doc.especialidad,
          jornada: doc.jornada,
        })),
      ...pacientesRegistrados
        .filter((pac) => pac) // Filtrar valores nulos
        .map((pac) => ({
          id: pac.id,
          usuario: pac.usuario,
          password: pac.password,
          tipo: "paciente",
          nombre: pac.nombre,
        })),
    ]

    console.log("Usuarios disponibles para login:", usuarios)

    // Verificar credenciales
    const usuarioEncontrado = usuarios.find((u) => u.usuario === formData.usuario && u.password === formData.password)

    if (usuarioEncontrado) {
      toast({
        title: "Inicio de sesión exitoso",
        description: `Bienvenido al sistema, ${usuarioEncontrado.nombre}`,
      })

      // Guardar toda la información del usuario encontrado
      localStorage.setItem("usuarioEPS", JSON.stringify(usuarioEncontrado))

      // Redirigir según el tipo de usuario
      if (usuarioEncontrado.tipo === "admin") {
        router.push("/admin/dashboard")
      } else if (usuarioEncontrado.tipo === "doctor") {
        router.push("/doctor/dashboard")
      } else {
        router.push("/paciente/dashboard")
      }
    } else {
      toast({
        title: "Error de autenticación",
        description: "Usuario o contraseña incorrectos",
        variant: "destructive",
      })
    }

    setLoading(false)
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
            <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
            <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="usuario">Usuario</Label>
                <Input
                  id="usuario"
                  name="usuario"
                  placeholder="Ingrese su nombre de usuario"
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
              <div className="text-xs text-muted-foreground">
                <p>Usuarios de prueba:</p>
                <p>- Admin: admin1 / 123456</p>
                <p>- Doctor: doctor1 / 123456</p>
                <p>- Paciente: paciente1 / 123456</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="text-center text-sm">
          ¿No tiene una cuenta?{" "}
          <Link href="/signup" className="underline">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  )
}
