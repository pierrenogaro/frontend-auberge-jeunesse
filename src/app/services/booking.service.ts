import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  id?: number;
  name: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  room: { id: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'https://auberge-jeunesse.pierrenogaro.com/api';

  constructor(private http: HttpClient) {}

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/create/booking`, booking);
  }

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(`${this.apiUrl}/bookings`);
  }

  deleteBooking(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete/booking/${id}`);
  }
}
