
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Servico {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  ativo: boolean;
}

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class Servicos {

  servicos: Servico[] = [
    {
      id: 1,
      nome: 'Limpeza de Pele',
      descricao: 'Procedimento de limpeza profunda da pele.',
      categoria: 'Serviços Estéticos',
      preco: 120,
      ativo: true
    },
    {
      id: 2,
      nome: 'Hidratação Facial',
      descricao: 'Tratamento para hidratação e revitalização facial.',
      categoria: 'Serviços Estéticos',
      preco: 100,
      ativo: true
    }
  ];

  categorias = [
    'Serviços Estéticos',
    'Bem-Estar',
    'Cuidados com a Pele'
  ];

  servico: Servico = this.novoServico();
  pesquisa = '';
  editando = false;
  mensagem = '';
  erro = '';

  novoServico(): Servico {
    return {
      id: 0,
      nome: '',
      descricao: '',
      categoria: '',
      preco: 0,
      ativo: true
    };
  }

  get servicosFiltrados(): Servico[] {
    const termo = this.pesquisa.toLowerCase().trim();

    return this.servicos.filter(s =>
      s.nome.toLowerCase().includes(termo) ||
      s.categoria.toLowerCase().includes(termo)
    );
  }

  salvar(): void {
    this.mensagem = '';
    this.erro = '';

    if (
      !this.servico.nome.trim() ||
      !this.servico.descricao.trim() ||
      !this.servico.categoria ||
      this.servico.preco <= 0
    ) {
      this.erro = 'Preencha todos os campos corretamente.';
      return;
    }

    if (this.editando) {
      const indice = this.servicos.findIndex(
        s => s.id === this.servico.id
      );

      if (indice !== -1) {
        this.servicos[indice] = { ...this.servico };
      }

      this.mensagem = 'Serviço atualizado com sucesso!';
    } else {
      const novoId = Math.max(0, ...this.servicos.map(s => s.id)) + 1;

      this.servicos.push({
        ...this.servico,
        id: novoId
      });

      this.mensagem = 'Serviço cadastrado com sucesso!';
    }

    this.limpar();
  }

  editar(servico: Servico): void {
    this.servico = { ...servico };
    this.editando = true;
    this.mensagem = '';
    this.erro = '';
  }

  desativar(servico: Servico): void {
    servico.ativo = false;
    this.mensagem = 'Serviço desativado com sucesso.';
    this.erro = '';
  }

  ativar(servico: Servico): void {
    servico.ativo = true;
    this.mensagem = 'Serviço ativado com sucesso.';
  }

  limpar(): void {
    this.servico = this.novoServico();
    this.editando = false;
  }
}
