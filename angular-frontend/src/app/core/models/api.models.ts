export type Role = 'USER' | 'ADMIN';
export type ItemStatus = 'BORRADOR' | 'ENVIADO' | 'EN_REVISION' | 'APROBADO' | 'RECHAZADO';
export type PedidoStatus = 'PENDIENTE' | 'CONFIRMADO' | 'ENTREGADO' | 'CANCELADO';

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

export interface ProductoRequest {
  nombre: string;
  categoria: string;
  precioKg: number;
  stockKg: number;
  descripcion: string;
  activo: boolean;
}

export interface ProductoResponse extends ProductoRequest {
  id: number;
  createdAt: string;
  updatedAt: string;
}

export interface PedidoRequest {
  productoId: number;
  productoNombre: string;
  precioKg: number;
  cantidadKg: number;
  clienteNombre: string;
  direccionEntrega: string;
  observaciones?: string | null;
}

export interface PedidoResponse {
  id: number;
  productoId: number;
  productoNombre: string;
  precioKg: number;
  cantidadKg: number;
  total: number;
  clienteNombre: string;
  clienteEmail: string;
  direccionEntrega: string;
  observaciones?: string | null;
  status: PedidoStatus;
  createdAt: string;
  updatedAt: string;
}
