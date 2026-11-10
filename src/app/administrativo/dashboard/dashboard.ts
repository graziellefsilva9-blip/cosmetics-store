
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Indicador {
  titulo: string;
  valor: number;
  icone: string;
  descricao: string;
  rota: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  // Endpoints previstos para integração futura com a API.
  private readonly apiUrls = {
    clientes: 'https://localhost:7030/api/pessoas',
    produtos: 'https://localhost:7030/api/itens',
    pedidos: 'https://localhost:7030/api/pedidos',
    estoque: 'https://localhost:7030/api/estoque'
  };

  indicadores = signal<Indicador[]>([
    {
      titulo: 'Clientes cadastrados',
      valor: 25,
      icone: '♙',
      descricao: 'Clientes registrados',
      rota: '/administrativo/clientes'
    },
    {
      titulo: 'Produtos',
      valor: 18,
      icone: '♧',
      descricao: 'Produtos cadastrados',
      rota: '/administrativo/produtos'
    },
    {
      titulo: 'Serviços',
      valor: 12,
      icone: '✧',
      descricao: 'Serviços disponíveis',
      rota: '/administrativo/servicos'
    },
    {
      titulo: 'Pedidos em aberto',
      valor: 5,
      icone: '▤',
      descricao: 'Aguardando atendimento',
      rota: '/administrativo/pedidos'
    }
  ]);

  atalhos = [
    {
      nome: 'Clientes',
      descricao: 'Cadastrar e consultar clientes',
      rota: '/administrativo/clientes',
      icone: '♙'
    },
    {
      nome: 'Produtos',
      descricao: 'Gerenciar produtos da loja',
      rota: '/administrativo/produtos',
      icone: '♧'
    },
    {
      nome: 'Serviços',
      descricao: 'Gerenciar serviços oferecidos',
      rota: '/administrativo/servicos',
      icone: '✧'
    },
    {
      nome: 'Categorias',
      descricao: 'Organizar categorias',
      rota: '/administrativo/categorias',
      icone: '▦'
    },
    {
      nome: 'Funcionários',
      descricao: 'Gerenciar funcionários',
      rota: '/administrativo/funcionarios',
      icone: '♙'
    },
    {
      nome: 'Estoque',
      descricao: 'Consultar quantidades disponíveis',
      rota: '/administrativo/estoque',
      icone: '▤'
    },
    {
      nome: 'Pedidos',
      descricao: 'Consultar e atualizar pedidos',
      rota: '/administrativo/pedidos',
      icone: '🛍'
    }
  ];
}
