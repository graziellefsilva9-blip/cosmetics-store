
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

    this.pessoaService.listar().subscribe({
      next: (resposta) => {
        this.clientes = resposta;
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao listar clientes:', erro);
        this.erro = 'Não foi possível carregar os clientes.';
        this.carregando = false;
      }
    });
  }
}
