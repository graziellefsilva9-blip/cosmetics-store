
import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  tipo: string;
  categoria: string;
  icone: string;
  disponibilidade?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  // BANNERS DO CARROSSEL
  banners = [
    {
      imagem: '/imagens/banner1.jpg',
      etiqueta: 'BELEZA E AUTOCUIDADO',
      titulo: 'Realce sua beleza natural.',
      descricao: 'Descubra produtos especiais para cuidar de você.'
    },
    {
      imagem: '/imagens/banner2.jpg',
      etiqueta: 'SUA BELEZA EM PRIMEIRO LUGAR',
      titulo: 'Cuide de você com carinho.',
      descricao: 'Encontre produtos para sua rotina de beleza e bem-estar.'
    },
    {
      imagem: '/imagens/banner3.jpg',
      etiqueta: 'UM MOMENTO PARA VOCÊ',
      titulo: 'Sua beleza merece esse cuidado.',
      descricao: 'Conheça nossos produtos e serviços de estética.'
    }
  ];
  indiceBanner = signal(0);

  bannerAtual = computed(
    () => this.banners[this.indiceBanner()]
  );

  proximoBanner() {
    this.indiceBanner.update(
      indice => (indice + 1) % this.banners.length
    );
  }

  bannerAnterior() {
    this.indiceBanner.update(
      indice => (indice - 1 + this.banners.length) % this.banners.length
    );
  }

  selecionarBanner(indice: number) {
    this.indiceBanner.set(indice);
  }

  // CATEGORIAS
  categorias = [
    'Todos',
    'Cuidados com a Pele',
    'Higiene Pessoal',
    'Cosméticos',
    'Serviços Estéticos',
    'Bem-Estar'
  ];

  categoriaSelecionada = signal('Todos');

  selecionarCategoria(categoria: string) {
    this.categoriaSelecionada.set(categoria);
  }

  // PRODUTOS E SERVIÇOS
  produtos: Produto[] = [
    {
      id: 1,
      nome: 'Hidratante Facial',
      descricao: 'Creme hidratante para cuidados diários com a pele.',
      preco: 85,
      tipo: 'PRODUTO',
      categoria: 'Cuidados com a Pele',
      icone: '🌸'
    },
    {
      id: 2,
      nome: 'Protetor Solar FPS 50',
      descricao: 'Proteção solar facial para sua rotina diária.',
      preco: 60,
      tipo: 'PRODUTO',
      categoria: 'Higiene Pessoal',
      icone: '☀️'
    },
    {
      id: 3,
      nome: 'Sérum Facial',
      descricao: 'Sérum facial para complementar seus cuidados.',
      preco: 75,
      tipo: 'PRODUTO',
      categoria: 'Cosméticos',
      icone: '💧'
    },
    {
      id: 4,
      nome: 'Sabonete Facial',
      descricao: 'Sabonete líquido para limpeza facial.',
      preco: 35,
      tipo: 'PRODUTO',
      categoria: 'Cuidados com a Pele',
      icone: '🧼'
    },
    {
      id: 5,
      nome: 'Óleo Corporal',
      descricao: 'Óleo corporal para hidratação e cuidado com a pele.',
      preco: 55,
      tipo: 'PRODUTO',
      categoria: 'Bem-Estar',
      icone: '🌿'
    },
    {
      id: 6,
      nome: 'Limpeza de Pele',
      descricao: 'Serviço estético de limpeza facial.',
      preco: 120,
      tipo: 'SERVIÇO',
      categoria: 'Serviços Estéticos',
      icone: '✨'
    },
    {
      id: 7,
      nome: 'Hidratação Facial',
      descricao: 'Serviço estético de hidratação facial.',
      preco: 100,
      tipo: 'SERVIÇO',
      categoria: 'Serviços Estéticos',
      icone: '🪷'
    },
    {
      id: 8,
      nome: 'Máscara Facial',
      descricao: 'Máscara facial para cuidados cosméticos.',
      preco: 40,
      tipo: 'PRODUTO',
      categoria: 'Cosméticos',
      icone: '🌼',
      disponibilidade: 'Consulte a disponibilidade'
    }
  ];

  // PESQUISA E FILTRO
  termoPesquisa = signal('');

  produtosFiltrados = computed(() => {
    const categoria = this.categoriaSelecionada();
    const pesquisa = this.termoPesquisa().toLowerCase().trim();

    return this.produtos.filter(produto => {
      const correspondeCategoria =
        categoria === 'Todos' ||
        produto.categoria === categoria;

      const correspondePesquisa =
        produto.nome.toLowerCase().includes(pesquisa) ||
        produto.descricao.toLowerCase().includes(pesquisa);

      return correspondeCategoria && correspondePesquisa;
    });
  });

  atualizarPesquisa(event: Event) {
    const campo = event.target as HTMLInputElement;
    this.termoPesquisa.set(campo.value);
  }

  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}
