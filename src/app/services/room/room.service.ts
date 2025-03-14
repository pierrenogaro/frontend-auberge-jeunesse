import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  id?: number;
  name: string;
  capacity: number;
  type: string;
  description: string;
  isAvailable: boolean;
  beds?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'https://auberge-jeunesse.pierrenogaro.com/api';

  constructor(private http: HttpClient) {}

  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(`${this.apiUrl}/create/room`, room);
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/rooms`);
  }

  getRoom(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/rooms/${id}`);
  }

  updateRoom(id: number | undefined, room: Room): Observable<Room> {
    if (!id) {
      throw new Error('Room ID is required for update');
    }
    return this.http.put<Room>(`${this.apiUrl}/edit/room/${id}`, room);
  }

  deleteRoom(id: number | undefined): Observable<any> {
    if (!id) {
      throw new Error('Room ID is required for deletion');
    }
    return this.http.delete<any>(`${this.apiUrl}/delete/room/${id}`);
  }
}
