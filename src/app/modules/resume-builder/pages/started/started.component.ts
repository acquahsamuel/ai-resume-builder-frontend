import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../../../../shared/modules/primeNg.module';


@Component({
  selector: 'app-started',
  templateUrl: './started.component.html',
  styleUrls: ['./started.component.scss'],
  standalone: true,
  imports: [PrimeNgModule],
})
export class StartedComponent implements OnInit {

  isLoading = false;
  username = "Samuel";
  userProfile = "./assets/images/placeholder.png";



  getInteractionPrompt() { }

  logout() { }

  OnInit() { }

  title = "Cleansheet";

  LINKS = [
    { path: "", icon: "format_shapes", title: "Resumes" },
    { path: "/account/ats-analysis", icon: "attach_file", title: "ATS" },
    {
      path: "/account/cv-rewrite",
      icon: "insert_drive_file",
      title: "CV Rewrite",
    },
    { path: "/account/settings", icon: "settings", title: "Settings" },
  ];



  constructor() { }

  ngOnInit(): void {
  }

}
