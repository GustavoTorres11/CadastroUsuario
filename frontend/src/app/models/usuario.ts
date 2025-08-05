export interface UsuarioListar {
  id?: string;
  nome?: string;
  email?: string;
  senha?: string;
  endereco?: string;
  cpf?: string;
  telefone?: string;
  role?: string;
}

export interface UsuarioResult {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: string;
  role: string;
}