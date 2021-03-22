import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiURL } from '../../environments/environment';

@Injectable({
      providedIn: 'root'
})
export class GlobalService {

      public url: string;
      public TittleIndex: string;

      constructor(
            private _http: HttpClient
      ) {

            this.url = ApiURL.url;
            this.TittleIndex = '';
      }

      inicializar() {
            // Leer el archivo JSON
            this._http.get('../../assets/data/params.json')
                  .subscribe((resp: any) => {
                        this.url = resp.UrlApi;
                        sessionStorage.setItem('UrlApi', this.url);
                        this.TittleIndex = resp.TittleIndex;
                        console.log(resp);

                  });
      }
}
