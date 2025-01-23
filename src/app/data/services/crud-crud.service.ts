import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {catchError, Observable, tap, throwError} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CrudCrudService {
  private apiUrl = 'https://crudcrud.com/api/3df30b1937be48cf97cd9828f1b572ba/Pokemon';

  constructor(private http: HttpClient) {}

  // Получение всех покемонов с возможностью пагинации
  getPokemons(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }


  // Получение детальной информации о покемоне
  getPokemonDetails(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Добавление покемона
  addPokemon(pokemon: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, pokemon);
  }

  // Удаление покемона
  deletePokemon(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updatePokemon(id: string, pokemon: any): Observable<any> {
    if (!id) {
      console.error('ID is missing or invalid:', id);
      throw new Error('Invalid ID');
    }

    const { _id, ...pokemonData } = pokemon; // Убираем _id перед отправкой
    console.log('Updating Pokemon with ID:', id);
    console.log('Payload:', pokemonData);

    return this.http.put<any>(`${this.apiUrl}/${id}`, pokemonData).pipe(
      map(() => {
        // Если запрос успешный, возвращаем подтверждение без объекта
        return { success: true };
      }),
      catchError((error) => {
        console.error('Ошибка при обновлении покемона:', error);
        return throwError(error);
      })
    );
  }

  searchPokemon(name: string): Observable<any[]> {
    return this.getPokemons().pipe(
      map((pokemons: any[]) =>
        pokemons.filter((pokemon: any) =>
          pokemon.name.toLowerCase().includes(name.toLowerCase())
        )
      )
    );
  }

}
