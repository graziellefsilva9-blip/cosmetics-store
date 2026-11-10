
import { Injectable, signal, computed } from '@angular/core';

export interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  tipo: 'PRODUTO' | 'SERVIÇO';
  quantidade: number;
  icone: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private readonly chaveStorage = 'carrinho-estetica';

  private itensState = signal<ItemCarrinho[]>(this.carregarCarrinho());

  itens = this.itensState.asReadonly();

  totalItens = computed(() =>
    this.itensState().reduce((total, item) => total + item.quantidade, 0)
  );

  valorTotal = computed(() =>
    this.itensState().reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    )
  );

  private carregarCarrinho(): ItemCarrinho[] {
    try {
      const dados = localStorage.getItem(this.chaveStorage);
      return dados ? JSON.parse(dados) as ItemCarrinho[] : [];
    } catch {
      return [];
    }
  }

  private salvarCarrinho(): void {
    localStorage.setItem(
      this.chaveStorage,
      JSON.stringify(this.itensState())
    );
  }

  adicionar(item: Omit<ItemCarrinho, 'quantidade'>): void {
    const lista = [...this.itensState()];
    const existente = lista.find(
      atual => atual.id === item.id && atual.tipo === item.tipo
    );

    if (existente) {
      existente.quantidade++;
    } else {
      lista.push({ ...item, quantidade: 1 });
    }

    this.itensState.set(lista);
    this.salvarCarrinho();
  }

  alterarQuantidade(id: number, tipo: string, quantidade: number): void {
    if (quantidade < 1) {
      this.remover(id, tipo);
      return;
    }

    this.itensState.update(lista =>
      lista.map(item =>
        item.id === id && item.tipo === tipo
          ? { ...item, quantidade }
          : item
      )
    );

    this.salvarCarrinho();
  }

  remover(id: number, tipo: string): void {
    this.itensState.update(lista =>
      lista.filter(item => !(item.id === id && item.tipo === tipo))
    );

    this.salvarCarrinho();
  }

  limpar(): void {
    this.itensState.set([]);
    this.salvarCarrinho();
  }
}
