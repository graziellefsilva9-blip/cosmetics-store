
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  private readonly pessoaService = inject(PessoaService);
  private readonly router = inject(Router);

  private readonly chaveCliente = 'cliente-estetica-id';

  pessoa: Pessoa = this.novaPessoa();

  mensagem = '';
  erro = '';
  carregando = false;

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

  voltarAoCatalogo(): void {
    this.router.navigateByUrl('/catalogo');
  }

  salvar(): void {
    this.mensagem = '';
    this.erro = '';

    if (!this.pessoa.nome.trim()) {
      this.erro = 'Informe o nome completo.';
      return;
    }

    if (!this.pessoa.cpf || this.pessoa.cpf.toString().length !== 11) {
      this.erro = 'Informe um CPF com 11 dígitos.';
      return;
    }

    if (!this.pessoa.dataNascimento) {
      this.erro = 'Informe a data de nascimento.';
      return;
    }

    if (!this.pessoa.sexo) {
      this.erro = 'Selecione o sexo.';
      return;
    }

    if (!this.pessoa.email.trim()) {
      this.erro = 'Informe o e-mail.';
      return;
    }

    if (!this.pessoa.telefone) {
      this.erro = 'Informe o telefone.';
      return;
    }

    if (
      !this.pessoa.enderecos?.length ||
      !this.pessoa.enderecos[0].cep.trim() ||
      !this.pessoa.enderecos[0].numero.trim()
    ) {
      this.erro = 'Preencha o CEP e o número do endereço.';
      return;
    }

    if (!/^\d{8}$/.test(this.pessoa.enderecos[0].cep)) {
      this.erro = 'O CEP deve conter 8 dígitos.';
      return;
    }

    this.carregando = true;

    this.pessoaService.cadastrar(this.pessoa).subscribe({

      next: (resposta) => {

        console.log('Cliente cadastrado:', resposta);

        const idPessoa = Number(resposta.idPessoa);

        if (!idPessoa || !Number.isInteger(idPessoa)) {
          this.erro =
            'Cadastro realizado, mas a API não retornou o ID do cliente. Verifique a resposta do backend.';

          this.carregando = false;
          return;
        }

        // Guardar o ID do cliente durante a sessão
        sessionStorage.setItem(
          this.chaveCliente,
          idPessoa.toString()
        );

        this.mensagem = 'Cliente cadastrado com sucesso!';

        this.carregando = false;

        // Direcionar para o catálogo
        this.router.navigateByUrl('/catalogo');
      },

      error: (erro) => {

        console.error('Erro ao cadastrar cliente:', erro);

        if (erro.status === 0) {
          this.erro =
            'Não foi possível conectar à API. Verifique se o backend está em execução.';

        } else if (erro.status === 400) {
          this.erro =
            'Dados inválidos. Confira os campos preenchidos.';

        } else if (erro.status === 409) {
          this.erro =
            'CPF ou e-mail já cadastrado.';

        } else {
          this.erro =
            erro?.error?.message ||
            erro?.error?.title ||
            'Ocorreu um erro ao cadastrar o cliente.';
        }

        this.carregando = false;
      }

    });
  }

  limpar(): void {
    this.pessoa = this.novaPessoa();
    this.mensagem = '';
    this.erro = '';
  }
}
