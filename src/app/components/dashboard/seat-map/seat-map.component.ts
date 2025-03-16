import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Seat } from '../../../models';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-seat-map',
  imports: [NgClass,NgIf,NgFor],
  templateUrl: './seat-map.component.html',
  styleUrl: './seat-map.component.css',
  standalone: true,
})
export class SeatMapComponent {
  @Input() seats: Seat[] = [];
  @Input() selectedSeat: Seat | null = null;
  @Output() seatSelected = new EventEmitter<Seat>();

  selectSeat(seat: Seat): void {
    if (this.isSeatSelectable(seat)) {
      this.seatSelected.emit(seat);
    }
  }

  isSeatSelectable(seat: Seat): boolean {
    return seat.status === 'COMPANY_ALLOCATED' || seat.status === 'AVAILABLE';
  }

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
