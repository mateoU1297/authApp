import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  registro(name: string, email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth/new`;
    const body = { name, email, password };

    return this.http.post<AuthResponse>(url, body)
    .pipe(
      tap(({ok, token}) => {
        if (ok) {
          localStorage.setItem('token', token!);
        }
      }),
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    );
  }

  login(email: string, password: string): Observable<any> {
    const url = `${this.baseUrl}/auth`;
    const body = { email, password };

    return this.http.post<AuthResponse>(url, body)
    .pipe(
      tap(({ok, token}) => {
        if (ok) {
          localStorage.setItem('token', token!);
        }
      }),
      map(resp => resp.ok),
      catchError(err => of(err.error.msg))
    );
  }

  validarToken(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/renew`;
    const headers = new HttpHeaders().set('x-token', localStorage.getItem('token') || '');

    return this.http.get<AuthResponse>(url, {headers})
      .pipe(
        map(resp => {
          localStorage.setItem('token', resp.token!);
          this._usuario = {
            name: resp.name!,
            uid: resp.uid!,
            email: resp.email!
          }
          return resp.ok;
        }),
        catchError(err => of(false))
      );
  }

  logout(): void {
    localStorage.clear();
  }
}
