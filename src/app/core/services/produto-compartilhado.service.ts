
import { Injectable, signal } from '@angular/core';

export interface ProdutoCompartilhado {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  codigoPreco: number;
  precoVenda: number;
  unidade: string;
  ativo: boolean;
  icone: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoCompartilhadoService {

  private readonly chave = 'produtos-estetica';

  private readonly produtosSignal = signal<ProdutoCompartilhado[]>(
    this.carregarProdutos()
  );

  readonly produtos = this.produtosSignal.asReadonly();

  private carregarProdutos(): ProdutoCompartilhado[] {
    const dados = localStorage.getItem(this.chave);

    if (dados) {
      try {
        return JSON.parse(dados) as ProdutoCompartilhado[];
      } catch {
        localStorage.removeItem(this.chave);
      }
    }

    return [
      {
        id: 1,
        nome: 'Hidratante Facial',
        descricao: 'Creme hidratante para cuidados diários com a pele.',
        categoria: 'Cuidados com a Pele',
        codigoPreco: 101,
        precoVenda: 85,
        unidade: 'UN',
        ativo: true,
        icone: '🌸'
      },
      {
        id: 2,
        nome: 'Protetor Solar FPS 50',
        descricao: 'Proteção solar facial para sua rotina diária.',
        categoria: 'Higiene Pessoal',
        codigoPreco: 102,
        precoVenda: 60,
        unidade: 'UN',
        ativo: true,
        icone: '☀️'
      },
      {
        id: 3,
        nome: 'Sérum Facial',
        descricao: 'Sérum facial para complementar seus cuidados.',
        categoria: 'Cosméticos',
        codigoPreco: 103,
        precoVenda: 75,
        unidade: 'UN',
        ativo: true,
        icone: '💧'
      },
      {
        id: 4,
        nome: 'Sabonete Facial',
        descricao: 'Sabonete líquido para limpeza facial.',
        categoria: 'Cuidados com a Pele',
        codigoPreco: 104,
        precoVenda: 35,
        unidade: 'UN',
        ativo: true,
        icone: '🧼'
      },
      {
        id: 5,
        nome: 'Óleo Corporal',
        descricao: 'Óleo corporal para hidratação e cuidado com a pele.',
        categoria: 'Bem-Estar',
        codigoPreco: 105,
        precoVenda: 55,
        unidade: 'UN',
        ativo: true,
        icone: '🌿'
      },
      {
        id: 8,
        nome: 'Máscara Facial',
        descricao: 'Máscara facial para cuidados cosméticos.',
        categoria: 'Cosméticos',
        codigoPreco: 106,
        precoVenda: 40,
        unidade: 'UN',
        ativo: true,
        icone: '🌼'
      }
    ];
  }

  private persistir(): void {
    localStorage.setItem(
      this.chave,
      JSON.stringify(this.produtosSignal())
    );
  }

  cadastrar(produto: Omit<ProdutoCompartilhado, 'id'>): void {
    const novoId = Math.max(
      0,
      ...this.produtosSignal().map(p => p.id)
    ) + 1;

    this.produtosSignal.update(lista => [
      ...lista,
      { ...produto, id: novoId }
    ]);

    this.persistir();
  }

  atualizar(produto: ProdutoCompartilhado): void {
    this.produtosSignal.update(lista =>
      lista.map(p => p.id === produto.id ? { ...produto } : p)
    );

    this.persistir();
  }
}
