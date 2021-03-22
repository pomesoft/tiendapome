export class ListaPrecio {      
      public Id:            number;
      public Codigo:        string;
      public Precio:        number;
      public Descripcion:   string;
      public Vigente:       boolean;      

      constructor ( ) {}
}

export class ListaPrecioCliente extends ListaPrecio {      
      public ListaPrecio:     ListaPrecio;
      constructor (){
            super()
      }
}