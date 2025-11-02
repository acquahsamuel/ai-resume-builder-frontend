import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../dto/user.dto';
import { AuthService } from './auth.service';
import { environment as env } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  private BASE_URL = `${env.BASE_URL}`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  allUsers() {
    const token = localStorage.getItem('currentUser');

    /**
     * Creates an httpOptions and attaches a Bearer token
     */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };

    return this.http.get(`${this.BASE_URL}/users`, httpOptions);
  }

  //Add User
  addUser(user: IUser) {
    const token = localStorage.getItem('currentUser');
    /**
     * Creates an httpOptions and attaches a Bearer token
     */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };

    return this.http.post(`${this.BASE_URL}/users`, user, httpOptions);
  }

  /**
   *
   * @param user
   * @returns
   */
  updateUser(user: IUser) {
    const token = localStorage.getItem('currentUser');
    /**
     * Creates an httpOptions and attaches a Bearer token
     */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };
    return this.http.put(
      `${this.BASE_URL}/users/${user.id}`,
      user,
      httpOptions
    );
  }

  /**
   *
   * @param user
   * @returns
   */
  getUserById(user: IUser) {
    const token = localStorage.getItem('currentUser');

    /**
     * Creates an httpOptions and attaches a Bearer token
     */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };
    return this.http.get(`${this.BASE_URL}/users/${user.id}`, httpOptions);
  }

  /**
   *
   * @param user
   * @returns
   */
  deleteUser(user: IUser) {
    const token = localStorage.getItem('currentUser');
    /**
     * Creates an httpOptions and attaches a Bearer token
     */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      }),
    };
    return this.http.put(`${this.BASE_URL}/users`, `${user.id}`, httpOptions);
  }
}
