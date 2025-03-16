import { Component, Input } from '@angular/core';
import { Seat } from '../../../models';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-seat-details',
  imports: [NgIf,NgClass],
  templateUrl: './seat-details.component.html',
  styleUrl: './seat-details.component.css',
  standalone: true,
})
export class SeatDetailsComponent {
  @Input() seat: Seat | null = null;

  getSeatStatusLabel(status: string): string {
    switch (status) {
      case 'AVAILABLE':
        return 'Available';
      case 'COMPANY_ALLOCATED':
        return 'Allocated to Your Company';
      case 'BOOKED':
        return 'Booked';
      default:
        return status;
    }
  }
}