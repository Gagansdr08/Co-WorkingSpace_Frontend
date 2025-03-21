import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WorkspaceService } from '../../../services/workspace.service';
import { Workspace } from '../../../models';

@Component({
  selector: 'app-workspace-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './workspace-edit.component.html',
  styleUrls: ['./workspace-edit.component.css']
})
export class WorkspaceEditComponent implements OnInit {
  workspace: Workspace | null = null;
  coworkingSpaceId: number = 0;
  workspaceId: number = 0;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit(): void {
    this.coworkingSpaceId = Number(this.route.snapshot.paramMap.get('id'));
    this.workspaceId = Number(this.route.snapshot.paramMap.get('workspaceId'));
    
    if (this.workspaceId) {
      this.loadWorkspaceDetails();
    }
  }

  loadWorkspaceDetails(): void {
    this.workspaceService.getWorkspaceWithSeats(this.workspaceId).subscribe({
      next: (data) => {
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

  updateWorkspace(): void {
    if (this.workspace) {
      this.isLoading = true;
      this.workspaceService.updateWorkspace(this.workspaceId, this.workspace).subscribe({
        next: () => {
          this.router.navigate(['/coworking-spaces', this.coworkingSpaceId]);
        },
        error: (error) => {
          console.error("Error updating workspace:", error);
          this.errorMessage = 'Failed to update workspace.';
          this.isLoading = false;
        }
      });
    }
  }
}