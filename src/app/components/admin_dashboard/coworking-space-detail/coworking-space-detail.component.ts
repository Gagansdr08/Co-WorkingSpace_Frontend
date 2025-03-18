import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CoworkingSpaceService } from '../../../services/coworking-space.service';
import { CoworkingSpace } from '../../../models';

@Component({
  selector: 'app-coworking-space-detail',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './coworking-space-detail.component.html',
  styleUrls: ['./coworking-space-detail.component.css']
})
export class CoworkingSpaceDetailComponent implements OnInit {
  coworkingSpace: CoworkingSpace | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  goBack(): void {
    this.router.navigate(['/coworking-spaces']);
  }

  constructor(
    private route: ActivatedRoute,
    private coworkingSpaceService: CoworkingSpaceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.coworkingSpaceService.getSpaceById(id).subscribe({
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
  }
}
