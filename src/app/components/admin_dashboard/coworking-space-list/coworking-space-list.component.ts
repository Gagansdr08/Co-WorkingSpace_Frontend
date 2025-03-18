import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoworkingSpaceService } from '../../../services/coworking-space.service';
import { CoworkingSpace } from '../../../models';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-coworking-space-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './coworking-space-list.component.html',
  styleUrls: ['./coworking-space-list.component.css']
})
export class CoworkingSpaceListComponent implements OnInit {
  coworkingSpaces: CoworkingSpace[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private coworkingSpaceService: CoworkingSpaceService) {}

  ngOnInit(): void {
    this.loadCoworkingSpaces();
  }

  loadCoworkingSpaces(): void {
    this.coworkingSpaceService.getAllSpaces().subscribe({
      next: (data) => {
        console.log("API Response:", data); // ✅ Debugging log
        this.coworkingSpaces = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading coworking spaces:", error); // ✅ Debugging log
        this.errorMessage = 'Failed to load coworking spaces.';
        this.isLoading = false;
      }
    });
  }
  deleteSpace(id: number): void {
    if (confirm('Are you sure you want to delete this coworking space?')) {
      this.coworkingSpaceService.deleteSpace(id).subscribe({
        next: () => {
          this.coworkingSpaces = this.coworkingSpaces.filter(space => space.id !== id);
          console.log(`Deleted coworking space with ID: ${id}`);
        },
        error: () => {
          alert('Failed to delete coworking space.');
        }
      });
    }
  }
  
}
