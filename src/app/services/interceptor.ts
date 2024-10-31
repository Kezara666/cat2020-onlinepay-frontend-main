import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {finalize, Observable} from "rxjs";
import {LoaderServiceService} from "./loader-service.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(public loaderService: LoaderServiceService) {
  }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.isLoading.next(true);
        try {
            const token = sessionStorage.getItem("CurrentToken");
            if (token) {
                req = req.clone({
                    setHeaders: {Authorization: `Bearer ${token}`}
                });
            }
            return next.handle(req).pipe(
              finalize(
                ()=>{
                  this.loaderService.isLoading.next(false);
                }
              )
            );
        } catch (error) {
            console.error("Interceptor Error:", error);
            throw error;
        }
    }
}
