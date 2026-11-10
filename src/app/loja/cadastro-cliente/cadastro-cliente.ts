
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { PessoaService } from '../../core/services/pessoa.service';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './cadastro-cliente.html',
  styleUrl: './cadastro-cliente.css'
})
export class CadastroCliente {

  private readonly pessoaService = inject(PessoaService);
  private readonly router = inject(Router);

  // DADOS DO CLIENTE
  pessoa: Pessoa = this.novaPessoa();

  // MENSAGENS
  mensagem = '';
  erro = '';
  carregando = false;

  // CRIAR OBJETO VAZIO
  private novaPessoa(): Pessoa {
    return {
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

  // VOLTAR AO CATÁLOGO
  voltarAoCatalogo(): void {
    this.router.navigateByUrl('/catalogo');
  }

  // SALVAR CLIENTE
  salvar(): void {

    this.mensagem = '';
    this.erro = '';

    if (!this.pessoa.nome.trim()) {
      this.erro = 'Informe o nome completo.';
      return;
    }

    if (!this.pessoa.email.trim()) {
      this.erro = 'Informe o e-mail.';
      return;
    }

    if (!this.pessoa.sexo) {
      this.erro = 'Selecione o sexo.';
      return;
    }

    if (!this.pessoa.enderecos?.length ||
        !this.pessoa.enderecos[0].cep ||
        !this.pessoa.enderecos[0].numero) {
      this.erro = 'Preencha o CEP e o número do endereço.';
      return;
    }

    this.carregando = true;

    this.pessoaService.cadastrar(this.pessoa).subscribe({

      next: (resposta) => {
        this.mensagem = 'Cliente cadastrado com sucesso!';

        console.log('Cliente cadastrado:', resposta);

        this.pessoa = this.novaPessoa();
        this.carregando = false;
      },

      error: (erro) => {
        console.error('Erro ao cadastrar cliente:', erro);

        this.erro =
          erro?.error?.message ||
          'Não foi possível cadastrar o cliente. Verifique os dados e tente novamente.';

        this.carregando = false;
      }

    });
  }

  // LIMPAR FORMULÁRIO
  limpar(): void {
    this.pessoa = this.novaPessoa();
    this.mensagem = '';
    this.erro = '';
  }

}
