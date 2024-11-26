import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {Pokemon} from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  fetchPokemon(offset: number = 0, limit: number = 3): Observable<any> {
    return this.http.get<Pokemon>(`${this.baseUrl}?offset=${offset}&limit=${limit}`);
  }

  getPokemon(name: string): Observable<any> {
    return this.http.get<Pokemon>(`${this.baseUrl}/${name}`);
  }
  getPokemonSpecies(id: any): Observable<any> {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  }

  getPokemonDetails(url: string): Observable<any> {
    return this.http.get<Pokemon>(url); // Получение детальных данных по URL покемона
  }
}
