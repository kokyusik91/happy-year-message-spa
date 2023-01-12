import MainPage from './pages/mainpage'
import DetailPage from './pages/detailpage'
import WritePage from './pages/writepage'
import notFoundPage from './pages/notFoundpage'
import { Route } from './types/index'

import '../styles/index.scss'

const routes = [
  {
    path: '/',
    component: MainPage,
  },
  {
    path: '/write',
    component: WritePage,
  },
  {
    path: '/detail',
    component: DetailPage,
  },
]

class Router {
  constructor(private mainRoute: Route[], private root: HTMLElement) {
    window.addEventListener('popstate', (e) => {
      this.router()
    })
    window.addEventListener('DOMContentLoaded', () => {
      this.router()
    })
  }

  public navigate(url?: string) {
    history.pushState('null', 'null', url)
    this.router()
  }

  private router() {
    const advancedRoutes = this.mainRoute?.map((route) => {
      return {
        route,
        isMatch: route.path === window.location.pathname,
      }
    })

    const targetPage = advancedRoutes.find((targetRoute) => targetRoute.isMatch)

    if (targetPage) {
      // 실제 타켓 페이지 인스턴스화
      const componentInstance = new targetPage.route.component(this.root)
      componentInstance.render()
    } else {
      this.root.innerHTML = new notFoundPage().render()
    }
  }
}

export const routerInstance = new Router(
  routes,
  document.getElementById('root')! as HTMLElement,
)
