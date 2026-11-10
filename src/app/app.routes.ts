
import { Routes } from '@angular/router';


export const routes: Routes = [
  // Página inicial da loja
  {
    path: '',
    loadComponent: () =>
      import('./loja/inicio/inicio')
        .then(m => m.Inicio)
  },

  // Cadastro de clientes
  {
    path: 'cadastro-cliente',
    loadComponent: () =>
      import('./loja/cadastro-cliente/cadastro-cliente')
        .then(m => m.CadastroCliente)
  },

  // Endereço não encontrado
  {
    path: '**',
    redirectTo: ''
  }
];
