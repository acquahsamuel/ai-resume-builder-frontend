import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { IUser, User } from "../dto/user.dto";

import { environment } from "../../../environments/environment.prod";


@Injectable({
  providedIn: "root"
})

export class AuthService {
  private BASE_URL = environment.BASE_URL;
  
}
