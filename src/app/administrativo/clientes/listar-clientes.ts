
import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PessoaService } from '../../core/services/pessoa.service';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-listar-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-clientes.html',
  styleUrl: './listar-clientes.css'
})
export class ListarClientes implements OnInit {

  private pessoaService = inject(PessoaService);
  private cdr = inject(ChangeDetectorRef);

  clientes: Pessoa[] = [];

  mensagem = '';
  erro = '';
  carregando = false;

  clienteEditando: Pessoa | null = null;

  ngOnInit(): void {
    this.listarClientes();
  }

  // LISTAR TODOS OS CLIENTES
  listarClientes(): void {

    this.carregando = true;
    this.erro = '';
    this.mensagem = '';

    this.pessoaService.listar().subscribe({

      next: (resposta) => {

        console.log('RESPOSTA DA API:', resposta);

        if (Array.isArray(resposta)) {

          this.clientes = resposta;

          console.log(
            'QUANTIDADE DE CLIENTES:',
            resposta.length
          );

          if (resposta.length === 0) {
            this.mensagem = 'Nenhum cliente cadastrado.';
          }

        } else {

          this.clientes = [];
          this.erro = 'A API retornou um formato inesperado.';

        }

        this.carregando = false;
        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('ERRO AO LISTAR CLIENTES:', erro);
        console.error('DETALHES:', erro.error);

        this.clientes = [];

        this.erro =
          'Não foi possível carregar os clientes. Verifique a conexão com a API.';

        this.carregando = false;
        this.cdr.detectChanges();

      }

    });

  }

  // CONSULTAR CLIENTE PELO ID PARA EDITAR
  editar(id: number): void {

    this.erro = '';
    this.mensagem = '';

    this.pessoaService.buscarPorId(id).subscribe({

      next: (resposta) => {

        if (resposta && resposta.length > 0) {

          this.clienteEditando = resposta[0];

          console.log(
            'CLIENTE PARA EDIÇÃO:',
            this.clienteEditando
          );

        } else {

          this.clienteEditando = null;
          this.erro = 'Cliente não encontrado.';

        }

        this.cdr.detectChanges();

      },

      error: (erro) => {

        console.error('ERRO AO CONSULTAR CLIENTE:', erro);

        this.erro = 'Não foi possível consultar o cliente.';
        this.cdr.detectChanges();

      }

    });

  }

  // SALVAR ALTERAÇÕES DO CLIENTE
  salvarEdicao(): void {

    if (!this.clienteEditando || !this.clienteEditando.idPessoa) {

      this.erro = 'Nenhum cliente selecionado para edição.';
      return;

    }

    const id = this.clienteEditando.idPessoa;

    this.erro = '';
    this.mensagem = '';

    this.pessoaService.atualizar(id, this.clienteEditando).subscribe({

      next: (resposta) => {

        console.log('CLIENTE ATUALIZADO:', resposta);

        this.mensagem = 'Cliente atualizado com sucesso!';
        this.erro = '';

        this.clienteEditando = null;

        this.listarClientes();

      },

      error: (erro) => {

        console.error('ERRO AO ATUALIZAR CLIENTE:', erro);
        console.error('DETALHES:', erro.error);

        this.erro = 'Não foi possível atualizar o cliente.';
        this.mensagem = '';

        this.cdr.detectChanges();

      }

    });

  }

  // EXCLUIR CLIENTE
  excluir(id: number): void {

    const confirmar = confirm(
      'Tem certeza que deseja excluir este cliente?'
    );

    if (!confirmar) {
      return;
    }

    this.pessoaService.excluir(id).subscribe({

      next: () => {

        this.mensagem = 'Cliente excluído com sucesso!';
        this.erro = '';

        this.clienteEditando = null;

        this.listarClientes();

      },

      error: (erro) => {

        console.error('ERRO AO EXCLUIR:', erro);
        console.error('DETALHES:', erro.error);

        this.erro =
          'Não foi possível excluir o cliente. Ele pode possuir atendimentos vinculados.';

        this.mensagem = '';

        this.cdr.detectChanges();

      }

    });

  }

  // CANCELAR EDIÇÃO
  cancelarEdicao(): void {

    this.clienteEditando = null;
    this.erro = '';
    this.mensagem = '';

  }

}
