export class Parametro {      
      public _id: string;
      constructor (
            public Id:            number,
            public Descripcion:   string,
            public Vigente:       boolean,
            public Clave:         string,
            public Valor:         string,
            public Editable:      boolean
      ){}
}