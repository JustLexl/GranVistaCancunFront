import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '@/app/api-config';

export interface User {
    _id?: string;
    name: string;
    email: string;
    role?: string;
    jobPosition?: string;
    jobArea?: string;
    phone?: number;
    firebaseUid?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    private apiUrl = `${API_BASE_URL}/api/usuarios`;

    constructor(private http: HttpClient) {}

    getUsuarios(): Observable<User[]> {
        return this.http.get<User[]>(this.apiUrl);
    }

    getUserByFirebaseUid(uid: string): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/firebase/${uid}`);
    }

    updateUser(id: string, data: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${id}`, data);
    }
}
