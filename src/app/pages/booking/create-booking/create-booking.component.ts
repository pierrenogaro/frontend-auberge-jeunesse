import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService, Room } from '../../../services/room/room.service';
import {BookingService} from '../../../services/booking.service';

@Component({
  selector: 'app-create-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-booking.component.html',
  styleUrl: './create-booking.component.css'
})
export class CreateBookingComponent implements OnInit {
  bookingForm: FormGroup;
  rooms: Room[] = [];
  loading = false;
  errorMessage = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private roomService: RoomService,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      numberOfPeople: [1, [Validators.required, Validators.min(1)]],
      room: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms.filter(room => room.isAvailable);
      },
      error: (error) => {
        this.errorMessage = 'Unable to load rooms';
      }
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.success = false;

    const bookingData = {
      ...this.bookingForm.value,
      room: [{ id: this.bookingForm.value.room }]
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: (response) => {
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/bookings']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || 'An error occurred while creating the booking';
      }
    });
  }
}
