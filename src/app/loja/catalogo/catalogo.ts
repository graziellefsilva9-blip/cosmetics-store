
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarrinhoService } from '../../core/services/carrinho.service';
import { ProdutoCompartilhadoService } from '../../core/services/produto-compartilhado.service';

interface Item {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  tipo: 'PRODUTO' | 'SERVIÇO';
  categoria: string;
  icone: string;
  disponibilidade: string;
}

interface Banner {
  imagem: string;
  titulo: string;
  descricao: string;
  etiqueta: string;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo {

  private readonly carrinhoService = inject(CarrinhoService);
  private readonly produtoService = inject(ProdutoCompartilhadoService);

  // Banners do catálogo
  readonly banners: Banner[] = [
    {
      imagem: 'https://placehold.co/1200x500/f7e8ee/8a405b?text=Estetica+e+Bem-Estar',
      titulo: 'Seu momento de bem-estar começa aqui',
      descricao: 'Encontre produtos e serviços para cuidar de você.',
      etiqueta: 'Cuidado e beleza'
    },
    {
      imagem: 'https://placehold.co/1200x500/f5e6df/8a405b?text=Cuide+de+Voce',
      titulo: 'Cuide de você todos os dias',
      descricao: 'Descubra nossa seleção de produtos especiais.',
      etiqueta: 'Autocuidado'
    },
    {
      imagem: 'https://placehold.co/1200x500/eee8f5/705080?text=Beleza+e+Bem-Estar',
      titulo: 'Beleza, saúde e bem-estar',
      descricao: 'Conheça nossos produtos e serviços.',
      etiqueta: 'Conheça nossa loja'
    }
  ];

  indiceBanner = signal(0);

  bannerAtual = computed(() =>
    this.banners[this.indiceBanner()]
  );

  // Navegação do carrossel
  bannerAnterior(): void {
    this.indiceBanner.update(indice =>
      indice === 0 ? this.banners.length - 1 : indice - 1
    );
  }

  proximoBanner(): void {
    this.indiceBanner.update(indice =>
      (indice + 1) % this.banners.length
    );
  }

  selecionarBanner(indice: number): void {
    this.indiceBanner.set(indice);
  }

  // Serviços temporários
  readonly servicos: Item[] = [
    {
      id: 6,
      nome: 'Limpeza de Pele',
      descricao: 'Serviço estético de limpeza facial.',
      preco: 120,
      tipo: 'SERVIÇO',
      categoria: 'Serviços Estéticos',
      icone: '✨',
      disponibilidade: 'Consulte horários'
    },
    {
      id: 7,
      nome: 'Hidratação Facial',
      descricao: 'Serviço estético de hidratação facial.',
      preco: 100,
      tipo: 'SERVIÇO',
      categoria: 'Serviços Estéticos',
      icone: '🪷',
      disponibilidade: 'Consulte horários'
    }
  ];

  // Filtros
  pesquisa = signal('');
  categoriaSelecionada = signal('Todas');
  tipoSelecionado = signal('Todos');

  // Mensagem de retorno
  mensagem = signal('');

  // Categorias disponíveis
  categorias: string[] = [
    'Todas',
    'Cuidados com a Pele',
    'Higiene Pessoal',
    'Cosméticos',
    'Serviços Estéticos',
    'Bem-Estar'
  ];

  // Tipos de itens
  tipos: string[] = [
    'Todos',
    'PRODUTO',
    'SERVIÇO'
  ];

  // Produtos compartilhados + serviços
  itensFiltrados = computed(() => {
    const nome = this.pesquisa().toLowerCase().trim();
    const categoria = this.categoriaSelecionada();
    const tipo = this.tipoSelecionado();

    const produtos: Item[] = this.produtoService.produtos()
      .filter(produto => produto.ativo)
      .map(produto => ({
        id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.precoVenda,
        tipo: 'PRODUTO',
        categoria: produto.categoria,
        icone: produto.icone,
        disponibilidade: 'Disponível'
      }));

    const todosItens = [...produtos, ...this.servicos];

    return todosItens.filter(item => {
      const correspondeNome =
        item.nome.toLowerCase().includes(nome);

      const correspondeCategoria =
        categoria === 'Todas' || item.categoria === categoria;

      const correspondeTipo =
        tipo === 'Todos' || item.tipo === tipo;

      return (
        correspondeNome &&
        correspondeCategoria &&
        correspondeTipo
      );
    });
  });

  // Atualizar campo de pesquisa
  atualizarPesquisa(event: Event): void {
    const campo = event.target as HTMLInputElement;
    this.pesquisa.set(campo.value);
  }

  // Formatar preço em reais
  formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  // Adicionar item ao carrinho
  adicionarAoCarrinho(item: Item): void {
    this.carrinhoService.adicionar({
      id: item.id,
      nome: item.nome,
      preco: item.preco,
      tipo: item.tipo,
      icone: item.icone
    });

    this.mensagem.set(
      `${item.nome} foi adicionado ao carrinho!`
    );
  }
}
