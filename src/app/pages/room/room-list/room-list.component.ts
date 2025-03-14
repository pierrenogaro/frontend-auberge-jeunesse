import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {Room, RoomService} from '../../../services/room/room.service';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './room-list.component.html',
  styleUrl: './room-list.component.css'
})
export class RoomListComponent implements OnInit {
  rooms: Room[] = [];
  loading = true;
  errorMessage = '';
  isAuthenticated = false;
  deleteLoading = false;

  constructor(private roomService: RoomService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadRooms();
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  loadRooms(): void {
    this.loading = true;
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to load rooms';
        this.loading = false;
      }
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
}
