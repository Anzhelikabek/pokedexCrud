import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  fetchPokemon(offset: number = 0, limit: number = 20): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?offset=${offset}&limit=${limit}`);
  }

  getPokemon(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${name}`);
  }
  getPokemonSpecies(id: number): Observable<any> {
    return this.http.get<any>(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get<any>(url); // Получение детальных данных по URL покемона
  }
}
