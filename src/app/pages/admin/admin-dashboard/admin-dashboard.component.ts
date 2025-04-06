import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Room, RoomService } from '../../../services/room/room.service';
import { Bed, BedService } from '../../../services/bed/bed.service';
import { Booking, BookingService } from '../../../services/booking.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  rooms: Room[] = [];
  beds: Bed[] = [];
  bookings: Booking[] = [];
  loading = true;
  errorMessage = '';
  deleteLoading = false;
  isAuthenticated = false;

  constructor(
    private roomService: RoomService,
    private bedService: BedService,
    private bookingService: BookingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.loadAdminResources();
      }
    });
  }

  loadAdminResources(): void {
    this.loading = true;

    // Parallel loading of resources
    Promise.all([
      this.roomService.getRooms().toPromise(),
      this.bedService.getBeds().toPromise(),
      this.bookingService.getBookings().toPromise()
    ]).then(([rooms, beds, bookings]) => {
      this.rooms = rooms || [];
      this.beds = beds || [];
      this.bookings = bookings || [];
      this.loading = false;
    }).catch(error => {
      this.errorMessage = 'Failed to load admin resources';
      this.loading = false;
    });
  }

  deleteRoom(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this room?')) {
      this.deleteLoading = true;
      this.roomService.deleteRoom(id).subscribe({
        next: () => {
          this.rooms = this.rooms.filter(room => room.id !== id);
          this.deleteLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to delete room';
          this.deleteLoading = false;
        }
      });
    }
  }

  deleteBed(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this bed?')) {
      this.deleteLoading = true;
      this.bedService.deleteBed(id).subscribe({
        next: () => {
          this.beds = this.beds.filter(bed => bed.id !== id);
          this.deleteLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to delete bed';
          this.deleteLoading = false;
        }
      });
    }
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
