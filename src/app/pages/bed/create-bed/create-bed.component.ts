import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Bed, BedService } from '../../../services/bed/bed.service';
import { Room, RoomService } from '../../../services/room/room.service';

@Component({
  selector: 'app-create-bed',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-bed.component.html',
  styleUrl: './create-bed.component.css'
})
export class CreateBedComponent implements OnInit {
  bedForm: FormGroup;
  loading = false;
  errorMessage = '';
  success = false;
  rooms: Room[] = [];

  constructor(
    private fb: FormBuilder,
    private bedService: BedService,
    private roomService: RoomService,
    private router: Router
  ) {
    this.bedForm = this.fb.group({
      number: [1, [Validators.required, Validators.min(1)]],
      bedNumber: ['', [Validators.required]],
      room: ['', [Validators.required]],
      isAvailable: [true],
      isCleaned: [false]
    });
  }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load rooms';
      }
    });
  }

  onSubmit(): void {
    if (this.bedForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.success = false;

    const formData = this.bedForm.value;
    const bedData: Bed = {
      number: formData.number,
      bedNumber: formData.bedNumber,
      isAvailable: formData.isAvailable,
      isCleaned: formData.isCleaned,
      room: formData.room
    };

    this.bedService.createBed(bedData).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/beds']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || 'An error occurred while creating the bed';
      }
    });
  }
}
