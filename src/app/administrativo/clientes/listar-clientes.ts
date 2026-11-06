
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PessoaService } from '../../core/services/pessoa.service';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-listar-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-clientes.html',
  styleUrl: './listar-clientes.css'
})
export class ListarClientes implements OnInit {

  private pessoaService = inject(PessoaService);

  clientes: Pessoa[] = [];
  mensagem = '';
  erro = '';
  carregando = false;

  ngOnInit(): void {
    this.listarClientes();
  }

  listarClientes(): void {
    this.carregando = true;
    this.erro = '';
    this.mensagem = '';

    this.pessoaService.listar().subscribe({

      next: (resposta) => {
        console.log('RESPOSTA DA API:', resposta);

        if (Array.isArray(resposta)) {
          this.clientes = resposta;
          console.log('QUANTIDADE DE CLIENTES:', resposta.length);

          if (resposta.length === 0) {
            this.mensagem = 'Nenhum cliente cadastrado.';
          }
        } else {
          this.clientes = [];
          this.erro = 'A API retornou um formato de dados inesperado.';
          console.error('Formato inesperado:', resposta);
        }

        this.carregando = false;
      },

      error: (erro) => {
        console.error('ERRO AO LISTAR CLIENTES:', erro);
        console.error('DETALHES DA RESPOSTA:', erro.error);

        this.erro = 'Não foi possível carregar os clientes. Verifique a conexão com a API.';
        this.carregando = false;
      }

    });
  }
}
