import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeatService } from '../../../services/seat.service';

@Component({
  selector: 'app-seat-bulk-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './seat-bulk-add.component.html',
  styleUrls: ['./seat-bulk-add.component.css']
})
export class SeatBulkAddComponent implements OnInit {
  workspaceId: number = 0;
  coworkingSpaceId: number = 0;
  
  bulkRequest = {
    startingNumber: 1,
    numberOfSeats: 10,
    type: 'Standard Desk',
    features: 'Ergonomic chair, power outlets',
    prefix: 'A'
  };

  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seatService: SeatService
  ) {}

  ngOnInit(): void {
    this.coworkingSpaceId = Number(this.route.snapshot.paramMap.get('id'));
    this.workspaceId = Number(this.route.snapshot.paramMap.get('workspaceId'));
  }

  addBulkSeats(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.seatService.addBulkSeats(this.workspaceId, this.bulkRequest).subscribe({
      next: (response) => {
        console.log(`Added ${response.length} seats successfully`);
        this.router.navigate(['/coworking-spaces']);
      },
      error: (error) => {
        console.error('Error adding seats in bulk:', error);
        this.errorMessage = 'Failed to add seats.';
        this.isLoading = false;
      }
    });
  }
}