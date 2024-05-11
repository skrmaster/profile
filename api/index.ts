const baseURL: string = import.meta.env.VITE_PROJECT_API + '/api';

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

export async function httpClient<T>(url: string, options: Record<string, any>): Promise<responseModel<T>> {
  let tokenString: tokenType;

  return await $fetch(
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
        response._data.tokenObject = {
          token: response.headers.get('Access-Token'),
          refreshToken: response.headers.get('X-Access-Token')
        }
        
        // Process the response data
        // localStorage.setItem('token', response._data.token)
      },
      onResponseError({ request, response, options }) {
        // Handle the response errors
      }
    }
  );
}
