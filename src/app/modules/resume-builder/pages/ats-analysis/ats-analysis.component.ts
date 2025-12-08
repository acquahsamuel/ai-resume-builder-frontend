import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeNgModule } from '../../../../shared/modules/primeNg.module';
import { CvAnalysisTabComponent } from './components/cv-analysis-tab/cv-analysis-tab.component';
import { JobMatchTabComponent } from './components/job-match-tab/job-match-tab.component';
import { CvRewriteTabComponent } from './components/cv-rewrite-tab/cv-rewrite-tab.component';

@Component({
  selector: 'app-ats-analysis',
  templateUrl: './ats-analysis.component.html',
  styleUrls: ['./ats-analysis.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    CvAnalysisTabComponent,
    JobMatchTabComponent,
    CvRewriteTabComponent
  ]
})
export class AtsAnalysisComponent {
  activeTabIndex = 0;
}
