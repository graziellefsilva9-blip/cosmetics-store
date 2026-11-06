import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PessoaService } from '../../core/services/pessoa.service';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.css'
})
export class CadastroCliente {

  private pessoaService = inject(PessoaService);

  pessoa: Pessoa = {
    nome: '',
    cpf: 0,
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: 0,
    ativoPessoa: 'S',
    enderecos: [
      {
        cep: '',
        numero: '',
        complemento: ''
      }
    ]
  };

  mensagem = '';
  erro = '';

  salvar(): void {

    this.mensagem = '';
    this.erro = '';
  
    this.pessoaService.cadastrar(this.pessoa).subscribe({
  
      next: (resposta) => {
        this.mensagem = 'Cliente cadastrado com sucesso!';
  
        console.log('Cliente cadastrado:', resposta);
  
        this.limpar();
      },
  
      error: (erro) => {
        console.error('Erro ao cadastrar cliente:', erro);
  
        this.erro = 'Não foi possível cadastrar o cliente. Verifique os dados e tente novamente.';
      }
  
    });
  
  }
  limpar(): void {

    this.pessoa = {
      nome: '',
      cpf: 0,
      dataNascimento: '',
      sexo: '',
      email: '',
      telefone: 0,
      ativoPessoa: 'S',
      enderecos: [
        {
          cep: '',
          numero: '',
          complemento: ''
        }
      ]
    };
  
  }
}
