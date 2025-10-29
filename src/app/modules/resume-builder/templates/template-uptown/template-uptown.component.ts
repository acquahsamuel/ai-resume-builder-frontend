import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-uptown',
  templateUrl: './template-uptown.component.html',
  styleUrls: ['./template-uptown.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class TemplateUptownComponent implements OnInit {
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
