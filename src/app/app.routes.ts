
import { Routes } from '@angular/router';

export const routes: Routes = [
  // Página inicial: por enquanto, direciona para o cadastro
  {
    path: '',
    redirectTo: 'cadastro-cliente',
    pathMatch: 'full'
  },

  // Cadastro de clientes
  {
    path: 'cadastro-cliente',
    loadComponent: () =>
      import('./loja/cadastro-cliente/cadastro-cliente')
        .then(m => m.CadastroCliente)
  },

  // Caminho para páginas ainda não cadastradas
  {
    path: '**',
    redirectTo: 'cadastro-cliente'
  }
];
