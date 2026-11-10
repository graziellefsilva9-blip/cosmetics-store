
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ItemPedido {
  nome: string;
  quantidade: number;
  valorUnitario: number;
  funcionario: string;
}

interface Pedido {
  id: number;
  cliente: string;
  data: string;
  valorTotal: number;
  status: string;
  itens: ItemPedido[];
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class PedidosComponent {
  pedidos: Pedido[] = [
    {
      id: 1,
      cliente: 'Maria Oliveira',
      data: '2026-11-08',
      valorTotal: 169.80,
      status: 'Aberto',
      itens: [
        {
          nome: 'Hidratante Facial',
          quantidade: 2,
          valorUnitario: 49.90,
          funcionario: 'Ana Paula - Esteticista'
        },
        {
          nome: 'Limpeza de Pele',
          quantidade: 1,
          valorUnitario: 70,
          funcionario: 'Ana Paula - Esteticista'
        }
      ]
    },
    {
      id: 2,
      cliente: 'Carla Santos',
      data: '2026-11-09',
      valorTotal: 59.90,
      status: 'Em processamento',
      itens: [
        {
          nome: 'Protetor Solar',
          quantidade: 1,
          valorUnitario: 59.90,
          funcionario: 'Maria Oliveira - Atendente'
        }
      ]
    },
    {
      id: 3,
      cliente: 'Juliana Costa',
      data: '2026-11-10',
      valorTotal: 100,
      status: 'Concluído',
      itens: [
        {
          nome: 'Hidratação Facial',
          quantidade: 1,
          valorUnitario: 100,
          funcionario: 'Ana Paula - Esteticista'
        }
      ]
    }
  ];

  filtroStatus = 'Todos';
  idConsulta = '';
  pedidoSelecionado: Pedido | null = null;
  mensagem = '';

  get pedidosFiltrados(): Pedido[] {
    if (this.filtroStatus === 'Todos') {
      return this.pedidos;
    }

    return this.pedidos.filter(
      pedido => pedido.status === this.filtroStatus
    );
  }

  consultarPorId(): void {
    const id = Number(this.idConsulta);

    if (!id || id <= 0) {
      this.pedidoSelecionado = null;
      this.mensagem = 'Informe um ID válido.';
      return;
    }

    this.pedidoSelecionado =
      this.pedidos.find(pedido => pedido.id === id) ?? null;

    this.mensagem = this.pedidoSelecionado
      ? ''
      : 'Pedido não encontrado.';
  }

  visualizar(pedido: Pedido): void {
    this.pedidoSelecionado = pedido;
    this.mensagem = '';
  }

  atualizarStatus(pedido: Pedido, novoStatus: string): void {
    const fluxo: Record<string, string[]> = {
      'Aberto': ['Em processamento', 'Cancelado'],
      'Em processamento': ['Concluído', 'Cancelado'],
      'Concluído': [],
      'Cancelado': []
    };

    if (!fluxo[pedido.status]?.includes(novoStatus)) {
      this.mensagem = 'Essa alteração de status não é permitida.';
      return;
    }

    pedido.status = novoStatus;
    this.mensagem = `Pedido #${pedido.id} atualizado para ${novoStatus}.`;
  }

  podeAlterarStatus(pedido: Pedido): boolean {
    return pedido.status === 'Aberto' ||
      pedido.status === 'Em processamento';
  }

  limparConsulta(): void {
    this.idConsulta = '';
    this.pedidoSelecionado = null;
    this.mensagem = '';
  }

  get totalPedidos(): number {
    return this.pedidos.length;
  }

  get pedidosAbertos(): number {
    return this.pedidos.filter(
      p => p.status === 'Aberto'
    ).length;
  }

  get pedidosProcessando(): number {
    return this.pedidos.filter(
      p => p.status === 'Em processamento'
    ).length;
  }
}
