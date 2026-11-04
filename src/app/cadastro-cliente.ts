import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cadastro-cliente',
  standalone: true,
  imports: [FormsModule],
  templateUrl: `./cadastro-cliente.html`,
  styleUrl: './cadastro-cliente.css'
})
export class CadastroCliente {
  cliente = {
    nome: '',
    cpf: '',
    dataNascimento: '',
    sexo: '',
    email: '',
    telefone: '',
    endereco: {
      cep: '',
      numero: '',
      complemento: ''
    }
  };

  mensagem = '';
  enviando = false;

  constructor(private http: HttpClient) {}

  salvar(formulario: NgForm) {
    if (formulario.invalid || this.enviando) {
      this.mensagem = 'Confira os campos obrigatórios e os dados informados.';
      return;
    }

    const pessoa = {
      nome: this.cliente.nome.trim(),
      cpf: Number(this.cliente.cpf),
      dataNascimento: this.cliente.dataNascimento,
      sexo: this.cliente.sexo,
      email: this.cliente.email.trim(),
      telefone: Number(this.cliente.telefone),
      ativoPessoa: 'S',
      enderecos: [
        {
          cep: this.cliente.endereco.cep,
          numero: this.cliente.endereco.numero,
          complemento: this.cliente.endereco.complemento
        }
      ]
    };

    this.enviando = true;
    this.mensagem = '';

    this.http
      .post('http://localhost:53700/api/PessoaEndereco', pessoa)
      .subscribe({
        next: () => {
          this.mensagem = 'Cliente cadastrado com sucesso!';
          formulario.resetForm();
          this.enviando = false;
        },
        error: (erro) => {
          console.error(erro);
          this.mensagem =
            'Não foi possível cadastrar. Verifique a API e os dados.';
          this.enviando = false;
        }
      });
  }
}