import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-template-pincode',
    templateUrl: './template-pincode.component.html',
    styleUrls: ['./template-pincode.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TemplatePincodeComponent implements OnInit {
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
