
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Categoria {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias {

  categorias: Categoria[] = [
    { id: 1, nome: 'Cuidados com a Pele' },
    { id: 2, nome: 'Higiene Pessoal' },
    { id: 3, nome: 'Cosméticos' },
    { id: 4, nome: 'Serviços Estéticos' },
    { id: 5, nome: 'Bem-Estar' }
  ];

  nomeCategoria = '';
  categoriaEditando: number | null = null;
  mensagem = '';
  erro = '';

  salvar(): void {
    this.mensagem = '';
    this.erro = '';

    const nome = this.nomeCategoria.trim();

    if (!nome) {
      this.erro = 'Informe o nome da categoria.';
      return;
    }

    const duplicada = this.categorias.some(c =>
      c.nome.toLowerCase() === nome.toLowerCase() &&
      c.id !== this.categoriaEditando
    );

    if (duplicada) {
      this.erro = 'Esta categoria já está cadastrada.';
      return;
    }

    if (this.categoriaEditando !== null) {
      const categoria = this.categorias.find(
        c => c.id === this.categoriaEditando
      );

      if (categoria) {
        categoria.nome = nome;
      }

      this.mensagem = 'Categoria atualizada com sucesso!';
    } else {
      const novoId = Math.max(0, ...this.categorias.map(c => c.id)) + 1;

      this.categorias.push({
        id: novoId,
        nome
      });

      this.mensagem = 'Categoria cadastrada com sucesso!';
    }

    this.limpar();
  }

  editar(categoria: Categoria): void {
    this.nomeCategoria = categoria.nome;
    this.categoriaEditando = categoria.id;
    this.mensagem = '';
    this.erro = '';
  }

  excluir(id: number): void {
    this.categorias = this.categorias.filter(c => c.id !== id);
    this.mensagem = 'Categoria removida da lista.';
    this.limpar();
  }

  limpar(): void {
    this.nomeCategoria = '';
    this.categoriaEditando = null;
  }
}
