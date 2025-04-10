import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Event, EventService } from '../../../services/event/event.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.css'
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  errorMessage = '';
  isAuthenticated = false;
  canAccessAdmin = false;
  selectedEvent: Event | null = null;

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.authService.isAuthenticated().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      if (isAuth) {
        this.canAccessAdmin = this.authService.canAccessAdminFeatures();
      }
    });
  }

  loadEvents(): void {
    this.loading = true;
    this.eventService.getEvents().subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.error || 'Failed to load events';
        this.loading = false;
      }
    });
  }

  deleteEvent(id: number | undefined): void {
    if (!id) return;

    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe({
        next: () => {
          this.events = this.events.filter(event => event.id !== id);
          if (this.selectedEvent && this.selectedEvent.id === id) {
            this.selectedEvent = null;
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.error || 'Failed to delete event';
        }
      });
    }
  }

  viewEventDetails(event: Event): void {
    this.selectedEvent = event;
  }

  closeEventDetails(): void {
    this.selectedEvent = null;
  }
}
