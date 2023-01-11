import './app'
import './shared/api'
import MainPage from './pages/mainpage'
import DetailPage from './pages/detailpage'
import WritePage from './pages/writepage'
import notFoundPage from './pages/notFoundpage'

import '../styles/index.scss'

type Route = {
  path: string
  component: any
}

class App {
  private data: any
  constructor(element?: HTMLElement) {}

  // 화면에 템플릿을 그려주는 함수
  static render(template: string) {
    const body = document.querySelector('body')! as HTMLElement
    body.innerHTML = template
  }
}

class Router {
  constructor() {
    // pushState로 페이지 이동할때마다 해당하는 콘솔이 찍히게 한다.
    const routes = [
      {
        path: '/',
        component: () => console.log('메인페이지!'),
      },
      {
        path: '/write',
        component: () => console.log('작성하기 페이지!'),
      },
      {
        path: '/edit',
        component: () => console.log('메인페이지!'),
      },
    ]

    let match = routes.find((route) => route.path === location.pathname)
    console.log(match)
    const button = document.querySelector('.button')
    button?.addEventListener('click', () => {
      let match = routes.find((route) => route.path === location.pathname)

      Router.navigate('/write')
      match?.component()
    })

    match?.component()
  }

  static navigate(url?: string) {
    history.pushState('null', 'null', url)
  }

  static back() {
    history.back()
  }
}

const routes: Route[] = [
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

const router = (routes: Route[]) => {
  const match = routes.map((route) => {
    return {
      route,
      isMatch: route.path === location.pathname,
    }
  })

  const target = match.find((item) => item.isMatch === true)
  console.log(target)

  const root = document.querySelector('#root')! as HTMLElement
  if (target) {
    const obj = new target.route.component()
    root.innerHTML = obj.render()
    const toMain = document.querySelector('.toMain')
    toMain?.addEventListener('click', () => {
      history.pushState('null', 'null', '/')
      router(routes)
    })
    const toWrite = document.querySelector('.toWrite')
    const toDetail = document.querySelector('.toDetail')
    toWrite?.addEventListener('click', () => {
      history.pushState('null', 'null', '/write')
      router(routes)
    })
    toDetail?.addEventListener('click', () => {
      history.pushState('null', 'null', '/detail')
      router(routes)
    })
  } else {
    const obj = new notFoundPage()
    root.innerHTML = obj.render()
    const toMain = document.querySelector('.toMain')
    toMain?.addEventListener('click', () => {
      history.pushState('null', 'null', '/')
      router(routes)
    })
  }
}

// const toWrite = document.querySelector('.toWrite')
// const toDetail = document.querySelector('.toDetail')
// const toMain = document.querySelector('.toMain')

// toWrite?.addEventListener('click', () => {
//   history.pushState('null', 'null', '/write')
//   router(routes)
// })
// toDetail?.addEventListener('click', () => {
//   history.pushState('null', 'null', '/detail')
//   router(routes)
// })
// toMain?.addEventListener('click', () => {
//   history.pushState('null', 'null', '/')
//   router(routes)
// })

window.addEventListener('popstate', (e) => {
  console.log(e)
  router(routes)
})

// new App(document.getElementById('root')! as HTMLElement)

window.addEventListener('DOMContentLoaded', () => {
  router(routes)
})
