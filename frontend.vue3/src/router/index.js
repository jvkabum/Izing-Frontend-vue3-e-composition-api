import { createRouter, createWebHashHistory } from 'vue-router'
import { useQuasar } from 'quasar'
import routes from './routes'

const whiteListName = ['login']

const router = createRouter({
  history: createWebHashHistory(process.env.VUE_ROUTER_BASE),
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes
})

// Guarda de navegação global
router.beforeEach((to, from, next) => {
  const $q = useQuasar()
  const token = JSON.parse(localStorage.getItem('token'))

  if (!token) {
    if (!whiteListName.includes(to.name)) {
      if (to.fullPath !== '/login' && !to.query.tokenSetup) {
        $q.notify({ 
          message: 'Necessário realizar login',
          position: 'top',
          type: 'warning'
        })
        next({ name: 'login' })
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

// Hook após navegação
router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
