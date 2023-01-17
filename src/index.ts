import MainPage from './pages/mainpage'
import DetailPage from './pages/detailpage'
import WritePage from './pages/writepage'
import EditPage from './pages/editPage'
import notFoundPage from './pages/notFoundpage'
import { Route, Replace, TargetPage } from './types/index'

import '/assets/images/error.jpg'
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
    page: EditPage,
  },
]

class Router {
  constructor(private mainRoute: Route[], private root: HTMLElement) {
    // 뒤로 가기 했을때, 앞으로 가기 했을때
    window.addEventListener('popstate', () => {
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
      history.replaceState(null, 'null', url)
    } else history.pushState(null, 'null', url)
    this.router()
  }

  public handleNavigateBack() {
    history.back()
  }

  private pathToRegex(path: string) {
    return new RegExp(
      '^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$',
    )
  }

  private getParams(targetPage: TargetPage) {
    const values = targetPage?.result?.slice(1)
    const keys = Array.from(targetPage.route.path.matchAll(/:(\w+)/g)).map(
      (result) => result[1],
    )

    const paramsObj = Object.fromEntries(
      keys.map((key, index) => {
        return [key, values && values[index]]
      }),
    )

    return paramsObj
  }

  private async router() {
    const advancedRoutes = this.mainRoute?.map((route) => {
      return {
        route,
        result: location.pathname.match(this.pathToRegex(route.path)),
      }
    })

    let targetPage = advancedRoutes.find(
      (targetRoute) => targetRoute.result !== null,
    )

    if (targetPage) {
      // 실제 타켓 페이지 인스턴스화
      const pageInstance = new targetPage.route.page(
        this.root,
        this.getParams(targetPage),
      )
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
