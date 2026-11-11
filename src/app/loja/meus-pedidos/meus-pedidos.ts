
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface ItemPedido {
  idItem: number;
  nome: string;
  quantidade: number;
  preco: number;
}

interface Pedido {
  id: number;
  clienteId: number;
  data: string;
  total: number;
  status: string;
  itens: ItemPedido[];
}

// Formato recebido do AtendimentoController
interface AtendimentoResposta {
  idAtendimento: number;
  idPessoa: number;
  nomePessoa: string;
  dataAtendimento: string;
  statusAtendimento: string;
  itens: {
    idAtendimento: number;
    idItem: number;
    item: string;
    idFuncionario: number;
    nomeFuncionario: string;
    cargo: string;
    quantidade: number;
    valorUnitario: number;
  }[];
}

@Component({
  selector: 'app-meus-pedidos',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './meus-pedidos.html',
  styleUrl: './meus-pedidos.css'
})
export class MeusPedidos implements OnInit {

  private readonly apiUrl = 'https://localhost:7030/api/Atendimento';
  private readonly chaveCliente = 'cliente-estetica-id';

  private readonly http = inject(HttpClient);

  clienteId = signal('');
  pedidoSelecionado = signal<Pedido | null>(null);
  mensagem = signal('');

  pedidos = signal<Pedido[]>([]);
  pesquisou = signal(false);
  carregando = signal(false);

  totalPedidos = computed(() => this.pedidos().length);

  // CARREGAR OS PEDIDOS AO ABRIR A TELA
  ngOnInit(): void {
    const idSalvo = sessionStorage.getItem(this.chaveCliente);

    if (!idSalvo) {
      this.mensagem.set(
        'Não foi possível identificar o cliente. Realize seu cadastro novamente.'
      );
      return;
    }

    this.clienteId.set(idSalvo);
    this.consultarPedidos();
  }

  // CONSULTAR PEDIDOS NA API
  consultarPedidos(): void {
    const id = Number(this.clienteId());

    if (!Number.isInteger(id) || id < 1) {
      this.mensagem.set('ID de cliente inválido.');
      this.pedidos.set([]);
      this.pesquisou.set(false);
      return;
    }

    this.pedidoSelecionado.set(null);
    this.mensagem.set('');
    this.pedidos.set([]);
    this.pesquisou.set(true);
    this.carregando.set(true);

    this.http.get<AtendimentoResposta[]>(
      `${this.apiUrl}/cliente/${id}`
    ).subscribe({
      next: resposta => {
        const pedidosConvertidos: Pedido[] = resposta.map(atendimento => {

          const itens: ItemPedido[] = atendimento.itens.map(item => ({
            idItem: item.idItem,
            nome: item.item,
            quantidade: item.quantidade,
            preco: Number(item.valorUnitario)
          }));

          const total = itens.reduce(
            (soma, item) => soma + item.quantidade * item.preco,
            0
          );

          return {
            id: atendimento.idAtendimento,
            clienteId: atendimento.idPessoa,
            data: atendimento.dataAtendimento,
            total,
            status: this.formatarStatus(atendimento.statusAtendimento),
            itens
          };
        });

        this.pedidos.set(pedidosConvertidos);

        if (pedidosConvertidos.length === 0) {
          this.mensagem.set(
            'Nenhum pedido encontrado para este cliente.'
          );
        }

        this.carregando.set(false);
      },

      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao consultar pedidos:', erro);

        this.pedidos.set([]);

        if (erro.status === 0) {
          this.mensagem.set(
            'Não foi possível conectar à API. Verifique se o backend está executando.'
          );
        } else if (erro.status === 404) {
          this.mensagem.set(
            'Cliente não encontrado.'
          );
        } else {
          this.mensagem.set(
            'Erro ao consultar os pedidos. Tente novamente.'
          );
        }

        this.carregando.set(false);
      }
    });
  }

  // TRADUZIR O CÓDIGO DE STATUS DO BANCO
  private formatarStatus(status: string): string {
    switch (status?.trim().toUpperCase()) {
      case 'A':
        return 'Aberto';
      default:
        return status || 'Não informado';
    }
  }

  // ABRIR DETALHES DO PEDIDO
  verDetalhes(pedido: Pedido): void {
    this.pedidoSelecionado.set(pedido);
  }

  // FECHAR DETALHES
  fecharDetalhes(): void {
    this.pedidoSelecionado.set(null);
  }

  // FORMATAR DATA
  formatarData(data: string): string {
    return new Date(`${data.substring(0, 10)}T00:00:00`)
      .toLocaleDateString('pt-BR');
  }

  // FORMATAR PREÇO
  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  // CLASSE CSS DO STATUS
  classeStatus(status: string): string {
    return status
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
  }
}
