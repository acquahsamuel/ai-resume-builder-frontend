import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  WritableSignal,
  signal,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import html2canvas from 'html2canvas';
import { ITemplate } from '../../../../shared/dto/templates.dto';
import jsPDF from 'jspdf';
import { CvContentService } from '../../../../shared/services/cv-content.service';

@Component({
  selector: 'app-template-sunshine',
  templateUrl: './template-sunshine.component.html',
  styleUrls: ['./template-sunshine.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TemplateSunshineComponent implements OnInit {
  zoomLevel: number = 1;
  position = { x: 0, y: 0 };
  isDragging: boolean = false;
  lastMousePosition = { x: 0, y: 0 };

  profileData: WritableSignal<ITemplate | null> = signal<ITemplate | null>(null);
  loading: WritableSignal<boolean> = signal<boolean>(true);

  @Input() selectedTemplate!: string;
  @Input() PersonalDetails: any;
  @Input() Hobbies = [];
  @Input() Summary = [];
  @Input() Experience = [];
  @Input() Education = [];
  @Input() Skills = [];
  @Input() References = [];
  @Input() Internship = [];
  @Input() Courses = [];
  @Input() Publication = [];
  @Input() Project = [];
  @Input() Languages = [];
  @Input() ExtraCurricularActivities = [];
  @Input() ExtraFields = [];
  @Output() updateInfo = new EventEmitter<any>();

  constructor(private cvContentService: CvContentService) {
    this.loadProfile();
  }

  ngOnInit(): void {}

  private loadProfile() {
    this.cvContentService.fetchProfileData().subscribe({
      next: (data: ITemplate) => {
        console.log(data.ProfessionalSummary, 'SERVED DATA');
        this.profileData.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching profile data', err);
        this.loading.set(false);
      },
    });
  }

  zoomIn() {
    this.zoomLevel += 0.1; 
  }

  zoomOut() {
    if (this.zoomLevel > 0.1) {
      this.zoomLevel -= 0.1; 
    }
  }

  resetZoom() {
    this.zoomLevel = 1;  
  }

  startDrag(event: MouseEvent) {
    this.isDragging = true; 
    this.lastMousePosition = { x: event.clientX, y: event.clientY };  
  }

  stopDrag() {
    this.isDragging = false;  
  }

  onDrag(event: MouseEvent) {
    if (!this.isDragging) return;  

    const deltaX = event.clientX - this.lastMousePosition.x; // Calculate movement
    const deltaY = event.clientY - this.lastMousePosition.y;

    this.position.x += deltaX; 
    this.position.y += deltaY;

    this.lastMousePosition = { x: event.clientX, y: event.clientY }; // Update last mouse position
  }

  downloadResume() {
    let pageView: any = document.getElementById('download-content');

    html2canvas(pageView, {
      scale: 3.5,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');
      const PDF = new jsPDF();

      // Define PDF dimensions
      const pdfWidth = PDF.internal.pageSize.getWidth();
      const pdfHeight = PDF.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      // Define text properties
      const textMargin = 10;
      const fontSize = 11;
      PDF.setFontSize(fontSize);
      PDF.setFont('Arial');

      // Example text content
      const textContent = '';
      const textHeight = PDF.getTextDimensions(textContent).h;

      // Add the text initially
      let position = textMargin;
      if (position + textHeight > pdfHeight - textMargin) {
        PDF.addPage();
        position = textMargin;
      }
      PDF.text(textContent, 2, position);

      // Adjust position after text
      position += textHeight + textMargin;

      // Add the first image
      PDF.addImage(imgData, 'JPEG', 2, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 20;

      // Loop to add additional pages
      while (heightLeft >= 0) {
        PDF.addPage();

        // Check if text fits on the new page
        if (position + textHeight > pdfHeight - textMargin) {
          PDF.addPage();
          position = textMargin;
        }
        PDF.text(textContent, 10, position);
        position += textHeight + textMargin;

        // Add image on the new page
        PDF.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 20;
      }

      // Save the PDF
      PDF.save(`cleanresume-cv.pdf`);
    });
  }
}
