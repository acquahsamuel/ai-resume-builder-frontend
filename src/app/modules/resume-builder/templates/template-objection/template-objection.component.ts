import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-template-objection',
    templateUrl: './template-objection.component.html',
    styleUrls: ['./template-objection.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TemplateObjectionComponent implements OnInit {
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
