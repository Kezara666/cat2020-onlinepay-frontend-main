import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/internal/operators/catchError';
import { HttpHeaders, HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WebApiService {

  token = sessionStorage.getItem('token');

  constructor(private httpClient: HttpClient) {
  }

  // Get call method
  // Param 1 : authToken
  // Param 2 : url
  get(url: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Cache-Control' : 'no-cache',
        'Pragma' : 'no-cache'
        // , 'Authorization': this.token
      }),
      observe: "response" as 'body'
    };

    return this.httpClient.get(
      url,
      httpOptions
    )
      .pipe(
        map((response: any) => this.ReturnResponseData(response)),
        catchError(this.handleError)
      );
  }

  getFile(url: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        // Add any additional headers here, if needed
      }),
      responseType: 'blob' as 'json' // Set responseType to 'blob' to get any type of file
    };

    return this.httpClient.get(
      url,
      httpOptions
    )
      .pipe(
        catchError(this.handleError)
      );
  }
  // getFile(url: string): Observable<{ data: Blob, fileName: string }> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Cache-Control': 'no-cache',
  //       'Pragma': 'no-cache',
  //     }),
  //     responseType: 'blob' as 'json'
  //   };
  //
  //   return this.httpClient.get(url, httpOptions)
  //     .pipe(
  //       catchError(this.handleError),
  //       map(response => {
  //         // Get the filename from the 'Content-Disposition' header
  //         // @ts-ignore
  //         const contentDisposition = response.headers.get('Content-Disposition');
  //         const fileNameMatch = contentDisposition && contentDisposition.match(/filename="(.+?)"/);
  //
  //         let fileName = 'downloaded_file'; // Default filename if not found in headers
  //         if (fileNameMatch) {
  //           fileName = fileNameMatch[1];
  //         }
  //
  //         // @ts-ignore
  //         return { data: response.body, fileName: fileName };
  //       })
  //     );
  // }


  delete(url: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Cache-Control' : 'no-cache',
        'Pragma' : 'no-cache'
        // , 'Authorization': this.token
      }),
      observe: "response" as 'body'
    };
    return this.httpClient.delete(
      url
    )
      .pipe(
        map((response: any) => this.ReturnResponseData(response)),
        catchError(this.handleError)
    );

    return this.httpClient.delete(url);
  }


// patch(url: string, model: any): Observable<any> {
//     const httpOptions = {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json'
//         // ,'Authorization': this.token
//       }),


//       observe: "response" as 'body'
//     };
//     return this.httpClient.post(
//       url,
//       model,
//       httpOptions)
//       .pipe(
//         map((response: any) => this.ReturnResponseData(response)),
//         catchError(this.handleError)
//       );
//   }

  // patch(url: string, options?: any): Observable<any> {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type':  'application/json',
  //       'Cache-Control' : 'no-cache',
  //       'Pragma' : 'no-cache'
  //       // , 'Authorization': this.token
  //     }),
  //     observe: "response" as 'body'
  //   };

  //   return this.httpClient.patch(
  //     url,
  //     httpOptions
  //   )
  //     .pipe(
  //       map((response: any) => this.ReturnResponseData(response)),
  //       catchError(this.handleError)
  //     );
  // }
  put(url: string, data: any, options?: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
        // Add Authorization header if needed
        // 'Authorization': 'Bearer ' + this.token
      })
    };

    return this.httpClient.put(url, data, httpOptions).pipe(
      map((response: any) => this.ReturnResponseData(response)),
      catchError(this.handleError)
    );
  }

  // Post call method
  // Param 1 : authToken
  // Param 2 : url
  // Param 3 : model
  post(url: string, model: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        // ,'Authorization': this.token
      }),


      observe: "response" as 'body'
    };
    return this.httpClient.post(
      url,
      model,
      httpOptions)
      .pipe(
        map((response: any) => this.ReturnResponseData(response)),
        catchError(this.handleError)
      );
  }


  patch(url: string, model: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
        // ,'Authorization': this.token
      }),
      observe: "response" as 'body'
    };
    // console.log(url);
    // console.log(model);
    return this.httpClient.patch(
      url,
      model,
      httpOptions)
      .pipe(
        map((response: any) => this.ReturnResponseData(response)),
        catchError(this.handleError)
      );
  }


  postFile(url: string, formData: any) {
    // console.log("In service");
    // console.log(url);
    // console.log(formData);
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':'multipart/form-data'
    //     //,'Authorization': this.token
    //   }),
    //   observe: "response" as 'body'
    // };

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    return  this.httpClient.post(url, formData, {headers});

    // return upload$;

    // return this.httpClient.post(
    //   url,
    //   formData,
    //   httpOptions)
    //   .pipe(
    //     map((response: any) => this.ReturnResponseData(response)),
    //     catchError(this.handleError)
    //   );
  }

  postAnyFile(url: string, formData: any) {

    const req = new HttpRequest('POST', url, formData, {
        reportProgress: true, // for progress tracking
    });

    return this.httpClient.request(req);
  }

  private ReturnResponseData(response: any) {
    return response;
  }

  private handleError(error: any) {
    return throwError(() => error);;
  }


  //--------------------------------------------------------------
  birtReportDownload(url: string, model: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.httpClient.post(url, model, {
      observe : 'response',
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }
  //---------------------------------------------------------------

  pdfDocumentDownload(url: string, model: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.httpClient.post(url, model, {
      observe : 'response',
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }
}
