
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7030/api/ItemService';

  listar(): Observable<Item[]> {
    return this.http.get<Item[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.apiUrl}/${id}`);
  }
}
