import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Event, EventService } from '../../../services/event/event.service';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  eventForm: FormGroup;
  loading = false;
  errorMessage = '';
  eventId = 0;
  success = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.eventId = Number(idParam);
    } else {
      this.errorMessage = 'Event ID is missing';
    }
  }

  ngOnInit(): void {
    if (this.eventId) {
      this.loadEvent();
    }
  }

  loadEvent(): void {
    this.loading = true;
    this.eventService.getEvent(this.eventId).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          title: event.title,
          description: event.description
        });
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load event details';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid || !this.eventId) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.success = false;

    const eventData: Event = this.eventForm.value;

    this.eventService.updateEvent(this.eventId, eventData).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/events']);
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.error || 'An error occurred while updating the event';
      }
    });
  }
}
