import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CoworkingSpaceService } from '../../../services/coworking-space.service';
import { CoworkingSpace } from '../../../models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coworking-space-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coworking-space-edit.component.html',
  styleUrls: ['./coworking-space-edit.component.css']
})
export class CoworkingSpaceEditComponent implements OnInit {
  space: CoworkingSpace | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private coworkingSpaceService: CoworkingSpaceService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.coworkingSpaceService.getSpaceById(id).subscribe({
        next: (data) => {
          this.space = data;
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Failed to load coworking space details.';
          this.isLoading = false;
        }
      });
    }
  }

  updateSpace(): void {
    if (this.space) {
      this.isLoading = true;
      this.coworkingSpaceService.updateSpace(this.space.id!, this.space).subscribe({
        next: () => {
          this.router.navigate(['/coworking-spaces']); // ✅ Redirect after update
        },
        error: () => {
          this.errorMessage = 'Failed to update coworking space.';
          this.isLoading = false;
        }
      });
    }
  }
}
