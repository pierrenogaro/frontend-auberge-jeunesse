import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {Room, RoomService} from '../../../services/room/room.service';

@Component({
  selector: 'app-create-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.css'
})
export class CreateRoomComponent {
  roomForm: FormGroup;
  loading = false;
  errorMessage = '';
  success = false;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router
  ) {
    this.roomForm = this.fb.group({
      name: ['', [Validators.required]],
      capacity: [1, [Validators.required, Validators.min(1)]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      isAvailable: [true]
    });
  }

  onSubmit(): void {
    if (this.roomForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.success = false;

    const roomData: Room = this.roomForm.value;

    this.roomService.createRoom(roomData).subscribe({
      next: (response) => {
        this.router.navigate(['/rooms']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || 'An error occurred while creating the room';
      }
    });
  }
}
