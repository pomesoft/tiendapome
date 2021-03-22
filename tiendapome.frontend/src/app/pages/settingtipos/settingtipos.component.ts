import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'node_modules/angular-notifier';

import { Tipo } from '../../models/tipo';
import { Categoria } from '../../models/categoria';
import { Medida, Subcategoria, SubcategoriaMedida } from '../../models/subcategoria';

import { MenuServices } from '../../services/menu.services';


declare var $: any;

@Component({
    selector: 'app-settingtipos',
    templateUrl: './settingtipos.component.html',
    styleUrls: ['./settingtipos.component.css']
})
export class SettingtiposComponent implements OnInit {

    public titulo: string = 'Tipos';
    public listTipos: Array<Tipo>;

    public tipoSeleccionado: Tipo = new Tipo(-1);
    public categoriaSeleccionada: Categoria = new Categoria(-1);
    public subcategoriaSeleccionada: Subcategoria = new Subcategoria(-1);

    public listMedidas: Array<Medida>;

    public procesando: boolean;

    textoConfirmaEliminacion

    constructor(
        private _tiposServices: MenuServices,
        private _notifier: NotifierService
    ) {

    }

    ngOnInit() {
        this.inicializarControles();
    }

    async inicializarControles() {
        await this.getTiposABM(-1, -1)
            .then(result => {
                return this.getMedidas();
            })
            .catch(err => {
                this.showNotification('error', 'Ocurrió un error al cargar la página.');
                console.log(err);
            });
    }

    getTiposABM(
        idTipoSeleccionar: number,
        idCategoriaSeleccionar: number
    ) {
        return new Promise((resolve, reject) => {
            this._tiposServices.getTiposABM()
                .subscribe(
                    response => {
                        this.listTipos = <Array<Tipo>>response;

                        if (idTipoSeleccionar > 0) {
                            this.listTipos.forEach(item => {
                                if (item.Id == idTipoSeleccionar) {
                                    this.tipoSeleccionado = item;
                                }
                            });
                            if (idCategoriaSeleccionar > 0) {
                                this.tipoSeleccionado.Categorias.forEach(item => {
                                    if (item.Id == idCategoriaSeleccionar) {
                                        this.categoriaSeleccionada = item
                                    }
                                });
                            }
                        }

                        resolve(response);
                    },
                    error => { reject(<any>error); }
                );
        });
    }

    getMedidas() {
        return new Promise((resolve, reject) => {

            this._tiposServices.getMedidas()
                .subscribe(
                    response => {
                        if (response)
                            this.listMedidas = <Array<Medida>>response;
                        resolve(response);
                    },
                    error => { reject(<any>error); }
                );

        });
    }

    onClickAgregarTipo(
        event: any
    ) {
        event.preventDefault();
        this.tipoSeleccionado = new Tipo(-1);
        this.tipoSeleccionado.Orden = this.listTipos.length + 1;
        this.tipoSeleccionado.Visible = true;
        $('#modalItemTipo').modal('show');
    }


    onClickSeleccionarTipo(
        event: any,
        item: Tipo
    ) {
        event.preventDefault();
        this.tipoSeleccionado = item;
        this.categoriaSeleccionada = new Categoria(-1);
        this.subcategoriaSeleccionada = new Subcategoria(-1);
    }

    onClickEditarTipo(
        event: any,
        item: Tipo
    ) {
        event.preventDefault();
        this.onClickSeleccionarTipo(event, item);
        $('#modalItemTipo').modal('show');
    }

    onClickEliminarItemTipo(
        event: any
    ) {
        event.preventDefault();

        if (this.tipoSeleccionado.Descripcion.trim().length > 0) {

            this._tiposServices.deleteItemMenu(this.tipoSeleccionado.Id)
                .subscribe(
                    response => {
                        this.procesando = false;
                        if (response) {

                            this.getTiposABM(-1, -1);

                            this.showNotification('success', 'Los datos se actualizaron correctamente.');
                            $('#modalItemTipo').modal('hide');

                        }
                    },
                    error => {
                        this.procesando = false;
                        this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                        console.log(<any>error);
                    }
                );

        }

    }

    onClickEliminarTipo(
        event: any
    ) {
        event.preventDefault();
    }

    onClickGuardarItemTipo(
        event: any
    ) {
        event.preventDefault();

        if (this.tipoSeleccionado.Descripcion.trim().length > 0) {

            this._tiposServices.saveItemMenu(this.tipoSeleccionado)
                .subscribe(
                    response => {
                        this.procesando = false;
                        if (response) {

                            this.getTiposABM(-1, -1);

                            this.showNotification('success', 'Los datos se actualizaron correctamente.');
                            $('#modalItemTipo').modal('hide');

                        }
                    },
                    error => {
                        this.procesando = false;
                        this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                        console.log(<any>error);
                    }
                );

        }

    }


    onClickAgregarCategoria(
        event: any
    ) {
        event.preventDefault();
        this.categoriaSeleccionada = new Categoria(-1);
        this.categoriaSeleccionada.IdTipo = this.tipoSeleccionado.Id;
        this.categoriaSeleccionada.Orden = this.tipoSeleccionado.Categorias.length + 1;
        this.categoriaSeleccionada.Visible = true;
        $('#modalItemCategoria').modal('show');
    }

    onClickSeleccionarCategoria(
        event: any,
        item: Categoria
    ) {
        event.preventDefault();
        this.categoriaSeleccionada = item;
        this.subcategoriaSeleccionada = new Subcategoria(-1);
    }

    onClickEditarCatgoria(
        event: any,
        item: Categoria
    ) {
        event.preventDefault();
        this.onClickSeleccionarCategoria(event, item);
        this.categoriaSeleccionada.IdTipo = this.tipoSeleccionado.Id;
        $('#modalItemCategoria').modal('show');
    }

    onClickGuardarItemCategoria(
        event: any
    ) {
        event.preventDefault();

        if (this.categoriaSeleccionada.Descripcion.trim().length > 0) {

            this._tiposServices.saveCategoria(this.categoriaSeleccionada)
                .subscribe(
                    response => {
                        this.procesando = false;

                        this.getTiposABM(this.categoriaSeleccionada.IdTipo, this.categoriaSeleccionada.Id);

                        this.showNotification('success', 'Los datos se actualizaron correctamente.');
                        $('#modalItemCategoria').modal('hide');

                    },
                    error => {
                        this.procesando = false;
                        this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                        console.log(<any>error);
                    }
                );

        }
    }

    onClickEliminarItemCategoria(
        event: any
    ) {
        event.preventDefault();

        if (this.categoriaSeleccionada.Descripcion.trim().length > 0) {

            this._tiposServices.deleteCategoria(this.categoriaSeleccionada.Id)
                .subscribe(
                    response => {
                        this.procesando = false;

                        this.getTiposABM(this.categoriaSeleccionada.IdTipo, -1);

                        this.showNotification('success', 'Los datos se actualizaron correctamente.');
                        $('#modalItemCategoria').modal('hide');

                    },
                    error => {
                        this.procesando = false;
                        this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                        console.log(<any>error);
                    }
                );

        }
    }



    onClickAgregarSubcategoria(
        event: any
    ) {
        event.preventDefault();
        this.subcategoriaSeleccionada = new Subcategoria(-1);
        this.subcategoriaSeleccionada.IdCategoria = this.categoriaSeleccionada.Id;
        this.subcategoriaSeleccionada.Orden = this.categoriaSeleccionada.Subcategorias.length + 1;
        this.subcategoriaSeleccionada.Visible = true;

        this.listMedidas.forEach(item => {
            item.Chequed = false;
        });

        console.log('this.subcategoriaSeleccionada', this.subcategoriaSeleccionada);
        console.log('this.listMedidas', this.listMedidas);

        $('#modalItemSubcategoria').modal('show');
    }

    onClickEditarSubcatgoria(
        event: any,
        item: Subcategoria
    ) {
        event.preventDefault();
        this.subcategoriaSeleccionada = item;
        this.subcategoriaSeleccionada.IdCategoria = this.categoriaSeleccionada.Id;

        this.listMedidas.forEach(item => {
            item.Chequed = this.subcategoriaSeleccionada.Medidas.find(sm => sm.Medida.Id === item.Id) != null;
        });

        $('#modalItemSubcategoria').modal('show');
    }


    onClickGuardarItemSubcategoria(
        event: any
    ) {
        event.preventDefault();

        if (this.subcategoriaSeleccionada.Descripcion.trim().length > 0) {

            let values: Array<Medida> = this.listMedidas.filter(opt => opt.Chequed).map(opt => opt);

            this.subcategoriaSeleccionada.Medidas = [];
            values.forEach(item => {
                let subcateMedida: SubcategoriaMedida = new SubcategoriaMedida();
                subcateMedida.Medida = item;
                this.subcategoriaSeleccionada.Medidas.push(subcateMedida);
            });
            console.log('this.subcategoriaSeleccionada', this.subcategoriaSeleccionada);

            this._tiposServices.saveSubcategoria(this.subcategoriaSeleccionada)
                .subscribe(
                    response => {
                        this.procesando = false;

                        this.getTiposABM(this.tipoSeleccionado.Id, this.categoriaSeleccionada.Id);

                        this.showNotification('success', 'Los datos se actualizaron correctamente.');
                        $('#modalItemSubcategoria').modal('hide');
                    },
                    error => {
                        this.procesando = false;
                        this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                        console.log(<any>error);
                    }
                );
        }
    }


    onClickEliminarItemSubcategoria(
        event: any
    ) {
        event.preventDefault();

        debugger;
        if (this.subcategoriaSeleccionada.Descripcion.trim().length > 0) {

            this._tiposServices.deleteSubcategoria(this.subcategoriaSeleccionada.Id)
                .subscribe(
                    response => {
                        this.procesando = false;

                        this.getTiposABM(this.tipoSeleccionado.Id, this.categoriaSeleccionada.Id);

                        this.showNotification('success', 'Los datos se actualizaron correctamente.');
                        $('#modalItemSubcategoria').modal('hide');
                    },
                    error => {
                        this.procesando = false;
                        this.showNotification('error', 'Ocurrió un error al actualizar los datos.');
                        console.log(<any>error);
                    }
                );
        }
    }



    public showNotification(type: string, message: string): void {
        this._notifier.notify(type, message);
    }

    public hideOldestNotification(): void {
        this._notifier.hideOldest();
    }

}
