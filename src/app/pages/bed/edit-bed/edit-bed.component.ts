import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Bed, BedService } from '../../../services/bed/bed.service';
import { Room, RoomService } from '../../../services/room/room.service';

@Component({
  selector: 'app-edit-bed',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-bed.component.html',
  styleUrl: './edit-bed.component.css'
})
export class EditBedComponent implements OnInit {
  bedForm: FormGroup;
  loading = false;
  errorMessage = '';
  bedId = 0;
  rooms: Room[] = [];
  currentBed: Bed | null = null;

  constructor(
    private fb: FormBuilder,
    private bedService: BedService,
    private roomService: RoomService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bedForm = this.fb.group({
      number: [1, [Validators.required, Validators.min(1)]],
      bedNumber: ['', [Validators.required]],
      room: ['', [Validators.required]],
      isAvailable: [true],
      isCleaned: [false]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.bedId = Number(idParam);
    } else {
      this.errorMessage = 'Bed ID is missing';
    }
  }

  ngOnInit(): void {
    this.loadRooms();
    if (this.bedId) {
      this.loadBed();
    }
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

  loadBed(): void {
    this.loading = true;
    this.bedService.getBed(this.bedId).subscribe({
      next: (bed) => {
        console.log('Loaded bed:', bed); // Pour le débogage
        this.currentBed = bed;

        // Extraire l'ID de la chambre si c'est un objet
        let roomId: string | number = '';
        if (bed.room) {
          if (typeof bed.room === 'object' && bed.room.id) {
            roomId = bed.room.id;
          } else if (typeof bed.room === 'number') {
            roomId = bed.room;
          }
        }

        this.bedForm.patchValue({
          number: bed.number,
          bedNumber: bed.bedNumber,
          room: roomId,
          isAvailable: bed.isAvailable,
          isCleaned: bed.isCleaned
        });

        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading bed:', error);
        this.errorMessage = 'Failed to load bed details';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.bedForm.invalid || !this.bedId) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const formData = this.bedForm.value;
    const bedData: Bed = {
      number: formData.number,
      bedNumber: formData.bedNumber,
      isAvailable: formData.isAvailable,
      isCleaned: formData.isCleaned,
      room: formData.room
    };

    console.log('Sending bed data:', bedData);

    this.bedService.updateBed(this.bedId, bedData).subscribe({
      next: () => {
        this.router.navigate(['/beds']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error updating bed:', error);
        this.errorMessage = error.error?.error || 'An error occurred while updating the bed';
      }
    });
  }
}
