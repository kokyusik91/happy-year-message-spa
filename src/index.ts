import MainPage from './pages/mainpage'
import DetailPage from './pages/detailpage'
import WritePage from './pages/writepage'
import notFoundPage from './pages/notFoundpage'
import { Route, Replace } from './types/index'

import '../styles/index.scss'

const routes = [
  {
    path: '/',
    page: MainPage,
  },
  {
    path: '/write',
    page: WritePage,
  },
  {
    path: '/post/:id',
    page: DetailPage,
  },
  {
    path: '/edit/:id',
    page: DetailPage,
  },
]

class Router {
  constructor(private mainRoute: Route[], private root: HTMLElement) {
    // 뒤로 가기 했을때, 앞으로 가기 했을때
    window.addEventListener('popstate', (e) => {
      this.router()
    })
    // 새로고침해도 해당페이지로 이동
    window.addEventListener('DOMContentLoaded', () => {
      this.router()
    })
  }
  // 페이지 이동할때 쓸 함수
  public navigate(url: string, replaceOption?: Replace) {
    if (replaceOption?.replace) {
      history.replaceState('null', 'null', url)
    } else history.pushState('null', 'null', url)
    this.router()
  }

  public handleNavigateBack() {
    history.back()
  }

  private async router() {
    const advancedRoutes = this.mainRoute?.map((route) => {
      return {
        route,
        isMatch: route.path === window.location.pathname,
      }
    })

    const targetPage = advancedRoutes.find((targetRoute) => targetRoute.isMatch)

    if (targetPage) {
      // 실제 타켓 페이지 인스턴스화
      const pageInstance = new targetPage.route.page(this.root)
      await pageInstance.render()
    } else {
      new notFoundPage(this.root).render()
    }
  }
}
// 라우터 인스턴스화
export const routerInstance = new Router(
  routes,
  document.getElementById('root')! as HTMLElement,
)
