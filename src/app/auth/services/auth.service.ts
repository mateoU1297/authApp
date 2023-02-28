import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthResponse, Usuario } from '../interfaces/interfaces';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario;

  get usuario(): Usuario {
    return {...this._usuario};
  }

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth`;
    const body = { email, password };

    return this.http.post<AuthResponse>(url, body)
    .pipe(
      tap(resp => {
        if (resp.ok) {
          this._usuario = {
            name: resp.name!,
            uid: resp.uid!
          }
        }
      }),
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    );
  }
}
