
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { CarrinhoService } from '../../core/services/carrinho.service';

interface PedidoResposta {
  idatendimento?: number;
  idAtendimento?: number;
}

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho {

  private readonly apiUrl = 'https://localhost:7030/api/Atendimento';
  private readonly chaveCliente = 'cliente-estetica-id';

  private readonly http = inject(HttpClient);
  private readonly carrinhoService = inject(CarrinhoService);

  itens = this.carrinhoService.itens;
  totalItens = this.carrinhoService.totalItens;
  valorTotal = this.carrinhoService.valorTotal;

  mensagem = signal('');
  tipoMensagem = signal<'sucesso' | 'erro'>('sucesso');
  finalizando = signal(false);

  aumentarQuantidade(id: number, tipo: string, quantidade: number): void {
    this.carrinhoService.alterarQuantidade(id, tipo, quantidade + 1);
  }

  diminuirQuantidade(id: number, tipo: string, quantidade: number): void {
    this.carrinhoService.alterarQuantidade(id, tipo, quantidade - 1);
  }

  atualizarQuantidade(
    id: number,
    tipo: string,
    event: Event
  ): void {
    const campo = event.target as HTMLInputElement;
    const quantidade = Number(campo.value);

    if (!Number.isInteger(quantidade) || quantidade < 1) {
      this.mostrarMensagem('Informe uma quantidade válida.', 'erro');
      return;
    }

    this.carrinhoService.alterarQuantidade(id, tipo, quantidade);
  }

  removerItem(id: number, tipo: string): void {
    this.carrinhoService.remover(id, tipo);
    this.mostrarMensagem('Item removido do carrinho.', 'sucesso');
  }

  limparCarrinho(): void {
    this.carrinhoService.limpar();
    this.mostrarMensagem('Carrinho esvaziado.', 'sucesso');
  }

  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  finalizarPedido(): void {

    if (this.finalizando()) {
      return;
    }

    const itensCarrinho = this.itens();

    if (itensCarrinho.length === 0) {
      this.mostrarMensagem(
        'Adicione itens antes de finalizar o pedido.',
        'erro'
      );
      return;
    }

    // Recuperar o cliente cadastrado
    const idPessoa = Number(
      sessionStorage.getItem(this.chaveCliente)
    );

    if (!idPessoa || !Number.isInteger(idPessoa)) {
      this.mostrarMensagem(
        'Cliente não identificado. Realize o cadastro antes de finalizar a compra.',
        'erro'
      );
      return;
    }

    // Montar a data no formato esperado pelo backend
    const hoje = new Date();

    const dataAtendimento = [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, '0'),
      String(hoje.getDate()).padStart(2, '0')
    ].join('-');

    // Montar os dados do pedido conforme AtendimentoPostDTO
    const pedido = {
      idPessoa: idPessoa,
      dataAtendimento: dataAtendimento,
      statusAtendimento: 'A',

      itens: itensCarrinho.map(item => ({
        idItem: item.id,
        idFuncionario: 4,
        quantidade: item.quantidade,
        valorUnitario: item.preco
      }))
    };

    this.finalizando.set(true);
    this.mensagem.set('');

    this.http.post<PedidoResposta>(this.apiUrl, pedido).subscribe({

      next: (resposta) => {

        console.log('Pedido registrado:', resposta);

        this.carrinhoService.limpar();

        this.mostrarMensagem(
          'Pedido confirmado e registrado com sucesso! Número: ' +
          (resposta.idatendimento ?? resposta.idAtendimento ?? 'consulte seus pedidos'),
          'sucesso'
        );

        this.finalizando.set(false);
      },

      error: (erro) => {

        console.error('Erro ao registrar pedido:', erro);

        if (erro.status === 0) {
          this.mostrarMensagem(
            'Não foi possível conectar à API. Verifique se o backend está em execução.',
            'erro'
          );

        } else if (erro.status === 404) {
          this.mostrarMensagem(
            'Cliente ou item não encontrado. Confira os dados do pedido.',
            'erro'
          );

        } else if (erro.status === 400) {
          this.mostrarMensagem(
            erro?.error?.mensagem ||
            erro?.error?.message ||
            'Dados inválidos. Confira os itens do pedido.',
            'erro'
          );

        } else {
          this.mostrarMensagem(
            erro?.error?.mensagem ||
            erro?.error?.message ||
            'Não foi possível registrar o pedido. Verifique o estoque e os dados enviados.',
            'erro'
          );
        }

        this.finalizando.set(false);
      }

    });
  }

  private mostrarMensagem(
    texto: string,
    tipo: 'sucesso' | 'erro'
  ): void {
    this.mensagem.set(texto);
    this.tipoMensagem.set(tipo);
  }
}
