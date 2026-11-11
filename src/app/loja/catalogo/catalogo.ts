
import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { CarrinhoService } from '../../core/services/carrinho.service';
import { ItemService } from '../../core/services/item.service';
import { CategoriaService } from '../../core/services/categoria.service';

import { Item as ItemApi } from '../../models/item.model';
import { Categoria } from '../../models/categoria.model';

interface ItemCatalogo {
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
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {

  private readonly carrinhoService = inject(CarrinhoService);
  private readonly itemService = inject(ItemService);
  private readonly categoriaService = inject(CategoriaService);

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

  // Itens carregados da API
  itens = signal<ItemCatalogo[]>([]);

  // Categorias carregadas da API
  categoriasApi = signal<Categoria[]>([]);

  categorias: string[] = ['Todas'];

  tipos: string[] = [
    'Todos',
    'PRODUTO',
    'SERVIÇO'
  ];

  // Estados da tela
  carregando = signal(false);
  erro = signal('');
  mensagem = signal('');

  // Filtros
  pesquisa = signal('');
  categoriaSelecionada = signal('Todas');
  tipoSelecionado = signal('Todos');

  // Consulta por ID
  idConsulta = signal('');
  itemConsultado = signal<ItemCatalogo | null>(null);
  erroConsulta = signal('');
  consultando = signal(false);

  // Navegação do carrossel
  bannerAnterior(): void {
    this.indiceBanner.update(indice =>
      indice === 0
        ? this.banners.length - 1
        : indice - 1
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

  // Inicialização
  ngOnInit(): void {
    this.carregarCatalogo();
  }

  // Carregar produtos, serviços e categorias da API
  carregarCatalogo(): void {
    this.carregando.set(true);
    this.erro.set('');
    this.mensagem.set('');

    forkJoin({
      itens: this.itemService.listar(),
      categorias: this.categoriaService.listar()
    }).subscribe({

      next: (resposta) => {

        // Guardar categorias recebidas
        this.categoriasApi.set(resposta.categorias);

        // Montar lista de categorias para o filtro
        this.categorias = [
          'Todas',
          ...resposta.categorias.map(
            categoria => categoria.categoria
          )
        ];

        // Converter itens da API para o formato do catálogo
        const itensConvertidos: ItemCatalogo[] =
          resposta.itens
            .filter((item: ItemApi) =>
              item.ativoProdutoServico === 'S'
            )
            .map((item: ItemApi) => {

              const tipo: 'PRODUTO' | 'SERVIÇO' =
                item.tipoItem === 'P'
                  ? 'PRODUTO'
                  : 'SERVIÇO';

              const categoria = resposta.categorias.find(
                c => c.idcategoria === item.idcategoria
              );

              return {
                id: item.iditem ?? 0,
                nome: item.item1,
                descricao: item.descricaoItem,
                preco: Number(item.preco),
                tipo,
                categoria:
                  categoria?.categoria ??
                  'Categoria não encontrada',
                icone: this.obterIcone(item.item1, tipo),
                disponibilidade:
                  tipo === 'PRODUTO'
                    ? 'Disponível'
                    : 'Consulte horários'
              };
            });

        this.itens.set(itensConvertidos);
        this.carregando.set(false);

        if (itensConvertidos.length === 0) {
          this.mensagem.set(
            'Nenhum produto ou serviço disponível.'
          );
        }
      },

      error: (erro) => {
        console.error('Erro ao carregar catálogo:', erro);

        this.erro.set(
          'Não foi possível carregar os produtos e serviços. Verifique a conexão com a API.'
        );

        this.carregando.set(false);
      }

    });
  }

  // Escolher ícone de acordo com o item
  private obterIcone(
    nome: string,
    tipo: 'PRODUTO' | 'SERVIÇO'
  ): string {

    if (tipo === 'SERVIÇO') {
      return nome.toLowerCase().includes('limpeza')
        ? '✨'
        : '🪷';
    }

    const nomeItem = nome.toLowerCase();

    if (nomeItem.includes('hidratante')) return '🌸';
    if (nomeItem.includes('protetor')) return '☀️';
    if (nomeItem.includes('serum')) return '💧';
    if (nomeItem.includes('sabonete')) return '🧼';
    if (nomeItem.includes('oleo')) return '🌿';
    if (nomeItem.includes('máscara') ||
        nomeItem.includes('mascara')) return '🌼';

    return '🛍️';
  }

  // Filtrar itens por nome, categoria e tipo
  itensFiltrados = computed(() => {

    const nome = this.pesquisa().toLowerCase().trim();
    const categoria = this.categoriaSelecionada();
    const tipo = this.tipoSelecionado();

    return this.itens().filter(item => {

      const correspondeNome =
        item.nome.toLowerCase().includes(nome);

      const correspondeCategoria =
        categoria === 'Todas' ||
        item.categoria === categoria;

      const correspondeTipo =
        tipo === 'Todos' ||
        item.tipo === tipo;

      return (
        correspondeNome &&
        correspondeCategoria &&
        correspondeTipo
      );
    });
  });

  // Atualizar pesquisa
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

  // Atualizar campo de consulta por ID
  atualizarIdConsulta(event: Event): void {
    const campo = event.target as HTMLInputElement;
    this.idConsulta.set(campo.value);
  }

  // Consultar produto ou serviço pelo ID
  consultarPorId(): void {

    const valor = this.idConsulta().trim();
    const id = Number(valor);

    this.erroConsulta.set('');
    this.itemConsultado.set(null);

    if (
      !valor ||
      !Number.isInteger(id) ||
      id <= 0
    ) {
      this.erroConsulta.set('Informe um ID válido.');
      return;
    }

    this.consultando.set(true);

    this.itemService.buscarPorId(id).subscribe({

      next: (item: ItemApi) => {

        this.consultando.set(false);

        if (
          !item ||
          item.ativoProdutoServico !== 'S'
        ) {
          this.erroConsulta.set(
            'Produto ou serviço não encontrado ou indisponível.'
          );
          return;
        }

        const tipo: 'PRODUTO' | 'SERVIÇO' =
          item.tipoItem === 'P'
            ? 'PRODUTO'
            : 'SERVIÇO';

        const categoria = this.categoriasApi().find(
          c => c.idcategoria === item.idcategoria
        );

        const resultado: ItemCatalogo = {
          id: item.iditem ?? 0,
          nome: item.item1,
          descricao: item.descricaoItem,
          preco: Number(item.preco),
          tipo,
          categoria:
            categoria?.categoria ??
            'Categoria não encontrada',
          icone: this.obterIcone(item.item1, tipo),
          disponibilidade:
            tipo === 'PRODUTO'
              ? 'Disponível'
              : 'Consulte horários'
        };

        this.itemConsultado.set(resultado);
      },

      error: (erro) => {

        console.error('Erro ao consultar item:', erro);

        this.consultando.set(false);

        if (erro.status === 404) {
          this.erroConsulta.set(
            'Nenhum produto ou serviço encontrado com esse ID.'
          );
        } else {
          this.erroConsulta.set(
            'Não foi possível consultar o item. Verifique a conexão com a API.'
          );
        }
      }

    });
  }

  // Adicionar item ao carrinho
  adicionarAoCarrinho(item: ItemCatalogo): void {

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
