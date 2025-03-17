import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CoworkingSpaceService } from '../../../services/coworking-space.service';
import { FormsModule } from '@angular/forms';
import { CoworkingSpace } from '../../../models';


@Component({
  selector: 'app-coworking-space-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coworking-space-create.component.html',
  styleUrls: ['./coworking-space-create.component.css']
})
export class CoworkingSpaceCreateComponent {
  newSpace:Omit<CoworkingSpace, 'id'> = {
    name: '',
    address: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    active: true,
    totalSeats: 0,
    availableSeats: 0
  };

  isLoading = false;
  errorMessage: string | null = null;

  constructor(private coworkingSpaceService: CoworkingSpaceService, private router: Router) {}

  createSpace(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.coworkingSpaceService.createSpace(this.newSpace).subscribe({
      next: (response) => {
        console.log('New coworking space created:', response);
        this.router.navigate(['/coworking-spaces']);
      },
      error: (error) => {
        console.error('Error creating space:', error);
        this.errorMessage = 'Failed to create coworking space.';
        this.isLoading = false;
      }
    });
  }
}
