
import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ItemPedido {
  nome: string;
  quantidade: number;
  preco: number;
}

interface Pedido {
  id: number;
  clienteId: number;
  data: string;
  total: number;
  status: 'Aberto' | 'Em processamento' | 'Concluído' | 'Cancelado';
  itens: ItemPedido[];
}

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.css'
})
export class MeusPedidos {

  // Endpoint previsto para integração futura com a API:
  // GET https://localhost:7030/api/pessoas/{id}/pedidos
  private readonly apiUrl = 'https://localhost:7030/api/pessoas';

  clienteId = signal('');
  pedidoSelecionado = signal<Pedido | null>(null);
  mensagem = signal('');

  // Dados temporários para montar e testar a tela antes da integração.
  private pedidosExemplo: Pedido[] = [
    {
      id: 1001,
      clienteId: 1,
      data: '2026-10-20',
      total: 145,
      status: 'Concluído',
      itens: [
        { nome: 'Hidratante Facial', quantidade: 1, preco: 85 },
        { nome: 'Sabonete Facial', quantidade: 1, preco: 35 },
        { nome: 'Máscara Facial', quantidade: 1, preco: 25 }
      ]
    },
    {
      id: 1002,
      clienteId: 1,
      data: '2026-11-05',
      total: 180,
      status: 'Aberto',
      itens: [
        { nome: 'Limpeza de Pele', quantidade: 1, preco: 120 },
        { nome: 'Óleo Corporal', quantidade: 1, preco: 60 }
      ]
    },
    {
      id: 1003,
      clienteId: 2,
      data: '2026-11-07',
      total: 75,
      status: 'Em processamento',
      itens: [
        { nome: 'Sérum Facial', quantidade: 1, preco: 75 }
      ]
    }
  ];

  pedidos = signal<Pedido[]>([]);
  pesquisou = signal(false);

  totalPedidos = computed(() => this.pedidos().length);

  consultarPedidos(): void {
    const id = Number(this.clienteId());

    if (!Number.isInteger(id) || id < 1) {
      this.mensagem.set('Informe um ID de cliente válido.');
      this.pedidos.set([]);
      this.pesquisou.set(false);
      return;
    }

    this.pedidoSelecionado.set(null);
    this.mensagem.set('');
    this.pesquisou.set(true);

    // Temporário: substitua esta consulta pelos dados da API na integração.
    this.pedidos.set(
      this.pedidosExemplo.filter(pedido => pedido.clienteId === id)
    );

    if (this.pedidos().length === 0) {
      this.mensagem.set('Nenhum pedido encontrado para este cliente.');
    }
  }

  verDetalhes(pedido: Pedido): void {
    this.pedidoSelecionado.set(pedido);
  }

  fecharDetalhes(): void {
    this.pedidoSelecionado.set(null);
  }

  formatarData(data: string): string {
    return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR');
  }

  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  classeStatus(status: string): string {
    return status.toLowerCase().replace(' ', '-');
  }
}
