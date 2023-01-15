class Fetch {
  private headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }

  private handleAfterFetch(res: Response, callBackFunc?: () => void) {
    if (res.ok) {
      callBackFunc && callBackFunc()
      return res.json()
    } else
      throw new Error('There is something wrong... because of network issue 📡')
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
