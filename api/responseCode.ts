type Code = {
  code: number;
  info: string;
  message?: string;
}

//信息响应 (100–199)
const infoCode: Code[] = [
  {
    code: 100,
    message: '这个临时响应表明，迄今为止的所有内容都是可行的，客户端应该继续请求，如果已经完成，则忽略它。',
    info: '已完成'
  },
  {
    code: 101,
    message: '该代码是响应客户端的请求头发送的，指明服务器即将切换的协议。',
    info: ''
  },
  {
    code: 102,
    message: '此代码表示服务器已收到并正在处理该请求，但当前没有响应可用。',
    info: '无响应可用'
  },
  {
    code: 103,
    message: '此状态代码主要用于与 Link 链接头一起使用，以允许用户代理在服务器准备响应阶段时开始预加载 preloading 资源。',
    info: ''
  }
];

//成功响应 (200–299)
const successCode: Code[] = [
  {
    code: 200,
    message: '请求成功',
    info: '请求成功'
  }
];

//重定向消息 (300–399)
const redirectCode: Code[] = [
  {
    code: 300,
    message: '请求拥有多个可能的响应。用户代理或者用户应当从中选择一个。',
    info: '多个响应'
  },
  {
    code: 301,
    message: '请求资源的URL已永久更改。在响应中给出了新的URL。',
    info: '地址已变更'
  },
  {
    code: 302,
    message: '此响应代码表示所请求资源的URI已暂时更改。未来可能会对URI进行进一步的改变。',
    info: '地址将要变更'
  },
  {
    code: 304,
    message: '这是用于缓存的目的。它告诉客户端响应还没有被修改，因此客户端可以继续使用相同的缓存版本的响应。',
    info: '缓存'
  },
];

//客户端错误响应 (400–499)
const clientCode: Code[] = [
  {
    code: 400,
    message: '由于被认为是客户端错误（例如，错误的请求语法、无效的请求消息帧或欺骗性的请求路由），服务器无法或不会处理请求。',
    info: ''
  },
  {
    code: 401,
    message: '虽然 HTTP 标准指定了"unauthorized"，但从语义上来说，这个响应意味着"unauthenticated"。也就是说，客户端必须对自身进行身份验证才能获得请求的响应。',
    info: '未授权'
  },
  {
    code: 403,
    message: '客户端没有访问内容的权限；也就是说，它是未经授权的，因此服务器拒绝提供请求的资源。与 401 Unauthorized 不同，服务器知道客户端的身份。',
    info: '无权访问资源'
  },
  {
    code: 404,
    message: '服务器找不到请求的资源。在浏览器中，这意味着无法识别 URL。在 API 中，这也可能意味着端点有效，但资源本身不存在。',
    info: '找不到资源'
  },
  {
    code: 405,
    message: '服务器知道请求方法，但目标资源不支持该方法。',
    info: '请求method不被允许'
  },
  {
    code: 429,
    message: '用户在给定的时间内发送了太多请求("限制请求速率")',
    info: '请求次数过多'
  }
];

//服务端错误响应 (500–599)
const serverCode: Code[] = [
  {
    code: 500,
    message: '服务器遇到了不知道如何处理的情况。',
    info: '服务器错误'
  },
  {
    code: 501,
    message: '服务器不支持请求方法，因此无法处理。',
    info: '无法处理请求'
  },
  {
    code: 502,
    message: '此错误响应表明服务器作为网关需要得到一个处理这个请求的响应，但是得到一个错误的响应。',
    info: '网关错误'
  },
  {
    code: 503,
    message: '服务器没有准备好处理请求。常见原因是服务器因维护或重载而停机。请注意，与此响应一起，应发送解释问题的用户友好页面。',
    info: ''
  },
  {
    code: 504,
    message: '当服务器充当网关且无法及时获得响应时，会给出此错误响应。',
    info: '网关超时'
  },
];


export class ResponseCode {
  code: number;
  infoCode: Code[];
  successCode: Code[];
  clientCode: Code[];
  serverCode: Code[];
  redirectCode: Code[];

  constructor(code: number, infoList?: Code[], successList?: Code[], redirectList?: Code[], clientList?: Code[], serverList?: Code[]) {
    this.code = code;
    this.infoCode = infoList || infoCode;
    this.successCode = successList || successCode;
    this.redirectCode = redirectList || redirectCode;
    this.clientCode = clientList || clientCode;
    this.serverCode = serverList || serverCode;
  }

  returnCodeList(): Code[] {
    if (this.code >= 100 && this.code < 200) {
      return this.infoCode;
    } else if (this.code >= 200 && this.code < 300) {
      return this.successCode;
    } else if (this.code >= 300 && this.code < 400) {
      return this.redirectCode;
    } else if (this.code >= 400 && this.code < 500) {
      return this.clientCode;
    } else if (this.code >= 500 && this.code < 600) {
      return this.serverCode;
    } else {
      return [];
    }
  }

  backMessage(): string {
    const currentList = this.returnCodeList();
    const item = currentList.find(e => e.code === this.code);
    if (item) {
      return item.info;
    } else {
      return '未知';
    }
  }
}
