import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Bed {
  id?: number;
  number: number;
  room?: any;
  isAvailable: boolean;
  bedNumber: string;
  isCleaned: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class BedService {
  private apiUrl = 'https://auberge-jeunesse.pierrenogaro.com/api';

  constructor(private http: HttpClient) {}

  getBeds(): Observable<Bed[]> {
    return this.http.get<Bed[]>(`${this.apiUrl}/beds`);
  }

  getBed(id: number): Observable<Bed> {
    return this.http.get<Bed>(`${this.apiUrl}/beds/${id}`).pipe(
      tap(bed => console.log('Retrieved bed:', bed))
    );
  }

  createBed(bed: Bed): Observable<Bed> {
    const bedToCreate = { ...bed };
    return this.http.post<Bed>(`${this.apiUrl}/create/bed`, bedToCreate);
  }

  updateBed(id: number, bed: Bed): Observable<Bed> {
    const bedToUpdate = { ...bed };

    if (typeof bedToUpdate.room === 'number' || typeof bedToUpdate.room === 'string') {
      const roomId = bedToUpdate.room;
      bedToUpdate.room = { id: roomId };
    }

    console.log('Sending to API:', bedToUpdate);

    return this.http.put<Bed>(`${this.apiUrl}/edit/bed/${id}`, bedToUpdate);
  }

  deleteBed(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/bed/${id}`);
  }

  updateCleanStatus(id: number, isCleaned: boolean): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/beds/edit/${id}/clean-status`, { isCleaned });
  }
}
