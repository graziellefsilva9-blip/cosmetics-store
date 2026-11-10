
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../core/services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho {

  // Endpoint previsto para registrar o pedido na API
  private readonly apiUrl = 'https://localhost:7030/api/Pedidos';

  private carrinhoService = inject(CarrinhoService);

  itens = this.carrinhoService.itens;
  totalItens = this.carrinhoService.totalItens;
  valorTotal = this.carrinhoService.valorTotal;

  mensagem = signal('');
  tipoMensagem = signal<'sucesso' | 'erro'>('sucesso');

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
    if (this.itens().length === 0) {
      this.mostrarMensagem('Adicione itens antes de finalizar o pedido.', 'erro');
      return;
    }

    this.mostrarMensagem(
      'Carrinho pronto. A confirmação e o registro do pedido serão ativados na integração com a API.',
      'sucesso'
    );
  }

  private mostrarMensagem(
    texto: string,
    tipo: 'sucesso' | 'erro'
  ): void {
    this.mensagem.set(texto);
    this.tipoMensagem.set(tipo);
  }
}
