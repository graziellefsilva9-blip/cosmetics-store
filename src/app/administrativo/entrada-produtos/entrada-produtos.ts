
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Produto {
  id: number;
  nome: string;
  quantidade: number;
}

interface Entrada {
  id: number;
  produto: string;
  data: string;
  quantidade: number;
  unidade: string;
  valorUnitario: number;
}

@Component({
  selector: 'app-entrada-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrada-produtos.html',
  styleUrl: './entrada-produtos.css'
})
export class EntradaProdutosComponent {
  produtos: Produto[] = [
    { id: 1, nome: 'Hidratante Facial', quantidade: 10 },
    { id: 2, nome: 'Sabonete Líquido', quantidade: 5 },
    { id: 3, nome: 'Protetor Solar', quantidade: 0 }
  ];

  entradas: Entrada[] = [];

  entrada = {
    idProduto: 0,
    data: new Date().toISOString().substring(0, 10),
    quantidade: 1,
    unidade: 'Unidade',
    valorUnitario: 0
  };

  mensagem = '';

  get produtoSelecionado(): Produto | undefined {
    return this.produtos.find(p => p.id === Number(this.entrada.idProduto));
  }

  registrarEntrada(): void {
    const produto = this.produtoSelecionado;

    if (!produto) {
      this.mensagem = 'Selecione um produto.';
      return;
    }

    if (
      !this.entrada.data ||
      this.entrada.quantidade <= 0 ||
      this.entrada.valorUnitario <= 0
    ) {
      this.mensagem = 'Preencha corretamente todos os campos.';
      return;
    }

    produto.quantidade += Number(this.entrada.quantidade);

    this.entradas.unshift({
      id: this.entradas.length + 1,
      produto: produto.nome,
      data: this.entrada.data,
      quantidade: Number(this.entrada.quantidade),
      unidade: this.entrada.unidade,
      valorUnitario: Number(this.entrada.valorUnitario)
    });

    this.mensagem = 'Entrada registrada com sucesso!';

    this.entrada = {
      idProduto: 0,
      data: new Date().toISOString().substring(0, 10),
      quantidade: 1,
      unidade: 'Unidade',
      valorUnitario: 0
    };
  }
}
