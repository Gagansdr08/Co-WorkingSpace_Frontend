import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CoworkingSpaceService } from '../../../services/coworking-space.service';
import { CoworkingSpace } from '../../../models';

@Component({
  selector: 'app-coworking-space-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coworking-space-detail.component.html',
  styleUrls: ['./coworking-space-detail.component.css']
})
export class CoworkingSpaceDetailComponent implements OnInit {
  coworkingSpace: CoworkingSpace | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private coworkingSpaceService: CoworkingSpaceService
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
