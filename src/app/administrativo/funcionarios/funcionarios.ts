
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  ativo: boolean;
}

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css'
})
export class FuncionarioComponent {
  funcionarios: Funcionario[] = [
    {
      id: 1,
      nome: 'Ana Paula',
      cpf: '123.456.789-00',
      email: 'ana@email.com',
      telefone: '(79) 99999-1111',
      cargo: 'Esteticista',
      ativo: true
    },
    {
      id: 2,
      nome: 'Maria Oliveira',
      cpf: '987.654.321-00',
      email: 'maria@email.com',
      telefone: '(79) 98888-2222',
      cargo: 'Atendente',
      ativo: true
    }
  ];

  funcionario: Funcionario = this.novoFuncionario();
  termoBusca = '';
  editando = false;
  mensagem = '';
  proximoId = 3;

  novoFuncionario(): Funcionario {
    return {
      id: 0,
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
      cargo: '',
      ativo: true
    };
  }

  get funcionariosFiltrados(): Funcionario[] {
    const termo = this.termoBusca.toLowerCase();

    return this.funcionarios.filter(f =>
      f.nome.toLowerCase().includes(termo) ||
      f.cpf.includes(termo) ||
      f.cargo.toLowerCase().includes(termo)
    );
  }

  salvar(): void {
    if (
      !this.funcionario.nome.trim() ||
      !this.funcionario.cpf.trim() ||
      !this.funcionario.email.trim() ||
      !this.funcionario.cargo.trim()
    ) {
      this.mensagem = 'Preencha os campos obrigatórios.';
      return;
    }

    if (this.editando) {
      this.funcionarios = this.funcionarios.map(f =>
        f.id === this.funcionario.id ? { ...this.funcionario } : f
      );
      this.mensagem = 'Funcionário atualizado com sucesso!';
    } else {
      this.funcionarios.push({
        ...this.funcionario,
        id: this.proximoId++
      });
      this.mensagem = 'Funcionário cadastrado com sucesso!';
    }

    this.limpar();
  }

  editar(f: Funcionario): void {
    this.funcionario = { ...f };
    this.editando = true;
    this.mensagem = '';
  }

  alterarStatus(f: Funcionario): void {
    f.ativo = !f.ativo;
  }

  limpar(): void {
    this.funcionario = this.novoFuncionario();
    this.editando = false;
  }
}
