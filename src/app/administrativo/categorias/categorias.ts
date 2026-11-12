
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoriaService } from '../../core/services/categoria.service';
import { Categoria as CategoriaAPI } from '../../models/categoria.model';

interface CategoriaTela {
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
export class Categorias implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  private categoriaService = inject(CategoriaService);


  categorias: CategoriaTela[] = [];

  nomeCategoria = '';
  categoriaEditando: number | null = null;
  mensagem = '';
  erro = '';

  ngOnInit(): void {
    this.carregarCategorias();
  }

  // Buscar categorias no banco de dados pela API
 
carregarCategorias(): void {
  this.categoriaService.listar().subscribe({
    next: (dados) => {
      console.log('Categorias recebidas da API:', dados);

      this.categorias = dados.map(c => ({
        id: c.idcategoria!,
        nome: c.categoria
      }));

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Erro ao carregar categorias:', err);
      this.erro = 'Não foi possível carregar as categorias.';
      this.cdr.detectChanges();
    }
  });
}


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

    const categoriaAPI: CategoriaAPI = {
      categoria: nome
    };

    if (this.categoriaEditando !== null) {
      categoriaAPI.idcategoria = this.categoriaEditando;

      this.categoriaService.atualizar(
        this.categoriaEditando,
        categoriaAPI
      ).subscribe({
        next: () => {
          this.mensagem = 'Categoria atualizada com sucesso!';
          this.limpar();
          this.carregarCategorias();
        },
        error: (err) => {
          console.error('Erro ao atualizar categoria:', err);
          this.erro = 'Não foi possível atualizar a categoria.';
        }
      });

    } else {
      this.categoriaService.cadastrar(categoriaAPI).subscribe({
        next: () => {
          this.mensagem = 'Categoria cadastrada com sucesso!';
          this.limpar();
          this.carregarCategorias();
        },
        error: (err) => {
          console.error('Erro ao cadastrar categoria:', err);
          this.erro = 'Não foi possível cadastrar a categoria.';
        }
      });
    }
  }

  editar(categoria: CategoriaTela): void {
    this.nomeCategoria = categoria.nome;
    this.categoriaEditando = categoria.id;
    this.mensagem = '';
    this.erro = '';
  }

  excluir(id: number): void {
    this.mensagem = '';
    this.erro = '';

    this.categoriaService.excluir(id).subscribe({
      next: () => {
        this.mensagem = 'Categoria excluída com sucesso!';
        this.limpar();
        this.carregarCategorias();
      },
      error: (err) => {
        console.error('Erro ao excluir categoria:', err);

        if (err.status === 409 || err.status === 400) {
          this.erro = 'Não foi possível excluir. Verifique se existem itens vinculados a esta categoria.';
        } else {
          this.erro = 'Erro ao excluir categoria.';
        }
      }
    });
  }

  limpar(): void {
    this.nomeCategoria = '';
    this.categoriaEditando = null;
  }
}
