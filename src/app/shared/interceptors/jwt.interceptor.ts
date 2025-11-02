import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";
// import { AuthService } from "../auth.service";
import { AuthService } from "../services/auth.service";
// import { NotificationService } from "../notification.service";
import { NotificationService } from "../services/notification.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        console.log(error);
        // if the error is a 401, redirect to the login page

        if (error.status === 401) {
          //remove current token
          window.location.href = "/login";
        }

        let errorMessage = "";

        if (error instanceof ErrorEvent) {
          // client-side error

          errorMessage = `Error: ${error as string}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.message} \nMessage: ${error.error
            .message}`;
        }

        this.notificationService.notify(errorMessage, 'error-toast');
        window.alert(errorMessage);

        return throwError(error);
      })
    );
  }
}
