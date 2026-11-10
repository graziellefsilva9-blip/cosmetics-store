
<<<<<<< HEAD
import { Component, signal, computed } from '@angular/core';
import { CadastroCliente } from './loja/cadastro-cliente/cadastro-cliente';
import { ListarClientes } from './administrativo/clientes/listar-clientes';
import { RouterOutlet } from '@angular/router';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  tipo: string;
  categoria: string;
  icone: string;
  disponibilidade?: string;
}
=======
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
>>>>>>> 8c95618d4de5acf9bf3db783489b7f92d316ffb9

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [CadastroCliente, ListarClientes, RouterOutlet],
=======
  imports: [RouterOutlet],
>>>>>>> 8c95618d4de5acf9bf3db783489b7f92d316ffb9
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
