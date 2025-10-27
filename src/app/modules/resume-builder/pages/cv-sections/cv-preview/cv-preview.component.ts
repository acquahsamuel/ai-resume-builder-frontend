import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvContentService, CvData } from '../../../../../shared/services/cv-content.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cv-preview',
  templateUrl: './cv-preview.component.html',
  styleUrl: './cv-preview.component.scss',
  standalone: true,
  imports: [CommonModule],
})
export class CvPreviewComponent implements OnInit, OnDestroy {
  cvData: CvData = {};
  private subscription: Subscription = new Subscription();

  constructor(private cvService: CvContentService) {}

  ngOnInit(): void {
    // Subscribe to CV data changes
    this.subscription.add(
      this.cvService.cvData$.subscribe((data: CvData) => {
        this.cvData = data;
        console.log('Preview data updated:', data);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

