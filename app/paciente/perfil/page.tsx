"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PacienteNavbar } from "@/components/paciente-navbar"
import { PacienteHeader } from "@/components/paciente-header"
import { toast } from "@/components/ui/use-toast"

export default function PerfilPacientePage() {
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    direccion: "",
    email: "",
    usuario: "",
  })

  const [datosPassword, setDatosPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [cargando, setCargando] = useState(true)

  // Cargar datos del usuario
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Obtener usuario actual
      const usuarioGuardado = localStorage.getItem("usuarioEPS")
      if (usuarioGuardado) {
        try {
          const usuario = JSON.parse(usuarioGuardado)
          console.log("Usuario actual:", usuario)

          // Buscar datos completos del paciente
          const pacientesGuardados = localStorage.getItem("pacientesEPS")
          if (pacientesGuardados) {
            const pacientes = JSON.parse(pacientesGuardados)
            const pacienteEncontrado = pacientes.find((p) => p && p.usuario === usuario.usuario)

            if (pacienteEncontrado) {
              console.log("Paciente encontrado:", pacienteEncontrado)
              setDatosUsuario({
                nombre: pacienteEncontrado.nombre || "",
                cedula: pacienteEncontrado.cedula || "",
                telefono: pacienteEncontrado.telefono || "",
                direccion: pacienteEncontrado.direccion || "",
                email: pacienteEncontrado.email || "",
                usuario: pacienteEncontrado.usuario || "",
              })
            }
          }
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error)
        }
      }
      setCargando(false)
    }
  }, [])

  const handleDatosChange = (e) => {
    const { name, value } = e.target
    setDatosUsuario((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setDatosPassword((prev) => ({ ...prev, [name]: value }))
  }

  const guardarCambiosPerfil = (e) => {
    e.preventDefault()

    // Validar datos
    if (!datosUsuario.nombre || !datosUsuario.cedula) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    // Actualizar datos del paciente en localStorage
    const pacientesGuardados = localStorage.getItem("pacientesEPS")
    if (pacientesGuardados) {
      try {
        const pacientes = JSON.parse(pacientesGuardados)
        const pacientesActualizados = pacientes.map((p) => {
          if (p && p.usuario === datosUsuario.usuario) {
            return {
              ...p,
              nombre: datosUsuario.nombre,
              cedula: datosUsuario.cedula,
              telefono: datosUsuario.telefono,
              direccion: datosUsuario.direccion,
              email: datosUsuario.email,
            }
          }
          return p
        })

        localStorage.setItem("pacientesEPS", JSON.stringify(pacientesActualizados))

        // Actualizar también el nombre en el usuario actual
        const usuarioGuardado = localStorage.getItem("usuarioEPS")
        if (usuarioGuardado) {
          const usuario = JSON.parse(usuarioGuardado)
          usuario.nombre = datosUsuario.nombre
          localStorage.setItem("usuarioEPS", JSON.stringify(usuario))
        }

        toast({
          title: "Perfil actualizado",
          description: "Sus datos han sido actualizados correctamente",
        })
      } catch (error) {
        console.error("Error al actualizar perfil:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al actualizar su perfil",
          variant: "destructive",
        })
      }
    }
  }

  const cambiarPassword = (e) => {
    e.preventDefault()

    // Validar contraseñas
    if (!datosPassword.currentPassword || !datosPassword.newPassword || !datosPassword.confirmPassword) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      })
      return
    }

    if (datosPassword.newPassword !== datosPassword.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden",
        variant: "destructive",
      })
      return
    }

    // Verificar contraseña actual
    const pacientesGuardados = localStorage.getItem("pacientesEPS")
    if (pacientesGuardados) {
      try {
        const pacientes = JSON.parse(pacientesGuardados)
        const pacienteEncontrado = pacientes.find((p) => p && p.usuario === datosUsuario.usuario)

        if (pacienteEncontrado && pacienteEncontrado.password === datosPassword.currentPassword) {
          // Actualizar contraseña
          const pacientesActualizados = pacientes.map((p) => {
            if (p && p.usuario === datosUsuario.usuario) {
              return {
                ...p,
                password: datosPassword.newPassword,
              }
            }
            return p
          })

          localStorage.setItem("pacientesEPS", JSON.stringify(pacientesActualizados))

          toast({
            title: "Contraseña actualizada",
            description: "Su contraseña ha sido actualizada correctamente",
          })

          // Limpiar formulario
          setDatosPassword({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          })
        } else {
          toast({
            title: "Error",
            description: "La contraseña actual es incorrecta",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error al cambiar contraseña:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al actualizar su contraseña",
          variant: "destructive",
        })
      }
    }
  }

  if (cargando) {
    return (
      <div className="flex min-h-screen flex-col">
        <PacienteHeader />
        <div className="flex flex-1">
          <PacienteNavbar activeItem="perfil" />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-full">
              <p>Cargando datos del perfil...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PacienteHeader />
      <div className="flex flex-1">
        <PacienteNavbar activeItem="perfil" />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualice su información personal</CardDescription>
              </CardHeader>
              <form onSubmit={guardarCambiosPerfil}>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cedula">Cédula</Label>
                      <Input
                        id="cedula"
                        name="cedula"
                        value={datosUsuario.cedula}
                        onChange={handleDatosChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre Completo</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        value={datosUsuario.nombre}
                        onChange={handleDatosChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={datosUsuario.email}
                        onChange={handleDatosChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" name="telefono" value={datosUsuario.telefono} onChange={handleDatosChange} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="direccion">Dirección</Label>
                      <Input
                        id="direccion"
                        name="direccion"
                        value={datosUsuario.direccion}
                        onChange={handleDatosChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Guardar Cambios</Button>
                </CardFooter>
              </form>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
                <CardDescription>Actualice su contraseña de acceso</CardDescription>
              </CardHeader>
              <form onSubmit={cambiarPassword}>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Contraseña Actual</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={datosPassword.currentPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nueva Contraseña</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={datosPassword.newPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={datosPassword.confirmPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Cambiar Contraseña</Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
