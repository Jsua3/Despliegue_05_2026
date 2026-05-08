export type Role = 'USER' | 'STAFF' | 'ADMIN';
export type ItemStatus = 'BORRADOR' | 'ENVIADO' | 'EN_REVISION' | 'APROBADO' | 'RECHAZADO';

export interface UserResponse {
  id: number;
  nombre: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

export interface CatalogoResponse {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface ItemCreateRequest {
  catalogoId: number;
  titulo: string;
  descripcion: string;
  solicitanteNombre: string;
  contacto: string;
  cantidad: number;
  fechaObjetivo?: string | null;
}

export interface ItemResponse {
  id: number;
  titulo: string;
  descripcion: string;
  solicitanteNombre: string;
  contacto: string;
  cantidad: number;
  fechaObjetivo?: string | null;
  status: ItemStatus;
  observacionesStaff?: string | null;
  catalogo: CatalogoResponse;
  createdBy: UserResponse;
  createdAt: string;
  updatedAt: string;
  enviadoAt?: string | null;
  revisadoAt?: string | null;
}

export interface DashboardSummaryResponse {
  totalItems: number;
  catalogosActivos: number;
  itemsPorEstado: Record<ItemStatus, number>;
}
