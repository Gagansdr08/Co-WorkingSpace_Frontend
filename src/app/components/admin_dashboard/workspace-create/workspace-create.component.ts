import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace.service';
import { Workspace } from '../../../models';

@Component({
  selector: 'app-workspace-create',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './workspace-create.component.html',
  styleUrls: ['./workspace-create.component.css']
})
export class WorkspaceCreateComponent implements OnInit {
  coworkingSpaceId: number = 0;
  newWorkspace: Omit<Workspace, 'id'> = {
    name: '',
    type: '',
    capacity: 0,
    location: '',
    pricePerSeatPerHour: 0,
    available: true,
    coworkingSpaceName: '',
    coworkingSpaceId: 0,
    totalSeats: 0,
    availableSeats: 0,
    companyAllocatedSeats: 0,
    employeeBookedSeats: 0,
    seats: null
  };

  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    this.coworkingSpaceId = Number(this.route.snapshot.paramMap.get('id'));
    this.newWorkspace.coworkingSpaceId = this.coworkingSpaceId;
  }

  createWorkspace(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.workspaceService.createWorkspace(this.coworkingSpaceId, this.newWorkspace as Workspace).subscribe({
      next: (response) => {
        console.log('New workspace created:', response);
        this.router.navigate(['/coworking-spaces', this.coworkingSpaceId]);
      },
      error: (error) => {
        console.error('Error creating workspace:', error);
        this.errorMessage = 'Failed to create workspace.';
        this.isLoading = false;
      }
    });
  }
}