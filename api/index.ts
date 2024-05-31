import { MessageManager } from "~/plugins/message.client";

const baseURL: string = import.meta.env.VITE_PROJECT_API + '/api';
const { loginPath } = routerMap;

function getToken(): string {
  const localStorage = new StorageSuger("localStorage");
  const sectionStorage = new StorageSuger("sessionStorage");
  
  const token1 = localStorage.getValue("token") as string;
  const token2 = sectionStorage.getValue("token") as string;
  const res = token1 
  ? 'Bearer ' + token1 
  : token2 
    ? 'Bearer ' + token2 
    : 'Bearer';

  return res.replaceAll("\"", "");
}

export async function http(url: string, options: Record<string, any>) {
  const { data, pending, error, refresh } = await useFetch(
    url, 
    {
      baseURL,
      method: options.method,
      params: options.params,
      body: options.body,
      onRequest({ request, options }) {
        // Set the request headers
        options.headers = options.headers || {}
      },
      onRequestError({ request, options, error }) {
        // Handle the request errors
      },
      onResponse({ request, response, options }) {
        // Process the response data
        // localStorage.setItem('token', response._data.token)
      },
      onResponseError({ request, response, options }) {
        // Handle the response errors
      }
    }
  );

  return {
    data, pending, error, refresh
  }
}

export async function httpClient<T>(url: string, options: Record<string, any>): Promise<ResponseModel<T>> {
  // let tokenString: string;
  // try {
  //   tokenString = getToken()
  // } catch(e) {
  //   console.log(e);
  // }

  return await $fetch(
    url, 
    {
      baseURL,
      credentials: 'include',
      method: options.method,
      params: options.params,
      body: options.body,
      onRequest({ request, options }) {
        // options.headers = {
        //   Authorization: tokenString
        // }
      },
      onRequestError({ request, options, error, response }) {
        if (response === undefined && error) {
          MessageManager.show({
            type: 'error',
            message: '请求超时'
          });
        }
      },
      onResponse({ request, response, options }) {
        if (response.status === 401) {
          MessageManager.show({
            type: 'error',
            message: '请先登录'
          });

          navigateTo({ path: loginPath });
        }
        
        // if (response.headers.get('Access-Token')) {
        //   response._data.tokenObject = {
        //     token: response.headers.get('Access-Token'),
        //     refreshToken: response.headers.get('X-Access-Token')
        //   }
        // }
      },
      onResponseError({ request, response, options }) {
        // Handle the response errors
      }
    }
  );
}
