import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { Room, RoomService } from '../../../services/room/room.service';
import { AuthService } from '../../../services/auth/auth.service';

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
  selectedRoom: Room | null = null;

  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });

    this.route.paramMap.subscribe(params => {
      const roomId = params.get('id');
      if (roomId) {
        this.loadRoomDetails(parseInt(roomId, 10));
      }
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

  loadRoomDetails(roomId: number): void {
    if (!roomId) return;

    this.roomService.getRoom(roomId).subscribe({
      next: (room) => {
        this.selectedRoom = room;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load room details';
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
          if (this.selectedRoom && this.selectedRoom.id === id) {
            this.selectedRoom = null;
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to delete room';
          this.deleteLoading = false;
        }
      });
    }
  }

  viewRoomDetails(room: Room): void {
    this.selectedRoom = room;
  }

  closeRoomDetails(): void {
    this.selectedRoom = null;
  }

  canManageRooms(): boolean {
    return this.authService.canAccessAdminFeatures();
  }
}
