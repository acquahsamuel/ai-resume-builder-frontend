import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrimeNgModule } from '../../../../shared/modules/primeNg.module';

interface Resume {
  id: string;
  name: string;
  lastUpdated: string;
}

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  standalone: true,
  imports: [CommonModule, PrimeNgModule],
})
export class GettingStartedComponent implements OnInit {
  existingResumes: Resume[] = [
    {
      id: '1',
      name: 'Software Engineer CV',
      lastUpdated: '4 hours ago'
    },
    {
      id: '2',
      name: 'Product Manager Resume',
      lastUpdated: '2 days ago'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void { }

  createNewResume() {
    console.log('Create new resume');
    this.router.navigate(['/dashboard/getting-started']);
  }

  importResume() {
    console.log('Import resume');
  }
}
