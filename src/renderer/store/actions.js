import { Client } from '@/services/api'
import storage from '@/services/storage'

function normalizeMessage (data) {
  const talking = [data.prioridade, (data.siglaSenha + ('000' + data.numeroSenha).slice(-3)), data.local, data.numeroLocal]
  return {
    id: data.id,
    type: 'ticket',
    title: data.siglaSenha + ('000' + data.numeroSenha).slice(-3),
    subtitle: data.local + ' ' + ('00' + data.numeroLocal).slice(-2),
    description: data.prioridade,
    local: data.local,
    numeroLocal: ('00' + data.numeroLocal).slice(-2),
    falar: talking,
    $data: data
  }
}

export const loadConfig = ({ commit }) => {
  const config = storage.get('config', {})
  commit('updateConfig', config)
}

export const saveConfig = ({ commit }, config) => {
  commit('updateConfig', config)
}

export const fetchMessages = ({ state, commit }) => {
  return new Promise((resolve, reject) => {
    const api = new Client(state.config.server)
    api
      .messages(state.auth.accessToken, state.config.unity, state.config.services)
      .then(messages => {
        if (messages.length) {
          const last = normalizeMessage(messages[0])
          commit('newMessage', last)
        }
        resolve()
      }, reject)
      .catch(reject)
  })
}
