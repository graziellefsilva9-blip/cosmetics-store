

export interface Pessoa {
    idPessoa?: number;
    nome: string;
    cpf: number;
    dataNascimento: string;
    sexo: string;
    email: string;
    telefone: number;
    ativoPessoa: string;
    enderecos: Endereco[];
  }
  
  export interface Endereco {
    idEndereco?: number;
    idPessoa?: number;
    cep: string;
    numero: string;
    complemento: string;
  }
  