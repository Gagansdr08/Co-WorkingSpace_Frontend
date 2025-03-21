import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SeatService } from '../../../services/seat.service';

@Component({
  selector: 'app-seat-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './seat-add.component.html',
  styleUrls: ['./seat-add.component.css']
})
export class SeatAddComponent implements OnInit {
  workspaceId: number = 0;
  coworkingSpaceId: number = 0;
  
  newSeat = {
    seatNumber: '',
    type: '',
    features: ''
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

  addSeat(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.seatService.addSeat(this.workspaceId, this.newSeat).subscribe({
      next: (response) => {
        console.log('New seat added:', response);
        this.router.navigate(['/coworking-spaces', this.coworkingSpaceId, 'workspaces', this.workspaceId]);
      },
      error: (error) => {
        console.error('Error adding seat:', error);
        this.errorMessage = 'Failed to add seat.';
        this.isLoading = false;
      }
    });
  }
}