import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-template-kingdom',
    templateUrl: './template-kingdom.component.html',
    styleUrls: ['./template-kingdom.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TemplateKingdomComponent implements OnInit {
  @Input() selectedTemplate!: string;
  @Input() cvData: any;
  @Input() PersonalDetails: any;
  @Input() Summary: any;
  @Input() Experience: any[] = [];
  @Input() Education: any[] = [];
  @Input() Skills: any[] = [];
  @Input() Languages: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
