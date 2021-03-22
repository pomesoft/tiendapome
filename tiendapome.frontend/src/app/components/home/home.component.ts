import { Component, OnInit } from '@angular/core';
import { PouchDBServices } from '../../services/pouch-db.services';
import { Router } from '@angular/router';

@Component({
      selector: 'home',
      templateUrl: './home.component.html',
      styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

      private _idUserDB = 'USER_01';  //provisorio hasta tener lista el registrod usuarios

      constructor(
            private _router: Router,
            private _pouchDBServices: PouchDBServices
      ) {
      }

      ngOnInit() {
            //this.verificarUsuario();
      }

      verificarUsuario() {
            this._pouchDBServices.get(this._idUserDB)
                  .then(doc => {
                        if (doc) {
                              //usuario de backoffice
                              if (doc.clienteLogin != null && doc.clienteLogin.Rol != null && doc.clienteLogin.Rol.Id < 3) {
                                    this._router.navigate(['/backoffice']);
                              } else {
                                    this._router.navigate(['/carrito']);
                              }
                        }
                  });
      }
}
