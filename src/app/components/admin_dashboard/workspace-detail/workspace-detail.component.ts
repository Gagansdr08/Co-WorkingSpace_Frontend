import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace.service';
import { SeatService } from '../../../services/seat.service';
import { Workspace, Seat } from '../../../models';

@Component({
  selector: 'app-workspace-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workspace-detail.component.html',
  styleUrls: ['./workspace-detail.component.css']
})
export class WorkspaceDetailComponent implements OnInit {
  workspace: Workspace | null = null;
  seats: Seat[] = [];
  coworkingSpaceId: number = 0;
  workspaceId: number = 0;
  isLoading = true;
  isLoadingSeats = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workspaceService: WorkspaceService,
    private seatService: SeatService
  ) {}

  ngOnInit(): void {
    this.coworkingSpaceId = Number(this.route.snapshot.paramMap.get('id'));
    this.workspaceId = Number(this.route.snapshot.paramMap.get('workspaceId'));
    
    if (this.workspaceId) {
      this.loadWorkspaceDetails();
      this.loadSeats();
    }
  }

  loadWorkspaceDetails(): void {
    this.workspaceService.getWorkspaceWithSeats(this.workspaceId).subscribe({
      next: (data) => {
        console.log("Workspace Details:", data);
        this.workspace = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading workspace details:", error);
        this.errorMessage = 'Failed to load workspace details.';
        this.isLoading = false;
      }
    });
  }

  loadSeats(): void {
    this.isLoadingSeats = true;
    this.seatService.getAllSeatsInWorkspace(this.workspaceId).subscribe({
      next: (data) => {
        console.log("Seats:", data);
        this.seats = data;
        this.isLoadingSeats = false;
      },
      error: (error) => {
        console.error("Error loading seats:", error);
        this.isLoadingSeats = false;
      }
    });
  }

  addSeat(): void {
    this.router.navigate(['/coworking-spaces', this.coworkingSpaceId, 'workspaces', this.workspaceId, 'seats', 'add']);
  }

  addBulkSeats(): void {
    this.router.navigate(['/coworking-spaces', this.coworkingSpaceId, 'workspaces', this.workspaceId, 'seats', 'bulk-add']);
  }

  deleteSeat(seatId: number): void {
    if (confirm('Are you sure you want to delete this seat?')) {
      this.seatService.deleteSeat(seatId).subscribe({
        next: () => {
          this.seats = this.seats.filter(seat => seat.id !== seatId);
          console.log(`Deleted seat with ID: ${seatId}`);
        },
        error: (error) => {
          console.error("Error deleting seat:", error);
          alert('Failed to delete seat.');
        }
      });
    }
  }
}