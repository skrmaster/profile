import { MessageManager } from "~/plugins/message.client";

const baseURL: string = import.meta.env.VITE_PROJECT_API + '/api';
const { userInfoPath } = apiMap;

function noAuthPath(fullPath: string): boolean {
  const noAuth = [userInfoPath];
  const parsedUrl = new URL(fullPath);
  const path = parsedUrl.pathname;
  const item = noAuth.find(e => ('/api' + e) === path);
  return !!item;
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

export async function httpClient<T>(
  url: string, 
  options: Record<string, any>
): Promise<ResponseModel<T>> {
  return await $fetch(
    url, 
    {
      baseURL,
      credentials: 'include',
      method: options.method,
      params: options.params,
      body: options.body,
      onRequest({ request, options }) {

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
        if (response.status === 401 && !noAuthPath(request as string)) {
          MessageManager.show({
            type: 'error',
            message: '请先登录'
          });

          setTimeout(() => {
            navigateTo({ path: routerMap.loginPath });
          }, 1000);
        }

        if (response.status === 429) {
          MessageManager.show({
            type: 'error',
            message: '请求次数过多，请稍后再试'
          });
        }
      },
      onResponseError({ request, response, options }) {

      }
    }
  );
}
