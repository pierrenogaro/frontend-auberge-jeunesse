import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Bed, BedService } from '../../../services/bed/bed.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-bed-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bed-list.component.html',
  styleUrl: './bed-list.component.css'
})
export class BedListComponent implements OnInit {
  beds: Bed[] = [];
  loading = true;
  errorMessage = '';
  isAuthenticated = false;
  canAccessAdmin = false;
  deleteLoading = false;

  constructor(private bedService: BedService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadBeds();
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.canAccessAdmin = this.authService.canAccessAdminFeatures();
      }
    });
  }

  loadBeds(): void {
    this.loading = true;
    this.bedService.getBeds().subscribe({
      next: (beds) => {
        this.beds = beds;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to load beds';
        this.loading = false;
      }
    });
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

  updateCleanStatus(id: number | undefined, isCleaned: boolean): void {
    if (!id) return;

    this.bedService.updateCleanStatus(id, !isCleaned).subscribe({
      next: () => {
        const bedIndex = this.beds.findIndex(bed => bed.id === id);
        if (bedIndex !== -1) {
          this.beds[bedIndex].isCleaned = !isCleaned;
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to update clean status';
      }
    });
  }
}
