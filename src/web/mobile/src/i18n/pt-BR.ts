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
      telemedicineDeep: {
        connecting: {
          title: 'Conectando',
          status: 'Conectando ao seu médico...',
          elapsedTime: 'Tempo decorrido',
          cancel: 'Cancelar',
          retry: 'Tentar Novamente',
          timeout: 'A conexão está demorando mais que o esperado.',
          doctorJoining: '{{doctorName}} está entrando...'
        },
        controls: {
          title: 'Videochamada',
          mute: 'Mudo',
          unmute: 'Ativar Áudio',
          cameraOn: 'Câmera Ligada',
          cameraOff: 'Câmera Desligada',
          speaker: 'Alto-Falante',
          earpiece: 'Fone',
          chat: 'Chat',
          endCall: 'Encerrar Chamada',
          callDuration: 'Duração da Chamada',
          connectionQuality: 'Qualidade da Conexão',
          you: 'Você'
        },
        chat: {
          title: 'Chat na Chamada',
          sendMessage: 'Enviar Mensagem',
          placeholder: 'Digite sua mensagem...',
          quickReplyYes: 'Sim',
          quickReplyNo: 'Não',
          quickReplyUnderstand: 'Entendi',
          quickReplyRepeat: 'Pode repetir?',
          close: 'Fechar'
        },
        screenShare: {
          title: 'Compartilhamento de Tela',
          doctorSharing: '{{doctorName}} está compartilhando a tela',
          pinchToZoom: 'Aperte para ampliar',
          returnToVideo: 'Voltar ao Vídeo',
          stopSharing: 'Parar Compartilhamento'
        },
        endScreen: {
          title: 'Chamada Encerrada',
          callEnded: 'Sua consulta por vídeo terminou',
          duration: 'Duração',
          rateCall: 'Avalie sua consulta',
          feedbackPlaceholder: 'Compartilhe seu feedback (opcional)...',
          submitRating: 'Enviar Avaliação',
          viewSummary: 'Ver Resumo da Consulta',
          bookFollowUp: 'Agendar Retorno',
          returnDashboard: 'Voltar ao Início',
          thankYou: 'Obrigado pelo feedback!'
        }
      },
      visit: {
        summary: {
          title: 'Resumo da Consulta',
          doctorInfo: 'Informações do Médico',
          diagnosis: 'Diagnóstico',
          clinicalNotes: 'Notas Clínicas',
          recommendations: 'Recomendações',
          viewPrescriptions: 'Ver Receitas',
          scheduleFollowUp: 'Agendar Retorno',
          viewLabOrders: 'Ver Exames',
          shareSummary: 'Compartilhar Resumo',
          downloadSummary: 'Baixar Resumo'
        },
        prescriptions: {
          title: 'Receitas',
          medication: 'Medicamento',
          dosage: 'Dosagem',
          frequency: 'Frequência',
          duration: 'Duração',
          instructions: 'Instruções',
          sendToPharmacy: 'Enviar para Farmácia',
          sendAllToPharmacy: 'Enviar Todas para Farmácia',
          addToMedications: 'Adicionar aos Meus Medicamentos',
          interactionWarning: 'Alerta de Interação',
          sentSuccess: 'Enviado para farmácia com sucesso'
        },
        followUp: {
          title: 'Agendar Retorno',
          recommendation: '{{doctorName}} recomenda retorno em {{weeks}} semanas',
          recommendedDate: 'Data Recomendada',
          selectDate: 'Selecione uma Data',
          morning: 'Manhã',
          afternoon: 'Tarde',
          evening: 'Noite',
          bookFollowUp: 'Agendar Retorno',
          remindLater: 'Lembrar Depois',
          skip: 'Pular'
        },
        labOrders: {
          title: 'Pedidos de Exames',
          testName: 'Nome do Exame',
          urgency: 'Urgência',
          preparation: 'Preparo',
          fastingRequired: 'Jejum Necessário',
          nearbyLabs: 'Laboratórios Próximos',
          distance: '{{distance}} km',
          scheduleVisit: 'Agendar Coleta',
          viewAllLabs: 'Ver Todos os Laboratórios',
          routine: 'Rotina',
          urgent: 'Urgente'
        },
        referral: {
          title: 'Encaminhamento',
          referredBy: 'Encaminhado por',
          specialist: 'Especialista',
          specialty: 'Especialidade',
          clinic: 'Clínica',
          reason: 'Motivo do Encaminhamento',
          urgencyLevel: 'Nível de Urgência',
          bookWithSpecialist: 'Agendar com Especialista',
          viewProfile: 'Ver Perfil',
          validityPeriod: 'Este encaminhamento é válido por {{days}} dias',
          routine: 'Rotina',
          urgentLevel: 'Urgente',
          emergent: 'Emergencial'
        }
      },
      payment: {
        summary: {
          title: 'Resumo do Pagamento',
          consultationFee: 'Consulta',
          insuranceCoverage: 'Cobertura do Plano',
          copay: 'Copagamento',
          additionalFees: 'Taxas Adicionais',
          total: 'Total',
          paymentMethod: 'Método de Pagamento',
          addPaymentMethod: 'Adicionar Método de Pagamento',
          payNow: 'Pagar Agora',
          payLater: 'Pagar Depois',
          securityNotice: 'Pagamento criptografado e protegido pela LGPD',
          cardEnding: 'Cartão final ****{{last4}}'
        },
        receipt: {
          title: 'Comprovante de Pagamento',
          paymentConfirmed: 'Pagamento Confirmado',
          transactionId: 'ID da Transação',
          dateTime: 'Data e Hora',
          amountPaid: 'Valor Pago',
          paymentMethod: 'Método de Pagamento',
          status: 'Status',
          paid: 'Pago',
          pending: 'Pendente',
          failed: 'Falhou',
          serviceDetails: 'Detalhes do Serviço',
          downloadPDF: 'Baixar PDF',
          emailReceipt: 'Enviar por Email',
          printReceipt: 'Imprimir',
          returnDashboard: 'Voltar ao Início'
        }
      },
      asyncChat: {
        title: 'Chat com Médico',
        doctorInfo: 'Informações do Médico',
        online: 'Online',
        offline: 'Offline',
        responseTime: '{{doctorName}} geralmente responde em 24 horas',
        placeholder: 'Digite sua mensagem...',
        send: 'Enviar',
        attachFile: 'Anexar Arquivo',
        takePhoto: 'Tirar Foto',
        consultationEnded: 'Consulta encerrada há {{hours}} horas',
        you: 'Você'
      },
      medicalRecords: {
        title: 'Prontuário Médico',
        filterAll: 'Todos',
        filterVisitNotes: 'Notas de Consulta',
        filterLabResults: 'Resultados de Exames',
        filterPrescriptions: 'Receitas',
        filterImaging: 'Imagens',
        download: 'Baixar',
        share: 'Compartilhar',
        sendToDoctor: 'Enviar ao Médico',
        downloadAll: 'Baixar Todos',
        shareSelected: 'Compartilhar Selecionados',
        requestRecords: 'Solicitar Prontuários',
        fhirNotice: 'Dados em conformidade com o padrão FHIR HL7',
        recordDate: 'Data',
        recordType: 'Tipo',
        recordSize: 'Tamanho'
      },
      consultation: {
        doctorReviews: {
          title: 'Avaliações do Médico',
          averageRating: 'Nota Média',
          reviews: 'Avaliações',
          helpful: 'Útil',
          sortBy: 'Ordenar por',
          mostRecent: 'Mais Recente',
          highest: 'Maior Nota',
          lowest: 'Menor Nota',
          writeReview: 'Escrever Avaliação',
          of5: 'de 5',
          helpfulCount: '{{count}} acharam útil',
        },
        appointmentType: {
          title: 'Tipo de Consulta',
          inPerson: 'Presencial',
          telemedicine: 'Telemedicina',
          homeVisit: 'Visita Domiciliar',
          inPersonDesc: 'Consulta na clínica ou hospital',
          telemedicineDesc: 'Consulta por videochamada',
          homeVisitDesc: 'Médico vai até você',
          continue: 'Continuar',
          estimatedPrice: 'Valor estimado',
          available: 'Disponível',
        },
        reasonForVisit: {
          title: 'Motivo da Consulta',
          placeholder: 'Descreva o motivo da sua consulta...',
          commonReasons: 'Motivos Comuns',
          checkup: 'Check-up',
          followUp: 'Retorno',
          newSymptoms: 'Novos Sintomas',
          secondOpinion: 'Segunda Opinião',
          prescriptionRenewal: 'Renovação de Receita',
          examResults: 'Resultados de Exames',
          attachFile: 'Anexar Arquivo',
          characters: '{{count}} caracteres',
          continue: 'Continuar',
          attachedFiles: 'Arquivos Anexados',
          removeFile: 'Remover',
        },
        documents: {
          title: 'Documentos Necessários',
          idDocument: 'Documento de Identidade (RG/CPF)',
          insuranceCard: 'Carteira do Convênio',
          medicalReferral: 'Guia de Encaminhamento',
          examResults: 'Resultados de Exames Recentes',
          optional: 'Opcional',
          upload: 'Enviar',
          uploaded: 'Enviado',
          pending: 'Pendente',
          continue: 'Continuar',
        },
        insurance: {
          title: 'Verificação de Convênio',
          selectPlan: 'Selecione seu Convênio',
          particular: 'Particular',
          verifying: 'Verificando cobertura...',
          covered: 'Coberto pelo Convênio',
          notCovered: 'Não Coberto',
          copay: 'Copagamento',
          coverage: 'Cobertura',
          authorization: 'Autorização',
          authorized: 'Autorizado',
          pendingAuth: 'Aguardando Autorização',
          warning: 'Este procedimento pode não ser coberto pelo seu plano.',
          continue: 'Continuar',
        },
        bookingSuccess: {
          title: 'Consulta Agendada!',
          subtitle: 'Sua consulta foi agendada com sucesso.',
          doctor: 'Médico(a)',
          specialty: 'Especialidade',
          date: 'Data',
          time: 'Horário',
          type: 'Tipo',
          location: 'Local',
          addToCalendar: 'Adicionar ao Calendário',
          viewAppointment: 'Ver Consulta',
          backToHome: 'Voltar ao Início',
        },
        appointmentsList: {
          title: 'Minhas Consultas',
          upcoming: 'Próximas',
          past: 'Anteriores',
          cancelled: 'Canceladas',
          empty: 'Nenhuma consulta encontrada.',
          newAppointment: 'Nova Consulta',
          confirmed: 'Confirmada',
          pending: 'Pendente',
          inPerson: 'Presencial',
          telemedicine: 'Telemedicina',
        },
        reschedule: {
          title: 'Reagendar Consulta',
          currentAppointment: 'Consulta Atual',
          selectDate: 'Selecione a Nova Data',
          selectTime: 'Selecione o Horário',
          reason: 'Motivo do Reagendamento',
          scheduleConflict: 'Conflito de Agenda',
          feelingBetter: 'Melhorei',
          differentTime: 'Preciso de Outro Horário',
          other: 'Outro',
          notes: 'Observações',
          confirm: 'Confirmar Reagendamento',
          policyWarning: 'Máximo de 2 reagendamentos por consulta.',
        },
        cancel: {
          title: 'Cancelar Consulta',
          policy: 'Política de Cancelamento',
          fullRefund: 'Mais de 24h antes: reembolso total',
          halfRefund: '12-24h antes: 50% de reembolso',
          noRefund: 'Menos de 12h: sem reembolso',
          reason: 'Motivo do Cancelamento',
          scheduleConflict: 'Conflito de Agenda',
          anotherDoctor: 'Encontrei Outro Médico',
          feelingBetter: 'Melhorei',
          financial: 'Motivos Financeiros',
          other: 'Outro',
          details: 'Detalhes adicionais',
          understand: 'Entendo a política de cancelamento',
          cancelAppointment: 'Cancelar Consulta',
          keepAppointment: 'Manter Consulta',
        },
        cancelled: {
          title: 'Consulta Cancelada',
          details: 'Detalhes do Cancelamento',
          refundInfo: 'Informações de Reembolso',
          refundAmount: 'Valor do Reembolso',
          processingTime: 'Prazo: 5-10 dias úteis',
          bookNew: 'Agendar Nova Consulta',
          backToAppointments: 'Voltar às Consultas',
        },
        noShow: {
          title: 'Consulta Perdida',
          warning: 'Você não compareceu à sua consulta.',
          feeWarning: 'Uma taxa de não comparecimento pode ser aplicada.',
          feeAmount: 'Taxa: R$ 50,00',
          policyInfo: '3 faltas em 6 meses podem resultar em restrição da conta.',
          rescheduleNow: 'Reagendar Agora',
          contactSupport: 'Contatar Suporte',
          backToAppointments: 'Voltar às Consultas',
        },
        preVisitChecklist: {
          title: 'Checklist Pré-Consulta',
          progress: '{{completed}} de {{total}} itens',
          documents: 'Documentos',
          health: 'Saúde',
          logistics: 'Logística',
          idCard: 'Documento de identidade',
          insuranceCard: 'Carteira do convênio',
          referral: 'Guia de encaminhamento',
          fasting: 'Jejum conforme orientação',
          medications: 'Lista de medicamentos atuais',
          examResults: 'Resultados de exames recentes',
          transportation: 'Transporte planejado',
          address: 'Endereço confirmado',
          arriveEarly: 'Chegar 15 min antes',
          internet: 'Conexão de internet estável',
          camera: 'Câmera e microfone funcionando',
          quietRoom: 'Ambiente silencioso',
          allSet: 'Tudo pronto para sua consulta!',
          viewAppointment: 'Ver Consulta',
        },
        rateVisit: {
          title: 'Avaliar Consulta',
          ratingLabel: 'Sua avaliação',
          terrible: 'Péssimo',
          poor: 'Ruim',
          average: 'Regular',
          good: 'Bom',
          excellent: 'Excelente',
          punctuality: 'Pontualidade',
          communication: 'Comunicação',
          expertise: 'Competência',
          facility: 'Infraestrutura',
          review: 'Comentário',
          reviewPlaceholder: 'Compartilhe sua experiência...',
          wouldRecommend: 'Recomendaria este médico?',
          submit: 'Enviar Avaliação',
          skip: 'Pular',
        },
        savedDoctors: {
          title: 'Médicos Favoritos',
          empty: 'Nenhum médico favorito ainda.',
          findDoctors: 'Buscar Médicos',
          bookNow: 'Agendar Agora',
          nextAvailable: 'Próximo disponível',
          searchPlaceholder: 'Buscar por nome...',
          unsave: 'Remover dos favoritos',
        },
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
    },
    socialAuth: {
      title: 'Bem-vindo ao AUSTA',
      subtitle: 'Entre para continuar sua jornada de saude',
      googleButton: 'Continuar com Google',
      appleButton: 'Continuar com Apple',
      facebookButton: 'Continuar com Facebook',
      divider: 'ou continue com email',
      emailLogin: 'Entrar com Email',
      noAccount: 'Nao tem uma conta?',
      register: 'Criar Conta',
      lgpdConsent: 'Eu concordo com o tratamento dos meus dados pessoais conforme a',
      privacyPolicy: 'Politica de Privacidade',
      and: 'e',
      termsOfService: 'Termos de Servico',
      consentRequired: 'Consentimento Necessario',
      consentMessage: 'Por favor, aceite os termos de privacidade antes de continuar com o login social.',
      comingSoon: 'Integracao com autenticacao social em breve.',
      disclaimer: 'Ao entrar, voce concorda com nossos Termos de Servico e Politica de Privacidade. Seus dados sao protegidos pela LGPD (Lei Geral de Protecao de Dados).'
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
  },
  onboarding: {
    personalizationIntro: {
      title: 'Personalize Sua Experiencia',
      subtitle: 'Conte-nos sobre seus objetivos de saude para personalizar sua experiencia',
      benefit1: 'Melhores recomendacoes de saude',
      benefit2: 'Dicas de saude personalizadas',
      benefit3: 'Planos de bem-estar sob medida',
      getStarted: 'Comecar',
      skip: 'Pular por enquanto'
    },
    goalSelection: {
      title: 'Selecione Seus Objetivos de Saude',
      subtitle: 'Escolha as areas em que deseja focar',
      weightManagement: 'Controle de Peso',
      chronicDisease: 'Gerenciamento de Doencas Cronicas',
      fitness: 'Fitness e Exercicios',
      mentalHealth: 'Saude Mental e Bem-estar',
      nutrition: 'Nutricao e Dieta',
      sleep: 'Qualidade do Sono',
      continue: 'Continuar',
      selectAtLeastOne: 'Selecione pelo menos um objetivo'
    },
    confirmation: {
      title: 'Tudo Pronto!',
      subtitle: 'Sua experiencia foi personalizada com base nas suas selecoes',
      selectedGoals: 'Seus Objetivos Selecionados',
      startUsing: 'Comecar a Usar o AUSTA'
    }
  },
  profileSetup: {
    emergencyContact: {
      title: 'Contato de Emergencia',
      subtitle: 'Adicione alguem que possamos contactar em caso de emergencia',
      contactName: 'Nome do Contato',
      phoneNumber: 'Numero de Telefone',
      relationship: 'Parentesco',
      relationships: {
        spouse: 'Conjuge',
        parent: 'Pai/Mae',
        sibling: 'Irmao/Irma',
        child: 'Filho(a)',
        friend: 'Amigo(a)',
        other: 'Outro'
      },
      isPrimary: 'Definir como contato principal',
      save: 'Salvar Contato'
    },
    notificationPrefs: {
      title: 'Preferencias de Notificacao',
      subtitle: 'Escolha quais notificacoes deseja receber',
      appointments: 'Lembretes de Consulta',
      medications: 'Alertas de Medicamento',
      healthTips: 'Dicas de Saude',
      promotions: 'Promocoes e Ofertas',
      save: 'Salvar Preferencias'
    },
    biometricSetup: {
      title: 'Proteja Sua Conta',
      subtitle: 'Ative a autenticacao biometrica para acesso mais rapido e seguro',
      benefit1: 'Login mais rapido',
      benefit2: 'Acesso seguro',
      benefit3: 'Sem necessidade de senhas',
      enable: 'Ativar Face ID / Touch ID',
      skip: 'Pular por Enquanto'
    }
  },
  homeWidgets: {
    weeklySummary: {
      title: 'Resumo Semanal',
      steps: 'Passos',
      calories: 'Calorias',
      sleep: 'Sono',
      heartRate: 'Freq. Cardiaca',
      trendUp: 'subiu',
      trendDown: 'desceu',
      trendStable: 'estavel',
      average: 'media'
    },
    bottomSheet: {
      title: 'Acoes Rapidas',
      addMetric: 'Adicionar Metrica de Saude',
      bookAppointment: 'Agendar Consulta',
      checkSymptoms: 'Verificar Sintomas',
      medicationLog: 'Registrar Medicamento'
    },
    medicationReminders: {
      title: 'Lembretes de Medicamento',
      nextDose: 'Proxima Dose',
      takeNow: 'Tomar Agora',
      skip: 'Pular',
      noReminders: 'Sem lembretes pendentes',
      viewAll: 'Ver Todos'
    },
    appointmentWidget: {
      title: 'Proximas Consultas',
      joinTelemedicine: 'Entrar',
      noAppointments: 'Sem consultas agendadas',
      seeAll: 'Ver Todas',
      telemedicine: 'Telemedicina'
    },
    healthTips: {
      title: 'Dicas de Saude',
      readMore: 'Ler Mais'
    },
    empty: {
      title: 'Bem-vindo ao AUSTA!',
      subtitle: 'Sua jornada de saude comeca aqui. Complete estes passos para comecar.',
      completeProfile: 'Complete seu perfil',
      addGoals: 'Adicione objetivos de saude',
      connectDevice: 'Conecte um dispositivo',
      scheduleAppointment: 'Agende sua primeira consulta',
      getStarted: 'Comecar'
    }
  },
  notificationScreens: {
    unread: {
      title: 'Notificacoes Nao Lidas',
      noUnread: 'Tudo em dia!',
      markAllRead: 'Marcar Todas como Lidas'
    },
    categoryFilter: {
      all: 'Todas',
      health: 'Saude',
      care: 'Consultas',
      plan: 'Plano',
      system: 'Sistema'
    },
    empty: {
      title: 'Sem Notificacoes',
      description: 'Voce ainda nao tem notificacoes. Avisaremos sobre atualizacoes importantes.'
    },
    settings: {
      title: 'Configuracoes de Notificacao',
      healthUpdates: 'Atualizacoes de Saude',
      careReminders: 'Lembretes de Consulta',
      planNotifications: 'Notificacoes do Plano',
      systemAlerts: 'Alertas do Sistema',
      quietHours: 'Horario Silencioso',
      quietHoursEnabled: 'Ativar Horario Silencioso',
      from: 'De',
      to: 'Ate',
      save: 'Salvar Configuracoes'
    }
  },
  searchScreens: {
    doctorResults: {
      title: 'Resultados de Medicos',
      book: 'Agendar',
      rating: 'Avaliacao',
      specialty: 'Especialidade'
    },
    articleResults: {
      title: 'Resultados de Artigos',
      readTime: '{{minutes}} min de leitura',
      source: 'Fonte'
    },
    medicationResults: {
      title: 'Resultados de Medicamentos',
      generic: 'Generico',
      interactions: 'Interacoes',
      hasInteractions: 'Possui interacoes'
    },
    noResults: {
      title: 'Nenhum Resultado Encontrado',
      description: 'Nao encontramos nada correspondente a sua busca.',
      suggestions: 'Sugestoes',
      checkSpelling: 'Verifique a ortografia',
      tryDifferent: 'Tente palavras diferentes',
      browseCategories: 'Explore categorias',
      tryAgain: 'Tentar Novamente'
    }
  },
  healthAssessment: {
    wizard: {
      title: 'Avaliacao de Saude',
      subtitle: 'Responda as perguntas para uma avaliacao completa',
      next: 'Proximo',
      back: 'Voltar',
      submit: 'Enviar Avaliacao',
      step: 'Passo {{current}} de {{total}}',
      progress: 'Progresso',
      complete: 'Avaliacao Concluida',
      completeMessage: 'Sua avaliacao de saude foi enviada com sucesso.',
      returnHome: 'Voltar ao Inicio'
    },
    introduction: {
      title: 'Avaliacao de Saude',
      description: 'Esta avaliacao nos ajuda a entender melhor sua saude e criar recomendacoes personalizadas.',
      benefits: {
        personalized: 'Recomendacoes personalizadas de saude',
        tracking: 'Acompanhamento de metas de saude',
        insights: 'Insights baseados em seus dados',
        prevention: 'Sugestoes de prevencao'
      },
      estimatedTime: 'Tempo estimado: 10 minutos',
      start: 'Iniciar Avaliacao'
    },
    personalInfo: {
      title: 'Informacoes Pessoais',
      fullName: 'Nome Completo',
      dateOfBirth: 'Data de Nascimento',
      gender: 'Genero',
      genderOptions: {
        male: 'Masculino',
        female: 'Feminino',
        other: 'Outro'
      },
      bloodType: 'Tipo Sanguineo'
    },
    heightWeight: {
      title: 'Altura e Peso',
      height: 'Altura',
      weight: 'Peso',
      heightUnit: 'cm',
      weightUnit: 'kg',
      bmi: 'IMC',
      bmiCategory: {
        underweight: 'Abaixo do Peso',
        normal: 'Normal',
        overweight: 'Sobrepeso',
        obese: 'Obesidade'
      },
      metric: 'Metrico',
      imperial: 'Imperial'
    },
    conditions: {
      title: 'Condicoes Existentes',
      subtitle: 'Selecione as condicoes que voce possui',
      diabetes: 'Diabetes',
      hypertension: 'Hipertensao',
      asthma: 'Asma',
      heartDisease: 'Doenca Cardiaca',
      arthritis: 'Artrite',
      depression: 'Depressao',
      anxiety: 'Ansiedade',
      thyroid: 'Tireoide',
      migraine: 'Enxaqueca',
      backPain: 'Dor nas Costas',
      none: 'Nenhuma',
      other: 'Outra',
      otherPlaceholder: 'Descreva sua condicao'
    },
    medications: {
      title: 'Medicamentos',
      question: 'Voce toma medicamentos regularmente?',
      yes: 'Sim',
      no: 'Nao',
      medicationName: 'Nome do Medicamento',
      dosage: 'Dosagem',
      frequency: 'Frequencia',
      frequencyOptions: {
        daily: 'Diario',
        weekly: 'Semanal',
        monthly: 'Mensal'
      },
      addMedication: 'Adicionar Medicamento',
      removeMedication: 'Remover'
    },
    allergies: {
      title: 'Alergias',
      subtitle: 'Selecione suas alergias conhecidas',
      penicillin: 'Penicilina',
      sulfa: 'Sulfa',
      latex: 'Latex',
      peanuts: 'Amendoim',
      shellfish: 'Frutos do Mar',
      eggs: 'Ovos',
      milk: 'Leite',
      soy: 'Soja',
      none: 'Nenhuma',
      other: 'Outra',
      otherPlaceholder: 'Descreva sua alergia',
      severity: 'Gravidade',
      severityOptions: {
        mild: 'Leve',
        moderate: 'Moderada',
        severe: 'Grave'
      }
    },
    familyHistory: {
      title: 'Historico Familiar',
      subtitle: 'Selecione condicoes presentes em sua familia',
      heartDisease: 'Doenca Cardiaca',
      diabetes: 'Diabetes',
      cancer: 'Cancer',
      stroke: 'AVC',
      hypertension: 'Hipertensao',
      mentalHealth: 'Saude Mental',
      relation: 'Parentesco',
      relationOptions: {
        parent: 'Pai/Mae',
        sibling: 'Irmao/Irma',
        grandparent: 'Avo/Avo'
      }
    },
    exercise: {
      title: 'Exercicios',
      frequency: 'Com que frequencia voce se exercita?',
      frequencyOptions: {
        never: 'Nunca',
        light: '1-2x por semana',
        moderate: '3-4x por semana',
        active: '5+ por semana'
      },
      type: 'Tipos de Exercicio',
      typeOptions: {
        walking: 'Caminhada',
        running: 'Corrida',
        swimming: 'Natacao',
        cycling: 'Ciclismo',
        gym: 'Academia',
        yoga: 'Yoga',
        dance: 'Danca',
        sports: 'Esportes'
      },
      duration: 'Duracao por Sessao',
      durationOptions: {
        short: '15 min',
        medium: '30 min',
        long: '45 min',
        extended: '60+ min'
      }
    },
    diet: {
      title: 'Alimentacao',
      dietType: 'Tipo de Dieta',
      dietOptions: {
        omnivore: 'Onivoro',
        vegetarian: 'Vegetariano',
        vegan: 'Vegano',
        pescatarian: 'Pescetariano',
        keto: 'Cetogenica',
        other: 'Outra'
      },
      mealFrequency: 'Refeicoes por Dia',
      mealOptions: {
        few: '1-2',
        normal: '3',
        frequent: '4-5',
        many: '6+'
      },
      fruitVegetable: 'Consumo de Frutas e Vegetais',
      fruitOptions: {
        rarely: 'Raramente',
        low: '1-2 porcoes',
        moderate: '3-4 porcoes',
        high: '5+ porcoes'
      },
      fastFood: 'Frequencia de Fast Food',
      fastFoodOptions: {
        never: 'Nunca',
        rarely: 'Raramente',
        weekly: 'Semanalmente',
        daily: 'Diariamente'
      }
    },
    sleep: {
      title: 'Sono',
      hours: 'Horas de Sono por Noite',
      quality: 'Qualidade do Sono',
      qualityOptions: {
        poor: 'Ruim',
        fair: 'Regular',
        good: 'Bom',
        excellent: 'Excelente'
      },
      issues: 'Problemas de Sono',
      issueOptions: {
        insomnia: 'Insonia',
        snoring: 'Ronco',
        apnea: 'Apneia do Sono',
        restlessLegs: 'Pernas Inquietas',
        nightmares: 'Pesadelos'
      },
      regularSchedule: 'Horario Regular de Sono?',
      yes: 'Sim',
      no: 'Nao'
    },
    stress: {
      title: 'Estresse',
      level: 'Nivel de Estresse',
      levelOptions: {
        veryLow: 'Muito Baixo',
        low: 'Baixo',
        moderate: 'Moderado',
        high: 'Alto',
        veryHigh: 'Muito Alto'
      },
      sources: 'Fontes de Estresse',
      sourceOptions: {
        work: 'Trabalho',
        finances: 'Financas',
        relationships: 'Relacionamentos',
        health: 'Saude',
        family: 'Familia',
        other: 'Outro'
      },
      coping: 'Mecanismos de Enfrentamento',
      copingOptions: {
        exercise: 'Exercicio',
        meditation: 'Meditacao',
        therapy: 'Terapia',
        hobbies: 'Hobbies',
        socialSupport: 'Apoio Social'
      },
      mentalHealth: 'Voce se sentiu ansioso ou deprimido recentemente?',
      mentalHealthOptions: {
        no: 'Nao',
        sometimes: 'As vezes',
        yes: 'Sim'
      }
    },
    alcoholTobacco: {
      title: 'Alcool e Tabaco',
      smoking: 'Status de Tabagismo',
      smokingOptions: {
        never: 'Nunca',
        former: 'Ex-fumante',
        current: 'Fumante Atual'
      },
      cigarettesPerDay: 'Cigarros por Dia',
      yearsSmoking: 'Anos Fumando',
      alcohol: 'Consumo de Alcool',
      alcoholOptions: {
        never: 'Nunca',
        occasionally: 'Ocasionalmente',
        weekly: 'Semanalmente',
        daily: 'Diariamente'
      },
      drinksPerWeek: 'Doses por Semana',
      drinkOptions: {
        light: '1-3',
        moderate: '4-7',
        heavy: '8-14',
        excessive: '15+'
      },
      substances: 'Uso de Substancias',
      substanceOptions: {
        preferNotToAnswer: 'Prefiro nao responder',
        no: 'Nao',
        yes: 'Sim'
      },
      healthImpact: 'Fumar e beber em excesso aumentam significativamente os riscos a saude.'
    },
    waterIntake: {
      title: 'Hidratacao',
      dailyWater: 'Consumo Diario de Agua',
      waterOptions: {
        low: 'Menos de 1L',
        moderate: '1-2L',
        good: '2-3L',
        excellent: '3L+'
      },
      caffeine: 'Consumo de Cafeina',
      caffeineOptions: {
        none: 'Nenhum',
        low: '1-2 xicaras',
        moderate: '3-4 xicaras',
        high: '5+ xicaras'
      },
      sugaryDrinks: 'Bebidas Acucaradas',
      sugaryOptions: {
        never: 'Nunca',
        rarely: 'Raramente',
        daily: 'Diariamente',
        multiple: 'Varias vezes ao dia'
      },
      tip: 'Beber pelo menos 2 litros de agua por dia ajuda na saude geral.'
    },
    healthGoals: {
      title: 'Objetivos de Saude',
      subtitle: 'Selecione seus principais objetivos',
      selectPriorities: 'Selecione ate 3 prioridades',
      goals: {
        weightLoss: 'Perda de Peso',
        fitness: 'Condicionamento Fisico',
        sleepImprovement: 'Melhorar o Sono',
        stressManagement: 'Gerenciar Estresse',
        nutrition: 'Nutricao',
        diseasePrevention: 'Prevencao de Doencas',
        mentalHealth: 'Saude Mental',
        energy: 'Mais Energia',
        flexibility: 'Flexibilidade'
      }
    },
    mentalScreening: {
      title: 'Triagem de Saude Mental',
      subtitle: 'Responda com base nas ultimas 2 semanas',
      question1: 'Pouco interesse ou prazer em fazer as coisas',
      question2: 'Sentir-se para baixo, deprimido ou sem esperanca',
      options: {
        notAtAll: 'De jeito nenhum',
        severalDays: 'Varios dias',
        moreThanHalf: 'Mais da metade dos dias',
        nearlyEvery: 'Quase todos os dias'
      },
      note: 'Suas respostas sao confidenciais e ajudam seu medico.'
    },
    moodAssessment: {
      title: 'Avaliacao de Humor',
      overallMood: 'Como voce descreveria seu humor geral?',
      moodLevels: {
        veryHappy: 'Muito Feliz',
        happy: 'Feliz',
        neutral: 'Neutro',
        sad: 'Triste',
        verySad: 'Muito Triste'
      },
      moodFrequency: 'Com que frequencia voce se sente assim?',
      frequencyOptions: {
        always: 'Sempre',
        often: 'Frequentemente',
        sometimes: 'As vezes',
        rarely: 'Raramente'
      },
      recentChanges: 'Mudancas recentes de humor?',
      sleepImpact: 'O sono afeta seu humor?',
      yes: 'Sim',
      sometimes: 'As vezes',
      no: 'Nao'
    },
    anxietyScale: {
      title: 'Escala de Ansiedade',
      subtitle: 'Responda com base nas ultimas 2 semanas',
      question1: 'Sentir-se nervoso, ansioso ou no limite',
      question2: 'Nao conseguir parar ou controlar a preocupacao',
      options: {
        notAtAll: 'De jeito nenhum',
        severalDays: 'Varios dias',
        moreThanHalf: 'Mais da metade dos dias',
        nearlyEvery: 'Quase todos os dias'
      },
      triggersTitle: 'Gatilhos de Ansiedade',
      triggers: {
        work: 'Trabalho',
        social: 'Social',
        health: 'Saude',
        finances: 'Financas',
        relationships: 'Relacionamentos'
      }
    },
    reproductiveHealth: {
      title: 'Saude Reprodutiva',
      subtitle: 'Secao opcional — pode pular',
      skip: 'Pular esta secao',
      pregnancy: 'Status de Gravidez',
      pregnancyOptions: {
        notApplicable: 'Nao se aplica',
        notPregnant: 'Nao gravida',
        pregnant: 'Gravida',
        trying: 'Tentando engravidar'
      },
      lastCheckup: 'Ultimo Exame',
      checkupOptions: {
        lessThan1: 'Menos de 1 ano',
        oneToTwo: '1-2 anos',
        twoToThree: '2-3 anos',
        moreThan3: '3+ anos'
      },
      contraception: 'Usa Contraceptivo?',
      menstrualRegularity: 'Regularidade Menstrual',
      regularityOptions: {
        regular: 'Regular',
        irregular: 'Irregular',
        notApplicable: 'Nao se aplica'
      },
      yes: 'Sim',
      no: 'Nao',
      notApplicable: 'Nao se aplica'
    },
    chronicPain: {
      title: 'Dor Cronica',
      hasPain: 'Voce tem dor cronica?',
      yes: 'Sim',
      no: 'Nao',
      locationTitle: 'Localizacao da Dor',
      locations: {
        head: 'Cabeca',
        neck: 'Pescoco',
        back: 'Costas',
        shoulders: 'Ombros',
        knees: 'Joelhos',
        hips: 'Quadril',
        hands: 'Maos',
        feet: 'Pes'
      },
      severityTitle: 'Intensidade da Dor',
      frequencyTitle: 'Frequencia da Dor',
      frequencyOptions: {
        daily: 'Diaria',
        weekly: 'Semanal',
        monthly: 'Mensal',
        rarely: 'Raramente'
      },
      impactTitle: 'Impacto no Dia a Dia',
      impactOptions: {
        none: 'Nenhum',
        mild: 'Leve',
        moderate: 'Moderado',
        severe: 'Severo'
      }
    },
    vaccination: {
      title: 'Vacinacao',
      covidTitle: 'COVID-19',
      covidOptions: {
        notVaccinated: 'Nao Vacinado',
        partial: 'Parcial',
        fully: 'Totalmente',
        boosted: 'Com Reforco'
      },
      fluTitle: 'Vacina da Gripe este ano?',
      otherVaccines: 'Outras vacinas em dia?',
      vaccinationCard: 'Carteira de vacinacao disponivel?',
      yes: 'Sim',
      no: 'Nao',
      unsure: 'Nao tenho certeza'
    },
    insuranceInfo: {
      title: 'Informacoes do Plano',
      hasInsurance: 'Possui plano de saude?',
      yes: 'Sim',
      no: 'Nao',
      providerName: 'Nome da Operadora',
      providerPlaceholder: 'Ex: Unimed, Bradesco Saude',
      planType: 'Tipo de Plano',
      planOptions: {
        basic: 'Basico',
        standard: 'Padrao',
        premium: 'Premium'
      },
      memberId: 'Numero da Carteirinha',
      memberPlaceholder: 'Numero do plano',
      coverageTitle: 'Cobertura',
      coverage: {
        medical: 'Medica',
        dental: 'Odontologica',
        vision: 'Oftalmologica'
      }
    },
    emergencyContacts: {
      title: 'Contatos de Emergencia',
      subtitle: 'Adicione pelo menos um contato',
      contactName: 'Nome do Contato',
      namePlaceholder: 'Nome completo',
      relationship: 'Parentesco',
      relationshipOptions: {
        spouse: 'Conjuge',
        parent: 'Pai/Mae',
        sibling: 'Irmao/Irma',
        child: 'Filho/Filha',
        friend: 'Amigo/Amiga',
        other: 'Outro'
      },
      phone: 'Telefone',
      phonePlaceholder: '(11) 99999-9999',
      addSecondary: 'Adicionar Contato Secundario',
      secondaryContact: 'Contato Secundario'
    },
    consentPrivacy: {
      title: 'Consentimento e Privacidade',
      subtitle: 'Seus dados estao protegidos',
      consent1: 'Concordo em compartilhar meus dados de saude com minha equipe medica',
      consent2: 'Aceito receber insights e recomendacoes de saude',
      consent3: 'Entendo que meus dados sao protegidos pela LGPD',
      dataUsage: 'Como seus dados serao usados',
      dataUsageText: 'Seus dados de saude sao criptografados e usados apenas para gerar recomendacoes personalizadas.',
      privacyPolicy: 'Ver Politica de Privacidade'
    },
    reviewSummary: {
      title: 'Revisao da Avaliacao',
      subtitle: 'Revise suas respostas antes de enviar',
      sections: {
        personalInfo: 'Informacoes Pessoais',
        healthConditions: 'Condicoes de Saude',
        lifestyle: 'Estilo de Vida',
        mentalHealth: 'Saude Mental',
        goals: 'Objetivos'
      },
      edit: 'Editar',
      confirmData: 'Confirmo que as informacoes estao corretas'
    },
    submissionConfirm: {
      title: 'Avaliacao Enviada',
      successMessage: 'Sua avaliacao de saude foi enviada com sucesso!',
      processingTime: 'Tempo estimado de processamento: 24-48 horas',
      nextSteps: 'Proximos Passos',
      step1: 'Seu medico revisara os resultados',
      step2: 'Um plano personalizado sera criado',
      step3: 'Voce recebera notificacoes com atualizacoes',
      viewResults: 'Ver Meus Resultados'
    },
    resultsHealthScore: {
      title: 'Sua Pontuacao de Saude',
      overallScore: 'Pontuacao Geral',
      breakdown: 'Detalhamento',
      categories: {
        physical: 'Fisico',
        nutrition: 'Nutricao',
        mental: 'Mental',
        lifestyle: 'Estilo de Vida'
      },
      scoreLabels: {
        excellent: 'Excelente',
        good: 'Bom',
        fair: 'Regular',
        needsAttention: 'Precisa de Atencao'
      },
      viewRecommendations: 'Ver Recomendacoes',
      shareWithDoctor: 'Compartilhar com Medico'
    }
  },
  errorScreens: {
    noInternet: {
      title: 'Sem Conexao com a Internet',
      description: 'Verifique sua conexao e tente novamente.',
      retry: 'Tentar Novamente',
      cachedData: 'Alguns dados em cache podem estar disponiveis'
    },
    server: {
      title: 'Algo Deu Errado',
      description: 'Nossos servidores estao com problemas. Tente novamente em alguns minutos.',
      retry: 'Tentar Novamente',
      contactSupport: 'Falar com Suporte'
    },
    maintenance: {
      title: 'Em Manutencao',
      description: 'Estamos fazendo melhorias. Voltaremos em breve.',
      scheduledTime: 'Previsao de retorno as {{time}}',
      notifyMe: 'Avisar quando voltar'
    },
    forceUpdate: {
      title: 'Atualizacao Necessaria',
      description: 'Uma nova versao do AUSTA esta disponivel. Atualize para continuar.',
      currentVersion: 'Versao Atual',
      requiredVersion: 'Versao Necessaria',
      updateNow: 'Atualizar Agora'
    }
  }
};

export default translations;