import { Component, OnInit } from '@angular/core';
import { DashboardBaseComponent } from '../../dashboard-base/dashboard-base.component';
import { AuthService, User } from '../../../core/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';
import { CoworkingSpace, Workspace } from '../../../models';
import { CoworkingSpaceService } from '../../../services/coworking-space.service';
import { WorkspaceService } from '../../../services/workspace.service';

@Component({
  selector: 'app-space-owner-dashboard',
  imports: [CommonModule,NgIf,RouterLink],
  templateUrl: './space-owner-dashboard.component.html',
  styleUrl: './space-owner-dashboard.component.css'
})
export class SpaceOwnerDashboardComponent extends DashboardBaseComponent implements OnInit{
  coworkingspaceId: number | null = null;
  spaceId: number = 0;
  coworkingSpace: CoworkingSpace | null = null;
  workspaces: Workspace[] = [];
    // isLoading = true;
    errorMessage: string | null = null;
  constructor(
    protected override authService: AuthService,
    protected override router: Router,
    private coworkingSpaceService: CoworkingSpaceService,
    private workspaceService: WorkspaceService
  ) {
    super(authService, router);
  }
  
  override onUserLoaded(user: User): void {
    // Check if user has the SPACE_OWNER role
    if (!user.roles.includes('SPACE_OWNER')) {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }
    this.coworkingspaceId=user.coworkingSpaceId || null;
    console.log(this.coworkingspaceId);

    if (!this.coworkingspaceId) {
      console.error('Company admin user has no associated company ID');
    }
    if (this.coworkingspaceId) {
    this.spaceId=this.coworkingspaceId;
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
          alert(error.message || 'Failed to delete workspace.');
        }
      });
    }
  }

  // updateSpace(): void {
  //   if (this.coworkingspaceId && this.coworkingSpace) {
  //     this.isLoading = true;
  //     this.coworkingSpaceService.updateSpace(this.coworkingspaceId, this.coworkingSpace).subscribe({
  //       next: () => {
  //         this.router.navigate(['/coworking-spaces']); // ✅ Redirect after update
  //       },
  //       error: () => {
  //         this.errorMessage = 'Failed to update coworking space.';
  //         this.isLoading = false;
  //       }
  //     });
  //   }
  // }

}