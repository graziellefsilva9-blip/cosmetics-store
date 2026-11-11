
import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = signal('');
  senha = signal('');
  mensagem = signal('');
  tipoMensagem = signal<'erro' | 'sucesso'>('erro');

  constructor(private router: Router) {}

  entrar(): void {

    const email = this.email().trim();
    const senha = this.senha().trim();

    if (!email || !senha) {
      this.mostrarMensagem('Preencha o e-mail e a senha.', 'erro');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.mostrarMensagem('Informe um e-mail válido.', 'erro');
      return;
    }

    // ACESSO TEMPORÁRIO PARA TESTES
    this.mostrarMensagem('Acesso administrativo liberado!', 'sucesso');

    this.router.navigateByUrl('/administrativo/dashboard');
  }

  private mostrarMensagem(
    texto: string,
    tipo: 'erro' | 'sucesso'
  ): void {
    this.mensagem.set(texto);
    this.tipoMensagem.set(tipo);
  }
}
