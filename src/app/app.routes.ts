
import { Routes } from '@angular/router';

export const routes: Routes = [

  // Página inicial
  {
    path: '',
    redirectTo: 'cadastro-cliente',
    pathMatch: 'full'
  },

  // LOJA VIRTUAL

  {
    path: 'cadastro-cliente',
    loadComponent: () =>
      import('./loja/cadastro-cliente/cadastro-cliente')
        .then(m => m.CadastroCliente)
  },

  {
    path: 'catalogo',
    loadComponent: () =>
      import('./loja/catalogo/catalogo')
        .then(m => m.Catalogo)
  },

  {
    path: 'carrinho',
    loadComponent: () =>
      import('./loja/carrinho/carrinho')
        .then(m => m.Carrinho)
  },

  {
    path: 'meus-pedidos',
    loadComponent: () =>
      import('./loja/meus-pedidos/meus-pedidos')
        .then(m => m.MeusPedidos)
  },

  // PAINEL ADMINISTRATIVO

  {
    path: 'login',
    loadComponent: () =>
      import('./administrativo/login/login')
        .then(m => m.Login)
  },

  {
    path: 'administrativo/dashboard',
    loadComponent: () =>
      import('./administrativo/dashboard/dashboard')
        .then(m => m.Dashboard)
  },

  {
    path: 'administrativo/clientes',
    loadComponent: () =>
      import('./administrativo/clientes/listar-clientes')
        .then(m => m.ListarClientes)
  },

  // ROTA NÃO ENCONTRADA
  {
    path: '**',
    redirectTo: 'cadastro-cliente'
  },


{
  path: 'administrativo/categorias',
  loadComponent: () =>
    import('./administrativo/categorias/categorias')
      .then(m => m.Categorias)
},


{
  path: 'administrativo/produtos',
  loadComponent: () =>
    import('./administrativo/produtos/produtos')
      .then(m => m.Produtos)
},


{
  path: 'administrativo/servicos',
  loadComponent: () =>
    import('./administrativo/servicos/servicos')
      .then(m => m.Servicos)
},


{
  path: 'administrativo/funcionario',
  loadComponent: () =>
    import('./administrativo/funcionarios/funcionarios')
      .then(m => m.FuncionarioComponent)
},


{
  path: 'administrativo/estoque',
  loadComponent: () =>
    import('./administrativo/estoque/estoque')
      .then(m => m.EstoqueComponent)
},


{
  path: 'administrativo/pedidos',
  loadComponent: () =>
    import('./administrativo/pedidos/pedidos')
      .then(m => m.PedidosComponent)
},


{
  path: 'administrativo/entrada-produtos',
  loadComponent: () =>
    import('./administrativo/entrada-produtos/entrada-produtos')
      .then(m => m.EntradaProdutosComponent)
},


];
