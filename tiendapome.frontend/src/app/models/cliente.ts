import { ListaPrecio, ListaPrecioCliente } from './listaPrecio';

// Generated by https://quicktype.io

export class Cliente {
      Id: number;
      Email: string;
      Codigo: string;
      Apellido: string;
      Nombre: string;
      Celular: string;
      IdentificacionTributaria: string;
      RazonSocial: string;
      NombreFantasia: string;
      Vigente: boolean;
      ComisionApp: number;
      DescuentoOculto: number;
      Direccion: string;
      Localidad: string;
      Provincia: Provincia;
      CodigoPostal: string;
      SituacionIVA: SituacionIVA;
      Observaciones: string;

      IdProvincia: number;
      IdSituacionIVA: number;

      AsignarListaMayorista: boolean;
      ListasPrecioAsignada: boolean;
      ListasPrecio: ClienteLista[];
      ClienteList: string;
      Rol: Rol;
      constructor() {
            this.Id = -1;
            this.Rol = new Rol();
            this.AsignarListaMayorista = false;
            this.Provincia = new Provincia();
            this.SituacionIVA = new SituacionIVA();
      }
}

export class ClienteLista {
      Id: number;
      IdCliente: number;
      ListaPrecio: ListaPrecio;
      ListaPrecioCliente: ListaPrecioCliente;

      constructor() { }
}


export class Rol {
      Id: number;
      Descripcion: string;
      Vigente: boolean;

      constructor() {
            this.Id = -1;
      }
}

export class SituacionIVA {
      Id: number;
      Descripcion: string;
      Vigente: boolean;

      constructor() {
            this.Id = -1;
      }
}

export class Provincia {
      Id: number;
      Descripcion: string;
      Vigente: boolean;

      constructor() {
            this.Id = -1;
      }
}
