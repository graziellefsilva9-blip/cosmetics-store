
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ProdutoCompartilhado,
  ProdutoCompartilhadoService
} from '../../core/services/produto-compartilhado.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos {

  private readonly produtoService = inject(ProdutoCompartilhadoService);

  // Lista compartilhada de produtos
  get produtos(): ProdutoCompartilhado[] {
    return this.produtoService.produtos();
  }

  // Categorias disponíveis
  categorias: string[] = [
    'Cuidados com a Pele',
    'Higiene Pessoal',
    'Cosméticos',
    'Bem-Estar'
  ];

  // Formulário
  produto: ProdutoCompartilhado = this.novoProduto();

  pesquisa = '';
  editando = false;
  mensagem = '';
  erro = '';

  // Produto vazio
  novoProduto(): ProdutoCompartilhado {
    return {
      id: 0,
      nome: '',
      descricao: '',
      categoria: '',
      codigoPreco: 0,
      precoVenda: 0,
      unidade: 'UN',
      ativo: true,
      icone: '🌸'
    };
  }

  // Pesquisa de produtos
  get produtosFiltrados(): ProdutoCompartilhado[] {
    const termo = this.pesquisa.toLowerCase().trim();

    return this.produtos.filter(produto =>
      produto.nome.toLowerCase().includes(termo) ||
      produto.categoria.toLowerCase().includes(termo)
    );
  }

  // Cadastrar ou atualizar
  salvar(): void {
    this.mensagem = '';
    this.erro = '';

    if (
      !this.produto.nome.trim() ||
      !this.produto.descricao.trim() ||
      !this.produto.categoria ||
      this.produto.codigoPreco <= 0 ||
      this.produto.precoVenda <= 0 ||
      !this.produto.unidade.trim()
    ) {
      this.erro = 'Preencha todos os campos corretamente.';
      return;
    }

    if (this.editando) {
      this.produtoService.atualizar({ ...this.produto });

      this.mensagem = 'Produto atualizado com sucesso!';
    } else {
      const { id, ...novoProduto } = this.produto;

      this.produtoService.cadastrar(novoProduto);

      this.mensagem = 'Produto cadastrado com sucesso!';
    }

    this.limpar();
  }

  // Editar produto
  editar(produto: ProdutoCompartilhado): void {
    this.produto = { ...produto };
    this.editando = true;
    this.mensagem = '';
    this.erro = '';
  }

  // Desativar produto
  desativar(produto: ProdutoCompartilhado): void {
    this.produtoService.atualizar({
      ...produto,
      ativo: false
    });

    this.mensagem = 'Produto desativado com sucesso!';
    this.erro = '';
  }

  // Ativar produto
  ativar(produto: ProdutoCompartilhado): void {
    this.produtoService.atualizar({
      ...produto,
      ativo: true
    });

    this.mensagem = 'Produto ativado com sucesso!';
    this.erro = '';
  }

  // Limpar formulário
  limpar(): void {
    this.produto = this.novoProduto();
    this.editando = false;
    this.erro = '';
  }
}
