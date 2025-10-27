import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
// import { StateStorageService } from './state-storage.service';

/**
 * An authentication guard class heping the router module decide on
 * which pages the user can navigate to or not.
 *
 * @author botchway44
 */
@Injectable()
export class AuthGuardService implements CanActivate {

    /**
     *
     * @param auth {AuthService}
     * @param router Router
     * @param stateStorageService
     */
    constructor(
        public auth: AuthService,
        public router: Router,
        // private stateStorageService: StateStorageService
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        
        return true;
    }
}