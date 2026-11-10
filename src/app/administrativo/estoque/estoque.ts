
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProdutoEstoque {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  precoVenda: number;
  quantidade: number;
  ativo: boolean;
}

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estoque.html',
  styleUrl: './estoque.css'
})
export class EstoqueComponent {
  produtos: ProdutoEstoque[] = [
    {
      id: 1,
      nome: 'Hidratante Facial',
      descricao: 'Hidratante para cuidados com a pele',
      categoria: 'Cuidados com a Pele',
      preco: 35,
      precoVenda: 49.90,
      quantidade: 10,
      ativo: true
    },
    {
      id: 2,
      nome: 'Sabonete Líquido',
      descricao: 'Sabonete líquido corporal',
      categoria: 'Higiene Pessoal',
      preco: 18,
      precoVenda: 25.90,
      quantidade: 5,
      ativo: true
    },
    {
      id: 3,
      nome: 'Protetor Solar',
      descricao: 'Protetor solar facial',
      categoria: 'Cuidados com a Pele',
      preco: 40,
      precoVenda: 59.90,
      quantidade: 0,
      ativo: true
    }
  ];

  busca = '';
  idConsulta = '';
  produtoEncontrado: ProdutoEstoque | null = null;
  mensagem = '';

  get produtosFiltrados(): ProdutoEstoque[] {
    const termo = this.busca.toLowerCase();

    return this.produtos.filter(p =>
      p.nome.toLowerCase().includes(termo) ||
      p.categoria.toLowerCase().includes(termo)
    );
  }

  consultarPorId(): void {
    const id = Number(this.idConsulta);

    if (!id || id <= 0) {
      this.produtoEncontrado = null;
      this.mensagem = 'Informe um ID válido.';
      return;
    }

    this.produtoEncontrado =
      this.produtos.find(p => p.id === id) ?? null;

    this.mensagem = this.produtoEncontrado
      ? ''
      : 'Produto não encontrado.';
  }

  limparConsulta(): void {
    this.idConsulta = '';
    this.produtoEncontrado = null;
    this.mensagem = '';
  }

  get totalProdutos(): number {
    return this.produtos.length;
  }

  get totalUnidades(): number {
    return this.produtos.reduce(
      (total, produto) => total + produto.quantidade, 0
    );
  }

  get produtosSemEstoque(): number {
    return this.produtos.filter(p => p.quantidade === 0).length;
  }
}
