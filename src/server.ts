export class ResponseEntity extends Response {
  static ok<T = any>(data: T): ResponseEntity {
    return ResponseEntity.json(
      {
        data,
      },
      {
        status: 200,
      },
    );
  }

  static created<T = any>(data: T): ResponseEntity {
    return ResponseEntity.json(
      {
        data,
      },
      {
        status: 201,
      },
    );
  }

  static override error(status?: number, message?: string): ResponseEntity {
    return ResponseEntity.json(
      {
        data: {
          message,
        },
      },
      {
        status,
      },
    );
  }
}

export enum Method {
  'GET' = 'GET',
  'POST' = 'POST',
  'PUT' = 'PUT',
  'PATCH' = 'PATCH',
  'DELETE' = 'DELETE',
}

export type Middleware = (
  request: Request,
  context: Context,
) => Promise<void> | void;

export interface ApiRouteConfig {
  debug?: boolean;
  middlewares?: Middleware[];
}

export interface Context {
  params: Record<string, string>;
}

export type RouteReturn = Response | Promise<Response> | any;

export interface Routes {
  [Method.GET]?(request: Request, context: Context): RouteReturn;
  [Method.POST]?(request: Request, context: Context): RouteReturn;
  [Method.PUT]?(request: Request, context: Context): RouteReturn;
  [Method.PATCH]?(request: Request, context: Context): RouteReturn;
  [Method.DELETE]?(request: Request, context: Context): RouteReturn;
}

class Server {
  private debug: boolean = false;
  private middlewares: Middleware[] = [];

  constructor(config?: ApiRouteConfig) {
    this.debug = !!config?.debug;
    this.middlewares = config?.middlewares ?? [];
  }

  static createInstance(config?: ApiRouteConfig): Server {
    return new Server(config);
  }

  createRoute(routes: Routes) {
    const { debug, middlewares } = this;
    return async function route(
      request: Request,
      context: Context,
    ): Promise<Response> {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const route = routes[request.method as Method];
      if (!route) {
        return ResponseEntity.error(405, 'Not Allowed Method');
      }
      try {
        await Promise.all(
          middlewares.map((middleware) => {
            return middleware(request, context);
          }),
        );
        const data = await route(request, context);
        if (data instanceof ResponseEntity) {
          return data;
        }
        return ResponseEntity.ok(data);
      } catch (error: any) {
        if (debug) {
          console.error(error);
        }
        if (error instanceof ResponseEntity) {
          return error;
        }
        return ResponseEntity.error(500, error.message);
      }
    };
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  createService<T extends Record<string | symbol | number, Function>>(
    services: T,
  ): T {
    return services;
  }
}

export default Server;
