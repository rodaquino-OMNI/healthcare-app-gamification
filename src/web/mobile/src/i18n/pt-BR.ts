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
      },
      medication: {
        calendar: { title: 'Calendário de Medicamentos', weekView: 'Visão Semanal', monthView: 'Ver Mensal', today: 'Hoje', noSchedule: 'Nenhuma dose agendada para este dia' },
        empty: { title: 'Nenhum Medicamento', subtitle: 'Comece a acompanhar adicionando seu primeiro medicamento', addFirst: 'Adicionar Medicamento' },
        addConfirmation: { title: 'Medicamento Adicionado!', subtitle: 'Seu medicamento foi salvo com sucesso', setupReminders: 'Configurar Lembretes', backToList: 'Voltar para Medicamentos' },
        doseTaken: { title: 'Registrar Dose', timestamp: 'Horário', notes: 'Observações', notesPlaceholder: 'Alguma observação...', sideEffects: 'Efeitos colaterais?', confirm: 'Confirmar Dose Tomada' },
        doseMissed: { title: 'Dose Perdida', reason: 'Motivo', forgot: 'Esqueci', sideEffectsReason: 'Efeitos colaterais', ranOut: 'Acabou o medicamento', other: 'Outro', reschedule: 'Reagendar', skipDose: 'Pular Esta Dose', takeNow: 'Tomar Agora' },
        edit: { title: 'Editar Medicamento', saveChanges: 'Salvar Alterações' },
        deleteConfirm: { title: 'Excluir Medicamento?', warning: 'Isso removerá todo o histórico de doses e lembretes. Esta ação não pode ser desfeita.', confirm: 'Excluir', cancel: 'Cancelar' },
        adherence: { title: 'Adesão ao Tratamento', daily: 'Diário', weekly: 'Semanal', monthly: 'Mensal', rate: 'Taxa de Adesão', shareReport: 'Compartilhar Relatório' },
        monthlyReport: { title: 'Relatório Mensal', summary: 'Resumo', totalDoses: 'Total de Doses', taken: 'Tomadas', missed: 'Perdidas', exportPdf: 'Exportar PDF', share: 'Compartilhar' },
        refillReminder: { title: 'Lembrete de Reabastecimento', daysRemaining: '{{count}} dias restantes', findPharmacy: 'Encontrar Farmácia', orderOnline: 'Pedir Online', snooze: 'Adiar Lembrete' },
        drugInteraction: { title: 'Interação Medicamentosa', severity: 'Severidade', minor: 'Leve', moderate: 'Moderada', severe: 'Grave', talkToDoctor: 'Falar com seu Médico', dismiss: 'Dispensar' },
        sideEffectsLog: { title: 'Registro de Efeitos Colaterais', empty: 'Nenhum efeito colateral registrado', addNew: 'Registrar Novo' },
        sideEffectForm: { title: 'Registrar Efeito Colateral', effectType: 'Tipo de Efeito', severity: 'Severidade', mild: 'Leve', moderate: 'Moderado', severe: 'Grave', date: 'Data', notes: 'Observações', submit: 'Enviar Registro', nausea: 'Náusea', headache: 'Dor de cabeça', dizziness: 'Tontura', fatigue: 'Fadiga', insomnia: 'Insônia', rash: 'Erupção cutânea', other: 'Outro' },
        pharmacyLocator: { title: 'Encontrar Farmácia', searchPlaceholder: 'Buscar farmácia...', getDirections: 'Como Chegar', call: 'Ligar', open: 'Aberta', closed: 'Fechada', mapPlaceholder: 'Visualização do Mapa' },
        prescriptionPhoto: { title: 'Foto da Receita', takePhoto: 'Tirar Foto', chooseGallery: 'Escolher da Galeria', tips: 'Dicas para uma boa foto', tip1: 'Use boa iluminação', tip2: 'Coloque em superfície plana', tip3: 'Certifique-se que todo o texto está visível', skipManual: 'Pular - Inserir Manualmente' },
        ocrReview: { title: 'Revisar Dados da Receita', confidence: 'Confiança', high: 'Alta', medium: 'Média', low: 'Baixa', confirmAdd: 'Confirmar e Adicionar', retakePhoto: 'Tirar Outra Foto', medicationName: 'Nome do Medicamento', dosage: 'Dosagem', frequency: 'Frequência', doctor: 'Médico', date: 'Data' },
        shareCaregiver: { title: 'Compartilhar com Cuidador', activeMeds: '{{count}} medicamentos ativos', shareLink: 'Compartilhar via Link', shareEmail: 'Compartilhar via Email', shareWhatsapp: 'Compartilhar via WhatsApp', permissionsInfo: 'O cuidador poderá ver nomes, horários e adesão dos medicamentos', manageAccess: 'Gerenciar Acesso' },
        caregiverAccess: { title: 'Acesso do Cuidador', viewOnly: 'Somente Visualização', fullAccess: 'Acesso Total', revokeAccess: 'Revogar Acesso', addNew: 'Adicionar Novo Cuidador', empty: 'Nenhum cuidador cadastrado' },
        export: { title: 'Exportar Medicamentos', format: 'Formato', pdf: 'PDF', csv: 'CSV', print: 'Imprimir', scope: 'Escopo', allMedications: 'Todos os Medicamentos', activeOnly: 'Apenas Ativos', dateRange: 'Período', preview: 'Pré-visualização', exportBtn: 'Exportar', shareBtn: 'Compartilhar' }
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
        emergency: 'Buscar Ajuda de Emergência',
        bodyMapBack: {
          title: 'Mapa Corporal — Vista Posterior',
          subtitle: 'Toque nas áreas das costas onde você sente sintomas.',
          flipToFront: 'Virar para Frente',
          selectedAreas: 'Áreas selecionadas ({{count}})',
          continue: 'Continuar',
          back: 'Voltar'
        },
        headDetail: {
          title: 'Detalhes da Cabeça',
          subtitle: 'Selecione a região específica da cabeça onde sente sintomas.',
          backToBodyMap: 'Voltar ao Mapa Corporal',
          selectedRegions: 'Regiões selecionadas ({{count}})',
          scalp: 'Couro Cabeludo', forehead: 'Testa', templesLeft: 'Têmpora Esquerda', templesRight: 'Têmpora Direita',
          eyes: 'Olhos', nose: 'Nariz', ears: 'Ouvidos', jaw: 'Mandíbula', throat: 'Garganta', backOfHead: 'Nuca'
        },
        photoUpload: {
          title: 'Enviar Foto do Sintoma',
          subtitle: 'Tire uma foto ou selecione da galeria para ajudar na análise.',
          takePhoto: 'Tirar Foto',
          chooseGallery: 'Escolher da Galeria',
          photosCount: '{{count}} de 5 fotos',
          skip: 'Pular',
          continue: 'Continuar',
          remove: 'Remover',
          maxPhotos: 'Máximo de 5 fotos atingido'
        },
        medicalHistory: {
          title: 'Histórico Médico',
          subtitle: 'Selecione condições relevantes do seu histórico médico.',
          conditions: 'Condições',
          surgeries: 'Cirurgias',
          allergies: 'Alergias',
          addNew: 'Adicionar nova condição',
          addButton: 'Adicionar',
          relevant: 'Relevante',
          continue: 'Continuar',
          back: 'Voltar'
        },
        medicationContext: {
          title: 'Medicamentos Atuais',
          subtitle: 'Marque os medicamentos que está tomando atualmente.',
          currentlyTaking: 'Tomando atualmente',
          addMedication: 'Adicionar medicamento',
          addButton: 'Adicionar',
          activeCount: '{{count}} medicamentos ativos',
          continue: 'Continuar',
          back: 'Voltar'
        },
        vitals: {
          title: 'Sinais Vitais',
          subtitle: 'Insira seus sinais vitais atuais (todos opcionais).',
          temperature: 'Temperatura (°C)',
          bloodPressure: 'Pressão Arterial (mmHg)',
          systolic: 'Sistólica',
          diastolic: 'Diastólica',
          heartRate: 'Frequência Cardíaca (bpm)',
          oxygenSaturation: 'Saturação de Oxigênio (%)',
          skip: 'Pular',
          continue: 'Continuar',
          back: 'Voltar',
          invalidRange: 'Valor fora do intervalo válido'
        },
        analyzing: {
          title: 'Analisando Sintomas',
          step1: 'Analisando sintomas...',
          step2: 'Consultando banco de dados médico...',
          step3: 'Comparando padrões...',
          step4: 'Gerando resultados...',
          pleaseWait: 'Por favor, aguarde enquanto analisamos seus sintomas.'
        },
        conditionsList: {
          title: 'Condições Possíveis',
          subtitle: 'Com base nos seus sintomas, estas são as condições mais prováveis.',
          riskAssessment: 'Avaliação de Risco Geral',
          matchProbability: 'Probabilidade de correspondência',
          tapForDetails: 'Toque para detalhes',
          viewSelfCare: 'Ver Autocuidado',
          bookAppointment: 'Agendar Consulta',
          lowRisk: 'Risco Baixo',
          moderateRisk: 'Risco Moderado',
          highRisk: 'Risco Alto'
        },
        conditionDetail: {
          title: 'Detalhes da Condição',
          overview: 'Visão Geral',
          commonCauses: 'Causas Comuns',
          treatmentOptions: 'Opções de Tratamento',
          whenToWorry: 'Quando Procurar Ajuda Médica',
          prevention: 'Prevenção',
          learnMore: 'Saiba Mais',
          back: 'Voltar',
          bookAppointment: 'Agendar Consulta',
          matchConfidence: 'Confiança da correspondência'
        },
        selfCareScreen: {
          title: 'Instruções de Autocuidado',
          restRecovery: 'Descanso e Recuperação',
          hydration: 'Hidratação',
          otcMedications: 'Medicamentos Sem Receita',
          monitoring: 'Monitoramento',
          whenToSeekHelp: 'Quando Procurar Ajuda',
          setFollowUp: 'Definir Lembrete de Acompanhamento',
          saveReport: 'Salvar Relatório',
          back: 'Voltar'
        },
        emergencyWarning: {
          title: 'ATENÇÃO — EMERGÊNCIA',
          doNotWait: 'NÃO ESPERE',
          callSamu: 'Ligar 192 (SAMU)',
          callEmergency: 'Ligar Emergência',
          nearestER: 'Pronto-Socorro Mais Próximo',
          warningSymptoms: 'Sinais de Alerta',
          disclaimer: 'Se você está em perigo imediato, ligue para os serviços de emergência imediatamente.',
          understand: 'Eu entendo, voltar'
        },
        bookAppointmentScreen: {
          title: 'Agendar Consulta',
          subtitle: 'Com base nos seus sintomas, recomendamos consultar um médico.',
          suggestedSpecialty: 'Especialidade Sugerida',
          bookNow: 'Agendar Agora',
          viewDoctors: 'Ver Médicos Disponíveis',
          maybeLater: 'Talvez Depois'
        },
        erLocator: {
          title: 'Pronto-Socorros Próximos',
          subtitle: 'Encontre o pronto-socorro mais próximo.',
          call: 'Ligar',
          directions: 'Como Chegar',
          distance: '{{distance}} km',
          waitTime: 'Espera: {{time}} min',
          emergencyCall: 'Emergência: 192'
        },
        saveReport: {
          title: 'Salvar Relatório',
          subtitle: 'Salve um resumo da sua verificação de sintomas.',
          saveAsPDF: 'Salvar como PDF',
          saveToRecords: 'Salvar no Histórico de Saúde',
          shareReport: 'Compartilhar Relatório',
          saved: 'Relatório salvo com sucesso',
          back: 'Voltar'
        },
        shareReport: {
          title: 'Compartilhar Relatório',
          subtitle: 'Compartilhe o relatório de sintomas.',
          shareEmail: 'Compartilhar por Email',
          shareWhatsApp: 'Compartilhar via WhatsApp',
          printReport: 'Imprimir Relatório',
          shareWithDoctor: 'Compartilhar com Médico',
          reportPreview: 'Prévia do Relatório',
          back: 'Voltar'
        },
        history: {
          title: 'Histórico de Verificações',
          subtitle: 'Suas verificações de sintomas anteriores.',
          filterAll: 'Todos',
          filter7Days: '7 Dias',
          filter30Days: '30 Dias',
          filter90Days: '90 Dias',
          empty: 'Nenhuma verificação anterior encontrada.',
          topCondition: 'Principal condição'
        },
        historyDetail: {
          title: 'Detalhes da Verificação',
          date: 'Data',
          symptoms: 'Sintomas',
          regions: 'Regiões',
          severity: 'Gravidade',
          conditions: 'Condições',
          recommendations: 'Recomendações',
          compare: 'Comparar com Outra Verificação',
          rateAccuracy: 'Avaliar Precisão',
          shareReport: 'Compartilhar Relatório'
        },
        accuracyRating: {
          title: 'Avaliar Precisão',
          question: 'O diagnóstico foi preciso?',
          veryAccurate: 'Muito Preciso',
          somewhatAccurate: 'Razoavelmente Preciso',
          notAccurate: 'Não Preciso',
          feedbackPlaceholder: 'Comentários adicionais (opcional)',
          submit: 'Enviar Avaliação',
          thankYou: 'Obrigado pelo seu feedback!'
        },
        followUp: {
          title: 'Lembrete de Acompanhamento',
          subtitle: 'Configure um lembrete para verificar seus sintomas.',
          timing: 'Quando verificar novamente',
          tomorrow: 'Amanhã',
          threeDays: 'Em 3 dias',
          oneWeek: 'Em 1 semana',
          twoWeeks: 'Em 2 semanas',
          custom: 'Personalizado',
          symptomsToWatch: 'Sintomas para Observar',
          warningSigns: 'Sinais de Alerta',
          setReminder: 'Definir Lembrete',
          reminderSet: 'Lembrete definido com sucesso'
        },
        diary: {
          title: 'Diário de Sintomas',
          subtitle: 'Registre seus sintomas diariamente.',
          addEntry: 'Adicionar Registro',
          symptomLabel: 'Sintoma',
          severityLabel: 'Gravidade',
          notesLabel: 'Observações',
          notesPlaceholder: 'Observações adicionais...',
          save: 'Salvar',
          cancel: 'Cancelar',
          trend: 'Tendência',
          improving: 'Melhorando',
          stable: 'Estável',
          worsening: 'Piorando'
        },
        comparison: {
          title: 'Comparar Verificações',
          subtitle: 'Compare duas verificações de sintomas lado a lado.',
          check1: 'Verificação 1',
          check2: 'Verificação 2',
          severityChange: 'Mudança de Gravidade',
          improved: 'Melhorou',
          worsened: 'Piorou',
          same: 'Igual',
          newSymptom: 'Novo',
          resolved: 'Resolvido',
          conclusion: 'Conclusão'
        }
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
    title: 'Configuracoes',
    language: 'Idioma',
    notifications: 'Notificacoes',
    privacy: 'Privacidade',
    about: 'Sobre',
    editProfile: 'Editar Perfil',
    personalInfo: {
      title: 'Informacoes Pessoais',
      fullName: 'Nome Completo',
      dateOfBirth: 'Data de Nascimento',
      gender: 'Genero',
      bloodType: 'Tipo Sanguineo',
      cpf: 'CPF',
      save: 'Salvar',
      cancel: 'Cancelar',
      changePhoto: 'Alterar foto',
      genderOptions: { male: 'Masculino', female: 'Feminino', other: 'Outro', preferNotToSay: 'Prefiro nao informar' }
    },
    changePassword: {
      title: 'Alterar Senha',
      currentPassword: 'Senha Atual',
      newPassword: 'Nova Senha',
      confirmPassword: 'Confirmar Nova Senha',
      strength: { weak: 'Fraca', medium: 'Media', strong: 'Forte' },
      save: 'Alterar Senha',
      success: 'Senha alterada com sucesso!',
      error: 'Erro ao alterar senha.',
      validation: { minLength: 'Minimo de 8 caracteres', uppercase: 'Deve conter letra maiuscula', match: 'As senhas nao coincidem' }
    },
    twoFactor: {
      title: 'Autenticacao em Duas Etapas',
      enabled: 'Ativada',
      disabled: 'Desativada',
      method: 'Metodo de Verificacao',
      sms: 'SMS',
      authenticator: 'Aplicativo Autenticador',
      phone: 'Telefone',
      changeNumber: 'Alterar numero',
      qrInstructions: 'Escaneie o codigo QR com seu aplicativo autenticador',
      disable: 'Desativar 2FA',
      disableConfirm: 'Tem certeza que deseja desativar a autenticacao em duas etapas?'
    },
    biometric: {
      title: 'Autenticacao Biometrica',
      faceId: 'Face ID',
      fingerprint: 'Impressao Digital',
      available: 'Disponivel neste dispositivo',
      notAvailable: 'Nao disponivel neste dispositivo',
      info: 'A autenticacao biometrica adiciona uma camada extra de seguranca ao seu login.'
    },
    dataExport: {
      title: 'Exportar Dados',
      info: 'De acordo com a LGPD, voce tem direito de solicitar uma copia dos seus dados pessoais.',
      categories: { profile: 'Dados do Perfil', health: 'Registros de Saude', appointments: 'Consultas', medications: 'Medicamentos', claims: 'Reembolsos' },
      format: { json: 'JSON', pdf: 'PDF' },
      request: 'Solicitar Exportacao',
      status: { pending: 'Pendente', processing: 'Processando', ready: 'Pronto para Download' },
      lastExport: 'Ultima exportacao'
    },
    deleteAccount: {
      title: 'Excluir Conta',
      warning: 'Esta acao e permanente e nao pode ser desfeita.',
      consequences: {
        healthData: 'Todos os seus registros de saude serao excluidos',
        plan: 'Seu plano de saude sera cancelado',
        leaderboard: 'Voce sera removido dos rankings',
        achievements: 'Todas as conquistas e XP serao perdidos',
        irreversible: 'Esta acao nao pode ser desfeita'
      },
      understand: 'Entendo que esta acao e permanente e irreversivel',
      proceed: 'Prosseguir para Confirmacao',
      goBack: 'Voltar'
    },
    deleteConfirm: {
      title: 'Confirmacao Final',
      waitMessage: 'Aguarde {{seconds}} segundos',
      typeToConfirm: 'Digite EXCLUIR para confirmar',
      confirmWord: 'EXCLUIR',
      deleteForever: 'Excluir Minha Conta Permanentemente',
      cancel: 'Cancelar'
    },
    languageSelect: {
      title: 'Idioma',
      portuguese: 'Portugues (Brasil)',
      english: 'English (US)',
      spanish: 'Espanol',
      preview: 'Visualizacao',
      save: 'Salvar'
    },
    themeSelect: {
      title: 'Tema',
      light: 'Claro',
      dark: 'Escuro',
      system: 'Sistema (Automatico)',
      preview: 'Visualizacao'
    },
    accessibility: {
      title: 'Acessibilidade',
      fontSize: 'Tamanho da Fonte',
      fontSizes: { small: 'P', medium: 'M', large: 'G', extraLarge: 'XG' },
      highContrast: 'Alto Contraste',
      reducedMotion: 'Movimento Reduzido',
      screenReaderInfo: 'Este app e compativel com VoiceOver (iOS) e TalkBack (Android).',
      preview: 'Texto de exemplo para visualizacao'
    },
    connectedDevices: {
      title: 'Dispositivos Conectados',
      pairNew: 'Parear Novo Dispositivo',
      unpair: 'Desconectar',
      lastSync: 'Ultima sincronizacao',
      connected: 'Conectado',
      disconnected: 'Desconectado',
      empty: 'Nenhum dispositivo conectado.',
      confirmUnpair: 'Deseja desconectar este dispositivo?'
    },
    healthPlan: {
      title: 'Dados do Plano',
      planName: 'Nome do Plano',
      planNumber: 'Numero do Plano',
      type: 'Tipo',
      validity: 'Vigencia',
      memberName: 'Nome do Titular',
      memberNumber: 'Numero do Cartao',
      ansRegistration: 'Registro ANS',
      viewCard: 'Ver Carteirinha Digital',
      viewDocs: 'Ver Documentos'
    },
    insuranceDocs: {
      title: 'Documentos do Plano',
      filters: { all: 'Todos', cards: 'Carteirinhas', guides: 'Guias', policies: 'Politicas' },
      download: 'Baixar',
      view: 'Visualizar',
      empty: 'Nenhum documento disponivel.'
    },
    dependents: {
      title: 'Dependentes',
      addDependent: 'Adicionar Dependente',
      edit: 'Editar',
      remove: 'Remover',
      relationship: 'Parentesco',
      dob: 'Data de Nascimento',
      cpf: 'CPF',
      empty: 'Nenhum dependente cadastrado.',
      confirmRemove: 'Deseja remover este dependente?'
    },
    addDependent: {
      title: 'Adicionar Dependente',
      fullName: 'Nome Completo',
      dateOfBirth: 'Data de Nascimento',
      cpf: 'CPF',
      relationship: 'Parentesco',
      relationshipOptions: { spouse: 'Conjuge', child: 'Filho(a)', father: 'Pai', mother: 'Mae', other: 'Outro' },
      save: 'Salvar',
      cancel: 'Cancelar'
    },
    emergencyContacts: {
      title: 'Contatos de Emergencia',
      addContact: 'Adicionar Contato',
      name: 'Nome',
      phone: 'Telefone',
      relationship: 'Relacao',
      priority: 'Prioridade',
      edit: 'Editar',
      delete: 'Excluir',
      empty: 'Nenhum contato de emergencia cadastrado.'
    },
    addresses: {
      title: 'Enderecos',
      addAddress: 'Adicionar Endereco',
      primary: 'Principal',
      edit: 'Editar',
      delete: 'Excluir',
      empty: 'Nenhum endereco cadastrado.',
      labels: { home: 'Casa', work: 'Trabalho', other: 'Outro' }
    },
    addAddress: {
      title: 'Adicionar Endereco',
      label: 'Tipo',
      cep: 'CEP',
      street: 'Rua',
      number: 'Numero',
      complement: 'Complemento',
      neighborhood: 'Bairro',
      city: 'Cidade',
      state: 'Estado',
      setPrimary: 'Definir como endereco principal',
      save: 'Salvar',
      cancel: 'Cancelar',
      cepLoading: 'Buscando endereco...'
    },
    terms: {
      title: 'Termos de Servico',
      lastUpdated: 'Atualizado em'
    },
    privacyPolicy: {
      title: 'Politica de Privacidade',
      lastUpdated: 'Atualizado em',
      exportLink: 'Exportar meus dados',
      deleteLink: 'Excluir minha conta'
    },
    aboutApp: {
      title: 'Sobre o App',
      version: 'Versao',
      build: 'Build',
      environment: 'Ambiente',
      credits: 'Creditos',
      licenses: 'Licencas Open Source',
      rateApp: 'Avaliar este App',
      copyright: 'AUSTA Saude. Todos os direitos reservados.'
    },
    logout: {
      title: 'Sair da Conta',
      sessionInfo: 'Conectado desde',
      device: 'Dispositivo',
      warning: 'Ao sair, sua sessao sera encerrada e dados em cache serao removidos.',
      signOut: 'Sair',
      cancel: 'Cancelar'
    },
    feedback: {
      title: 'Avaliar o App',
      rating: 'Sua Avaliacao',
      ratingLabels: { terrible: 'Pessimo', bad: 'Ruim', average: 'Regular', good: 'Bom', excellent: 'Excelente' },
      category: 'Categoria',
      categoryOptions: { bug: 'Bug', suggestion: 'Sugestao', compliment: 'Elogio', other: 'Outro' },
      comment: 'Comentario',
      charCount: '{{count}}/500',
      submit: 'Enviar Feedback',
      rateOnStore: 'Avaliar na App Store'
    },
    sections: {
      account: 'Conta',
      security: 'Seguranca',
      notifications: 'Notificacoes',
      privacy: 'Privacidade',
      healthPlan: 'Plano de Saude',
      devices: 'Dispositivos',
      preferences: 'Preferencias',
      help: 'Ajuda',
      data: 'Dados',
      app: 'App'
    }
  },

  help: {
    home: {
      title: 'Central de Ajuda',
      search: 'Buscar',
      searchPlaceholder: 'Como podemos ajudar?',
      categories: { faq: 'Perguntas Frequentes', contact: 'Fale Conosco', report: 'Reportar Problema', terms: 'Termos de Servico', privacy: 'Politica de Privacidade', about: 'Sobre o App' },
      quickLinks: 'Links Rapidos'
    },
    faq: {
      title: 'Perguntas Frequentes',
      noResults: 'Nenhum resultado encontrado.'
    },
    faqDetail: {
      title: 'Detalhes',
      wasHelpful: 'Este artigo foi util?',
      yes: 'Sim',
      no: 'Nao',
      thankYou: 'Obrigado pelo feedback!',
      relatedArticles: 'Artigos Relacionados',
      contactSupport: 'Falar com Suporte'
    },
    contact: {
      title: 'Fale Conosco',
      chat: 'Chat ao Vivo',
      chatDescription: 'Converse com nosso time de suporte',
      chatOnline: 'Online',
      startChat: 'Iniciar Chat',
      phone: 'Telefone',
      phoneNumber: '0800 123 4567',
      phoneHours: 'Seg-Sex, 8h as 20h',
      call: 'Ligar',
      email: 'Email',
      emailAddress: 'suporte@austa.com.br',
      emailResponse: 'Resposta em ate 24h',
      sendEmail: 'Enviar Email',
      operatingHours: 'Horario de Atendimento'
    },
    chat: {
      title: 'Chat ao Vivo',
      placeholder: 'Digite sua mensagem...',
      send: 'Enviar',
      typing: 'Digitando...',
      online: 'Online'
    },
    report: {
      title: 'Reportar Problema',
      category: 'Categoria',
      categoryOptions: { bug: 'Bug', crash: 'Crash', performance: 'Desempenho', visual: 'Visual', other: 'Outro' },
      description: 'Descricao do Problema',
      stepsToReproduce: 'Passos para Reproduzir',
      attachScreenshot: 'Anexar Captura de Tela',
      deviceInfo: 'Informacoes do Dispositivo',
      submit: 'Enviar Relatorio'
    }
  },

  notifications: {
    title: 'Notificações',
    empty: 'Nenhuma notificação.',
    markAllRead: 'Marcar Todas como Lidas'
  }
};

export default translations;