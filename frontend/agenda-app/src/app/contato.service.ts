import { Contato } from './contato/contato.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PaginaContato } from './contato/paginaContato.model';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  url: string = environment.apiBaseUrl;

  constructor(private http : HttpClient) { }

  salvar(contato : Contato) : Observable<Contato>{
    return this.http.post<Contato>(this.url,contato);
  }

  listar(page:number,size:number) : Observable<PaginaContato>{
    const params = new HttpParams()
    .set('page',page.toString())
    .set('size',size.toString())

    return this.http.get<any>(`${this.url}?${params.toString()}`);
  }

  favoritar(contato:Contato): Observable<any>{
     return this.http.patch(`${this.url}/${contato.id}/favorito`,null);
  }

  uploadFoto(contato:Contato, formData:FormData) : Observable<any> {
    return this.http.patch(`${this.url}/${contato.id}/foto`,formData, { responseType : 'blob'});
  }
}
