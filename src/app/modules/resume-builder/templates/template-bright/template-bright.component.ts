import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { LowerCasePipe, CommonModule } from "@angular/common";

@Component({
    selector: "app-template-bright",
    templateUrl: "./template-bright.component.html",
    styleUrls: ["./template-bright.component.scss"],
    standalone: true,
    imports: [LowerCasePipe, CommonModule],
})
export class TemplateBrightComponent implements OnInit {
  HEADERINFO: any;
  @Input() selectedTemplate!: string;
  @Input() cvData: any;
  @Input() PersonalDetails: any;
  @Input() name!: string;
  @Input() jobTitle!: string;
  @Input() experience: any[] = [];
  @Input() education!: string;
  @Input() publications: any[] = [];
  @Input() skills: any[] = [];
  @Input() summary!: string;
  @Input() Summary: any;
  @Input() Education: any[] = [];
  @Input() Languages: any[] = [];

  
  @Input() showActions!: boolean;
  @Output() showActionsChange = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {
    
  }

 

  
}
