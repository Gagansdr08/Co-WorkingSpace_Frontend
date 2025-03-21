import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CoworkingSpaceService } from '../../../services/coworking-space.service';
import { WorkspaceService } from '../../../services/workspace.service';
import { CoworkingSpace, Workspace } from '../../../models';

@Component({
  selector: 'app-coworking-space-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coworking-space-detail.component.html',
  styleUrls: ['./coworking-space-detail.component.css']
})
export class CoworkingSpaceDetailComponent implements OnInit {
  coworkingSpace: CoworkingSpace | null = null;
  workspaces: Workspace[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  spaceId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coworkingSpaceService: CoworkingSpaceService,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    this.spaceId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.spaceId) {
      this.loadCoworkingSpaceDetails();
      this.loadWorkspaces();
    }
  }

  loadCoworkingSpaceDetails(): void {
    this.coworkingSpaceService.getSpaceById(this.spaceId).subscribe({
      next: (data) => {
        console.log("API Response:", data);
        this.coworkingSpace = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load coworking space details.';
        this.isLoading = false;
      }
    });
  }

  loadWorkspaces(): void {
    this.workspaceService.getAllWorkspacesForCoworkingSpace(this.spaceId).subscribe({
      next: (data) => {
        console.log("Workspaces:", data);
        this.workspaces = data;
      },
      error: (error) => {
        console.error("Error loading workspaces:", error);
      }
    });
  }

  goToWorkspaceCreate(): void {
    this.router.navigate(['/coworking-spaces', this.spaceId, 'workspaces', 'create']);
  }

  viewWorkspaceDetails(workspaceId: number): void {
    this.router.navigate(['/coworking-spaces', this.spaceId, 'workspaces', workspaceId]);
  }

  editWorkspace(workspaceId: number): void {
    this.router.navigate(['/coworking-spaces', this.spaceId, 'workspaces', workspaceId, 'edit']);
  }

  deleteWorkspace(workspaceId: number): void {
    if (confirm('Are you sure you want to delete this workspace?')) {
      this.workspaceService.deleteWorkspace(workspaceId).subscribe({
        next: () => {
          this.workspaces = this.workspaces.filter(workspace => workspace.id !== workspaceId);
          console.log(`Deleted workspace with ID: ${workspaceId}`);
        },
        error: (error) => {
          console.error("Error deleting workspace:", error);
          alert('Failed to delete workspace.');
        }
      });
    }
  }
}