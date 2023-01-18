import MainPage from './pages/mainpage'
import DetailPage from './pages/detailpage'
import WritePage from './pages/writepage'
import EditPage from './pages/editPage'

import '/assets/images/error.jpg'
import '../styles/index.scss'
import Router from './router'

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

// 라우터 인스턴스화
export const routerInstance = new Router(
  routes,
  document.getElementById('root')! as HTMLElement,
)
