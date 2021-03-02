import { Contato } from './contato.model';
export interface PaginaContato {
  content : Contato[];
  totalElements : number;
  size : number;
  number : number;
}
