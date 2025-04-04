import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import {Booking, BookingService} from '../../../services/booking.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.css'
})
export class BookingListComponent implements OnInit {
  bookings: Booking[] = [];
  loading = true;
  errorMessage = '';
  isAuthenticated = false;
  deleteLoading = false;

  constructor(
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  loadBookings(): void {
    this.loading = true;
    this.bookingService.getBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Unable to load bookings';
        this.loading = false;
      }
    });
  }

  deleteBooking(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this booking?')) {
      this.deleteLoading = true;
      this.bookingService.deleteBooking(id).subscribe({
        next: () => {
          this.bookings = this.bookings.filter(booking => booking.id !== id);
          this.deleteLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Unable to delete booking';
          this.deleteLoading = false;
        }
      });
    }
  }
}
