// Menu principal para usuários normais e admin
export const menuData = [
  {
    title: 'Painel de Controle',
    caption: '',
    icon: 'mdi-home',
    routeName: 'home-dashboard'
  },
  {
    title: 'Chat',
    caption: 'Lista de atendimentos',
    icon: 'mdi-whatsapp',
    routeName: 'atendimento'
  },
  {
    title: 'Contatos',
    caption: 'Lista de contatos',
    icon: 'mdi-contacts-outline',
    routeName: 'contatos'
  }
]

// Menu adicional para administradores
export const menuDataAdmin = [
  {
    title: 'Conexões',
    caption: 'Canais de Comunicação',
    icon: 'mdi-cellphone-wireless',
    routeName: 'sessoes'
  },
  {
    title: 'Painel Atendimentos',
    caption: 'Visão geral dos atendimentos',
    icon: 'mdi-view-dashboard-variant',
    routeName: 'painel-atendimentos'
  },
  {
    title: 'Relatórios',
    caption: 'Relatórios gerais',
    icon: 'mdi-file-chart',
    routeName: 'relatorios'
  },
  {
    title: 'Usuários',
    caption: 'Admin de usuários',
    icon: 'mdi-account-group',
    routeName: 'usuarios'
  },
  {
    title: 'Filas',
    caption: 'Cadastro de Filas',
    icon: 'mdi-arrow-decision-outline',
    routeName: 'filas'
  },
  {
    title: 'Mensagens Rápidas',
    caption: 'Mensagens pré-definidas',
    icon: 'mdi-reply-all-outline',
    routeName: 'mensagens-rapidas'
  },
  {
    title: 'Chatbot',
    caption: 'Robô de atendimento',
    icon: 'mdi-robot',
    routeName: 'chat-flow'
  },
  {
    title: 'Etiquetas',
    caption: 'Cadastro de etiquetas',
    icon: 'mdi-tag-text',
    routeName: 'etiquetas'
  },
  {
    title: 'Horário de Atendimento',
    caption: 'Horário de funcionamento',
    icon: 'mdi-calendar-clock',
    routeName: 'horarioAtendimento'
  },
  {
    title: 'Configurações',
    caption: 'Configurações gerais',
    icon: 'mdi-cog',
    routeName: 'configuracoes'
  },
  {
    title: 'Campanha',
    caption: 'Campanhas de envio',
    icon: 'mdi-message-bookmark-outline',
    routeName: 'campanhas'
  },
  {
    title: 'API',
    caption: 'Integração sistemas externos',
    icon: 'mdi-call-split',
    routeName: 'api-service'
  }
]

// Menu para super usuários
export const menuDataSuper = [
  {
    title: 'Empresas',
    caption: 'Admin das Empresas',
    icon: 'mdi-office-building',
    routeName: 'empresassuper'
  },
  {
    title: 'Usuários',
    caption: 'Admin de usuários',
    icon: 'mdi-account-group',
    routeName: 'usuariossuper'
  },
  {
    title: 'Conexões',
    caption: 'Canais de Comunicação',
    icon: 'mdi-cellphone-wireless',
    routeName: 'sessaosuper'
  }
]

// Função auxiliar para verificar problemas de conexão
export const checkConnectionProblems = (whatsapps) => {
  return whatsapps.some(w => 
    ['PAIRING', 'TIMEOUT', 'DISCONNECTED'].includes(w.status)
  )
}

// Função para atualizar menu com status de conexão
export const updateMenuWithConnectionStatus = (menu, hasConnectionProblems) => {
  if (hasConnectionProblems) {
    return menu.map(item => {
      if (item.routeName === 'sessoes') {
        return {
          ...item,
          color: 'negative'
        }
      }
      return item
    })
  }
  return menu
}

// Função para verificar acesso a menus beta
export const checkBetaAccess = (email, experimentalDomains = ['@']) => {
  if (!email) return false
  return experimentalDomains.some(domain => 
    email.toLowerCase().includes(domain.toLowerCase())
  )
}
