import { Middleware, MiddlewareArg, ClientResponse } from "./common-types";
import { CommonRequest } from "./local-common-types";

export class ApiRequest<O> {
  private middleware: Middleware;
  constructor(
    private readonly commonRequest: CommonRequest<any>,
    middlewares: Middleware[]
  ) {
    if (!middlewares || middlewares.length == 0) {
      middlewares = [noOpMiddleware];
    }
    this.middleware = middlewares.reduce(reduceMiddleware);
  }

  async execute(): Promise<ClientResponse<O>> {
    const { body, headers, method } = this.commonRequest;
    const req = {
      headers,
      method,
      body,
      uri: getURI(this.commonRequest)
    };

    const res : MiddlewareArg= await this.middleware({
      request: req,
      next: noOpMiddleware,
    });

    if (res.error) {
      throw res.error;
    }
    
    if(res.response){
      return res.response
    }
    
    return {
      body: {} as O
    }
  }
}

function reduceMiddleware(op1: Middleware, op2: Middleware): Middleware {
  return async (arg: MiddlewareArg) => {
    const { next, ...rest } = arg;
    const intermediateOp: Middleware = (tmpArg: MiddlewareArg) => {
      const { next, ...rest } = tmpArg;
      return op2({ ...rest, next: arg.next });
    };

    return op1({
      ...rest,
      next: intermediateOp
    });
  };
}

function getURI(commonRequest: CommonRequest<any>): string {
  const pathMap = commonRequest.pathVariables;
  const queryMap = commonRequest.queryParams;
  var uri: String = commonRequest.uriTemplate;
  var queryParams : string[]= [];
  for (const param in pathMap) {
    uri = uri.replace(`{${param}}`, `${pathMap[param]}`);
  }
  for (const query in queryMap) {
    queryParams = [
      ...queryParams,
      `${query}=${encodeURIComponent(`${queryMap[query]}`)}`
    ];
  }
  const resQuery = queryParams.join("&");
  if (resQuery == "") {
    return `${commonRequest.baseURL}${uri}`;
  }
  return `${commonRequest.baseURL}${uri}?${resQuery}`;
}

const noOpMiddleware = async (x: MiddlewareArg) => x;