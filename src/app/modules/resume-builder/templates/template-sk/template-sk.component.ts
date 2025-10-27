import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-template-sk',
    templateUrl: './template-sk.component.html',
    styleUrls: ['./template-sk.component.scss'],
    standalone: true
})
export class TemplateSkComponent implements OnInit {
  @Input() selectedTemplate!: string;
  @Input() PersonalDetails = [];
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


  constructor() { }

  ngOnInit(): void {
    this.fetchAllSubmitedData();
  }



  fetchAllSubmitedData(){
    //  this.HEADERINFO =  JSON.parse(localStorage.getItem("HEADERINFO"));
    // console.log(this.HEADERINFO, "Header info");
  }
}
