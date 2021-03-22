import { Injectable, ResolvedReflectiveFactory } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { GlobalService } from './global.service';

@Injectable({
      providedIn: 'root'
})
export class ArchivoService {
      public url: string;

      constructor(
            private _http: HttpClient,
		private _globalService: GlobalService
      ) {
            this.url = _globalService.url;
            //this.url = sessionStorage.getItem('UrlApi');
      }

      public postArchivo(
            url_api: string,
            nombre: string,
            file: File
      ){
            return new Promise((resolve, reject) => {
                  var formData:any = new FormData();
                  var xhr = new XMLHttpRequest();

                  console.log(nombre);
                  console.log(file);

                  formData.append(nombre, file, file.name);

                  xhr.onreadystatechange = function (){
                        if(xhr.readyState == 4){
                              if(xhr.status == 200){
                                    resolve(JSON.parse(xhr.response));
                              } else{
                                    reject(xhr.response);
                              }                              
                        }
                  }
                  xhr.open('POST', this.url + url_api, true);
                  xhr.send(formData);
            });
      }
}

