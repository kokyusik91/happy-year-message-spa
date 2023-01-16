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

  private handleAfterFetch(res: Response, callBackFunc?: () => void) {
    if (!res.ok) {
      throw new Error('There is something wrong... in Network')
    }
    callBackFunc && callBackFunc()
    return res.json()
  }

  public async get(url: string, callBackFunc?: () => void) {
    return await fetch(url, {
      headers: this.headers,
    }).then((res) => this.handleAfterFetch(res, callBackFunc))
  }

  public async post<T>(url: string, data: T, callBackFunc?: () => void) {
    return await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    }).then((res) => this.handleAfterFetch(res, callBackFunc))
  }

  public async patch<T>(url: string, data: T, callBackFunc?: () => void) {
    return await fetch(url, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data),
    }).then((res) => this.handleAfterFetch(res, callBackFunc))
  }

  public async delete<T>(url: string, callBackFunc?: () => void) {
    return await fetch(url, {
      method: 'DELETE',
      headers: this.headers,
    }).then((res) => this.handleAfterFetch(res, callBackFunc))
  }
}

export const fetchInstance = new Fetch()
