export type Roles = 'SUSCRIPTOR' | 'ADMIN' | 'DOCENTE' ;

export interface User {
  username: string;
  password: string;
  names: string;
  surnames: string;
  documentType:number;
  document:number;
}

export interface UserResponse extends User {
  message: string;
  token: string;
  userId: number;
  names: string;
  role: Roles;
}
