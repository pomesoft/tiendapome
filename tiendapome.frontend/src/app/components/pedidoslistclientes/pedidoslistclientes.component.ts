import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { PedidoService } from '../../services/pedido.service';
import { AutenticaService } from '../../services/autentica.service';
import { Pedido } from '../../models/pedido';

declare var $: any;

@Component({
    selector: 'app-pedidoslistclientes',
    templateUrl: './pedidoslistclientes.component.html',
    styleUrls: ['./pedidoslistclientes.component.css']
})
export class PedidoslistclientesComponent implements OnInit {

    public titulo: string = 'Bandeja de pedidos';

    public Pedidos: Array<Pedido>;


    public mensajeUsuario_OK: boolean = false;
    public textoMensajeUsuario: string = '';
    public textoBotonMensajeUsuario: string = 'Aceptar';


    private pedidoProcesar: Pedido;

    constructor(
        private _pedidoService: PedidoService,
        private _autenticaServices: AutenticaService,
        private _router: Router
    ) {

    }

    ngOnInit() {
        this.inicializarControles();
    }

    async inicializarControles() {
        await this.getPedidos()
            .then(result => {
                if (result) this.Pedidos = <Array<Pedido>>result;
            })
            .catch(err => {
                console.log(err);
            });

    }

    getEstados() {
        return new Promise((resolve, reject) => {
            this._pedidoService.getEstados().subscribe(
                response => { resolve(response); },
                error => { reject(<any>error); }
            );
        });
    }

    getPedidos() {
        return new Promise((resolve, reject) => {
            let clienteLogin = this._autenticaServices.getClienteLoguin();
            this._pedidoService.getPedidosList('', clienteLogin.Id, '', '').subscribe(
                response => { resolve(response); },
                error => { reject(<any>error); }
            );
        });
    }

    editarItem(
        $event: any,
        item: Pedido
    ) {
        $event.preventDefault();
        this._router.navigate(['/verpedido/' + item.Id + '/-1']);
    }

}



