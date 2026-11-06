import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'cadastro-cliente',
    loadComponent: () =>
      import('./loja/cadastro-cliente/cadastro-cliente')
        .then(m => m.CadastroCliente)
  }
];