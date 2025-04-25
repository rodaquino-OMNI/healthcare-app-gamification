/**
 * AUSTA SuperApp - Brazilian Portuguese (pt-BR) Translations
 * 
 * This file contains all text strings for the AUSTA SuperApp in Brazilian Portuguese.
 * It serves as the primary language implementation for Brazilian users and supports
 * accessibility requirements by providing proper text alternatives.
 */

const translations = {
  // Common translations used across the app
  common: {
    buttons: {
      save: 'Salvar',
      cancel: 'Cancelar',
      next: 'Próximo',
      back: 'Voltar',
      ok: 'OK',
      confirm: 'Confirmar',
      edit: 'Editar',
      delete: 'Excluir',
      add: 'Adicionar',
      view_all: 'Ver todos'
    },
    validation: {
      required: 'Este campo é obrigatório',
      email: 'Email inválido',
      minLength: 'Mínimo de {{count}} caracteres',
      maxLength: 'Máximo de {{count}} caracteres',
      number: 'Deve ser um número válido',
      positive: 'Deve ser um número positivo',
      date: 'Data inválida',
      cpf: 'CPF inválido',
      phone: 'Número de telefone inválido'
    },
    errors: {
      default: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      network: 'Sem conexão com a internet.',
      timeout: 'Tempo limite da solicitação excedido.',
      unauthorized: 'Você não está autorizado a acessar este recurso.',
      notFound: 'Recurso não encontrado.',
      server: 'Erro no servidor. Por favor, tente novamente mais tarde.'
    },
    success: {
      saved: 'Salvo com sucesso!',
      deleted: 'Excluído com sucesso!',
      added: 'Adicionado com sucesso!'
    },
    labels: {
      name: 'Nome',
      email: 'Email',
      phone: 'Telefone',
      date: 'Data',
      time: 'Hora',
      amount: 'Valor',
      description: 'Descrição',
      notes: 'Observações',
      search: 'Buscar',
      select: 'Selecionar',
      optional: '(Opcional)'
    },
    placeholders: {
      search: 'Digite para buscar...',
      select: 'Selecione uma opção'
    },
    tooltips: {
      required: 'Este campo é obrigatório'
    }
  },

  // Journey-specific translations
  journeys: {
    // My Health Journey
    health: {
      title: 'Minha Saúde',
      metrics: {
        heartRate: 'Frequência Cardíaca',
        bloodPressure: 'Pressão Arterial',
        bloodGlucose: 'Glicemia',
        steps: 'Passos',
        sleep: 'Sono',
        weight: 'Peso',
        temperature: 'Temperatura',
        oxygenSaturation: 'Saturação de Oxigênio'
      },
      goals: {
        daily: 'Meta Diária',
        weekly: 'Meta Semanal',
        monthly: 'Meta Mensal',
        progress: 'Progresso: {{value}}%',
        setGoal: 'Definir Meta',
        steps: 'Passos Diários',
        sleep: 'Horas de Sono',
        water: 'Consumo de Água (litros)',
        calories: 'Calorias Queimadas'
      },
      history: {
        title: 'Histórico Médico',
        empty: 'Nenhum evento médico registrado.',
        filters: {
          all: 'Todos',
          appointments: 'Consultas',
          medications: 'Medicamentos',
          labTests: 'Exames',
          procedures: 'Procedimentos'
        }
      },
      devices: {
        title: 'Dispositivos Conectados',
        connectNew: 'Conectar Novo Dispositivo',
        lastSync: 'Última sincronização: {{time}}'
      },
      insights: {
        title: 'Insights de Saúde',
        empty: 'Nenhum insight disponível no momento.'
      }
    },

    // Care Now Journey
    care: {
      title: 'Cuidar-me Agora',
      appointments: {
        book: 'Agendar Consulta',
        upcoming: 'Próximas Consultas',
        past: 'Consultas Anteriores',
        details: 'Detalhes da Consulta',
        empty: 'Nenhuma consulta agendada.',
        confirm: 'Confirmar Consulta',
        cancel: 'Cancelar Consulta',
        reschedule: 'Reagendar Consulta',
        reason: 'Motivo da Consulta',
        type: 'Tipo de Consulta',
        location: 'Local',
        provider: 'Profissional',
        date: 'Data',
        time: 'Hora',
        notes: 'Observações',
        telemedicine: 'Telemedicina',
        inPerson: 'Presencial',
        any: 'Qualquer',
        noProviders: 'Nenhum profissional disponível para os critérios selecionados.'
      },
      telemedicine: {
        start: 'Iniciar Telemedicina',
        connecting: 'Conectando...',
        connected: 'Conectado com Dr. {{name}}',
        end: 'Encerrar Telemedicina',
        waiting: 'Aguardando o profissional...',
        error: 'Erro ao conectar. Por favor, tente novamente.',
        noProviders: 'Nenhum profissional disponível para telemedicina.'
      },
      medications: {
        title: 'Medicamentos',
        add: 'Adicionar Medicamento',
        name: 'Nome do Medicamento',
        dosage: 'Dosagem',
        frequency: 'Frequência',
        startDate: 'Data de Início',
        endDate: 'Data de Término',
        instructions: 'Instruções',
        empty: 'Nenhum medicamento registrado.',
        trackDose: 'Registrar Dose Tomada',
        refill: 'Solicitar Reabastecimento',
        reminder: 'Lembrete de Medicamento'
      },
      symptomChecker: {
        title: 'Verificador de Sintomas',
        start: 'Iniciar Verificação',
        selectSymptoms: 'Selecione seus sintomas',
        noSymptoms: 'Nenhum sintoma selecionado.',
        results: 'Resultados',
        recommendations: 'Recomendações',
        selfCare: 'Autocuidado',
        bookAppointment: 'Agendar Consulta',
        emergency: 'Buscar Ajuda de Emergência'
      },
      treatmentPlans: {
        title: 'Planos de Tratamento',
        empty: 'Nenhum plano de tratamento ativo.',
        tasks: 'Tarefas',
        progress: 'Progresso',
        startDate: 'Data de Início',
        endDate: 'Data de Término',
        description: 'Descrição do Plano'
      }
    },

    // My Plan & Benefits Journey
    plan: {
      title: 'Meu Plano & Benefícios',
      coverage: {
        title: 'Cobertura',
        details: 'Detalhes da Cobertura',
        limits: 'Limites e Franquias',
        network: 'Rede Credenciada',
        empty: 'Nenhuma informação de cobertura disponível.'
      },
      digitalCard: {
        title: 'Carteirinha Digital',
        share: 'Compartilhar Carteirinha',
        download: 'Baixar Carteirinha'
      },
      claims: {
        title: 'Reembolsos',
        submit: 'Solicitar Reembolso',
        history: 'Histórico de Reembolsos',
        empty: 'Nenhuma solicitação de reembolso encontrada.',
        status: {
          pending: 'Pendente',
          approved: 'Aprovado',
          denied: 'Negado',
          moreInfo: 'Informações Adicionais Necessárias',
          processing: 'Em Processamento',
          submitted: 'Enviado'
        },
        details: 'Detalhes do Reembolso',
        uploadDocument: 'Enviar Documento',
        claimType: 'Tipo de Reembolso',
        dateOfService: 'Data do Atendimento',
        providerName: 'Nome do Profissional',
        amountPaid: 'Valor Pago',
        description: 'Descrição do Serviço',
        trackingNumber: 'Número de Acompanhamento',
        estimatedDate: 'Data Estimada',
        paymentDetails: 'Detalhes do Pagamento',
        appeal: 'Recurso'
      },
      costSimulator: {
        title: 'Simulador de Custos',
        procedure: 'Procedimento',
        estimate: 'Custo Estimado',
        noResults: 'Nenhum procedimento encontrado.'
      },
      benefits: {
        title: 'Benefícios',
        empty: 'Nenhum benefício disponível.',
        usage: 'Utilização',
        limit: 'Limite',
        description: 'Descrição do Benefício'
      }
    }
  },

  // Gamification translations
  gamification: {
    level: 'Nível {{level}}',
    xp: '{{value}} XP',
    achievements: {
      unlocked: 'Conquista Desbloqueada!',
      progress: 'Progresso: {{value}}/{{total}}',
      reward: 'Recompensa: {{reward}}',
      empty: 'Nenhuma conquista desbloqueada.'
    },
    quests: {
      active: 'Missões Ativas',
      completed: 'Missões Concluídas',
      new: 'Nova Missão Disponível!',
      empty: 'Nenhuma missão ativa.'
    },
    rewards: {
      empty: 'Nenhuma recompensa disponível.'
    },
    leaderboard: {
      title: 'Classificação',
      rank: 'Posição',
      user: 'Usuário',
      score: 'Pontuação'
    }
  },

  // Authentication translations
  auth: {
    login: {
      title: 'Entrar',
      email: 'Email',
      password: 'Senha',
      forgotPassword: 'Esqueceu sua senha?',
      register: 'Criar conta'
    },
    register: {
      title: 'Criar Conta',
      name: 'Nome Completo',
      email: 'Email',
      cpf: 'CPF',
      phone: 'Telefone',
      password: 'Senha',
      confirmPassword: 'Confirmar Senha',
      terms: 'Eu concordo com os Termos de Serviço e Política de Privacidade.',
      login: 'Já tem uma conta?'
    },
    forgotPassword: {
      title: 'Recuperar Senha',
      email: 'Email',
      sendCode: 'Enviar Código de Verificação'
    },
    mfa: {
      title: 'Verificação de Segurança',
      code: 'Código de Verificação',
      resendCode: 'Reenviar Código'
    }
  },

  // Profile and settings translations
  profile: {
    title: 'Perfil',
    edit: 'Editar Perfil',
    settings: 'Configurações',
    notifications: 'Notificações',
    security: 'Segurança',
    help: 'Ajuda',
    logout: 'Sair'
  },

  settings: {
    title: 'Configurações',
    language: 'Idioma',
    notifications: 'Notificações',
    privacy: 'Privacidade',
    about: 'Sobre'
  },

  notifications: {
    title: 'Notificações',
    empty: 'Nenhuma notificação.',
    markAllRead: 'Marcar Todas como Lidas'
  }
};

export default translations;