
import { Injectable, signal, computed } from '@angular/core';

export interface ItemCarrinho {
  id: number;
  nome: string;
  preco: number;
  tipo: string;
  quantidade: number;
  icone: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {

  private readonly chaveStorage = 'carrinho-estetica';

  private carregarCarrinho(): ItemCarrinho[] {
    try {
      if (typeof localStorage === 'undefined') return [];

      const dados = localStorage.getItem(this.chaveStorage);

      return dados ? JSON.parse(dados) as ItemCarrinho[] : [];
    } catch {
      return [];
    }
  }

  itens = signal<ItemCarrinho[]>(this.carregarCarrinho());

  totalItens = computed(() =>
    this.itens().reduce(
      (total, item) => total + item.quantidade,
      0
    )
  );

  valorTotal = computed(() =>
    this.itens().reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    )
  );

  private salvar(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        this.chaveStorage,
        JSON.stringify(this.itens())
      );
    }
  }

  adicionar(item: {
    id: number;
    nome: string;
    preco: number;
    tipo: string;
    icone: string;
  }): void {

    const existente = this.itens().find(
      produto =>
        produto.id === item.id &&
        produto.tipo === item.tipo
    );

    if (existente) {
      this.itens.update(lista =>
        lista.map(produto =>
          produto.id === item.id && produto.tipo === item.tipo
            ? { ...produto, quantidade: produto.quantidade + 1 }
            : produto
        )
      );
    } else {
      this.itens.update(lista => [
        ...lista,
        { ...item, quantidade: 1 }
      ]);
    }

    this.salvar();
  }

  alterarQuantidade(
    id: number,
    tipo: string,
    quantidade: number
  ): void {

    if (quantidade <= 0) {
      this.remover(id, tipo);
      return;
    }

    this.itens.update(lista =>
      lista.map(item =>
        item.id === id && item.tipo === tipo
          ? { ...item, quantidade }
          : item
      )
    );

    this.salvar();
  }

  remover(id: number, tipo: string): void {
    this.itens.update(lista =>
      lista.filter(
        item => !(item.id === id && item.tipo === tipo)
      )
    );

    this.salvar();
  }

  limpar(): void {
    this.itens.set([]);
    this.salvar();
  }
}
