interface IFetch {
  get(url: string, callBackFunc?: () => void): Promise<any>
  post<T>(url: string, data: T, callBackFunc?: () => void): Promise<any>
  patch<T>(url: string, data: T, callBackFunc?: () => void): Promise<any>
  delete(url: string, callBackFunc?: () => void): Promise<any>
}

class Fetch implements IFetch {
  private headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }

  private async handleAfterFetch(res: Response, callBackFunc?: () => void) {
    if (res.ok) {
      callBackFunc && callBackFunc()
      return res.json()
      // 만약 다른 에러라고 하면??
    } else if (res.status !== 200 || 201) {
      const error = await res.json()
      return Promise.reject(error)
    } else throw new Error('Network has something wrong......... 📡')
  }

  public async get(url: string, callBackFunc?: () => void) {
    return await fetch(url, {
      headers: this.headers,
    })
      .then((res) => this.handleAfterFetch(res, callBackFunc))
      .catch((err) => {
        throw new Error(`${err.message}`)
      })
  }

  public async post<T>(url: string, data: T, callBackFunc?: () => void) {
    return await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    })
      .then((res) => this.handleAfterFetch(res, callBackFunc))
      .catch((err) => {
        throw new Error(`${err.message}`)
      })
  }

  public async patch<T>(url: string, data: T, callBackFunc?: () => void) {
    return await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data),
    })
      .then((res) => this.handleAfterFetch(res, callBackFunc))
      .catch((err) => {
        throw new Error(`${err.message}`)
      })
  }

  public async delete(url: string, callBackFunc?: () => void) {
    return await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    })
      .then((res) => this.handleAfterFetch(res, callBackFunc))
      .catch((err) => {
        throw new Error(`${err.message}`)
      })
  }
}

export const fetchInstance = new Fetch()
