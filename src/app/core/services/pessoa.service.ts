
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pessoa } from '../../models/pessoa.model';

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7030/api/PessoaEndereco';

  listar(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Pessoa> {
    return this.http.get<Pessoa>(`${this.apiUrl}/${id}`);
  }

  cadastrar(pessoa: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>(this.apiUrl, pessoa);
  }

  atualizar(id: number, pessoa: Pessoa): Observable<Pessoa> {return this.http.put<Pessoa>(`${this.apiUrl}/${id}`, pessoa);
  }
}
