import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {Room, RoomService} from '../../../services/room/room.service';

@Component({
  selector: 'app-edit-room',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-room.component.html',
  styleUrl: './edit-room.component.css'
})
export class EditRoomComponent implements OnInit {
  roomForm: FormGroup;
  loading = false;
  errorMessage = '';
  roomId = 0;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.roomForm = this.fb.group({
      name: ['', [Validators.required]],
      capacity: [1, [Validators.required, Validators.min(1)]],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      isAvailable: [true]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.roomId = Number(idParam);
    } else {
      this.errorMessage = 'Room ID is missing';
    }
  }

  ngOnInit(): void {
    if (this.roomId) {
      this.loadRoom();
    }
  }

  loadRoom(): void {
    this.loading = true;
    this.roomService.getRoom(this.roomId).subscribe({
      next: (room) => {
        this.roomForm.patchValue({
          name: room.name,
          capacity: room.capacity,
          type: room.type,
          description: room.description,
          isAvailable: room.isAvailable
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load room details';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.roomForm.invalid || !this.roomId) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const roomData: Room = this.roomForm.value;

    this.roomService.updateRoom(this.roomId, roomData).subscribe({
      next: () => {
        this.router.navigate(['/rooms']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || 'An error occurred while updating the room';
      }
    });
  }
}
