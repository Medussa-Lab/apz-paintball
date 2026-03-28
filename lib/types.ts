export interface ReservaForm {
  nombre: string
  telefono: string
  email: string
  fecha: string
  jugadores: number
  modalidad: string
  tipoGrupo: 'adultos' | 'ninos' | 'mixto'
  mensaje?: string
}

export type GameMode = {
  id: string
  nombre: string
  descripcion: string
  icono: string
  dificultad: number
  tag?: string
}
