
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

  // Endpoint previsto para integração futura:
  // POST https://localhost:7030/api/funcionarios/login
  private readonly apiUrl = 'https://localhost:7030/api/funcionarios/login';

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

    // Login demonstrativo. A autenticação real será feita pela API.
    this.mostrarMensagem(
      'A autenticação será habilitada na integração com a API.',
      'erro'
    );
  }

  private mostrarMensagem(
    texto: string,
    tipo: 'erro' | 'sucesso'
  ): void {
    this.mensagem.set(texto);
    this.tipoMensagem.set(tipo);
  }
}
