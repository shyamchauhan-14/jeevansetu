export type RouteHandler = (params: Record<string, string>, query: URLSearchParams) => string | Promise<string>;

export interface RouteDefinition {
  pattern: RegExp;
  paramNames: string[];
  handler: RouteHandler;
}

export class Router {
  private routes: RouteDefinition[] = [];
  private notFoundHandler: RouteHandler = () => '<h1>404 Not Found</h1>';
  private onRouteChangeCallback?: (path: string, content: string) => void;

  public register(pathPattern: string, handler: RouteHandler): void {
    const paramNames: string[] = [];
    const regexPattern = pathPattern
      .replace(/:([a-zA-Z0-9_-]+)/g, (_, paramName) => {
        paramNames.push(paramName);
        return '([^/]+)';
      })
      .replace(/\//g, '\\/');

    this.routes.push({
      pattern: new RegExp(`^${regexPattern}$`),
      paramNames,
      handler
    });
  }

  public setNotFound(handler: RouteHandler): void {
    this.notFoundHandler = handler;
  }

  public onRouteChange(callback: (path: string, content: string) => void): void {
    this.onRouteChangeCallback = callback;
  }

  public async navigate(hashUrl: string): Promise<void> {
    if (window.location.hash !== hashUrl) {
      window.location.hash = hashUrl;
    } else {
      await this.handleHashChange();
    }
  }

  public async handleHashChange(): Promise<void> {
    const rawHash = window.location.hash || '#/';
    const [pathPart, queryPart] = rawHash.split('?');
    const path = pathPart.replace(/^#/, '') || '/';
    const query = new URLSearchParams(queryPart || '');

    let matched = false;
    let content = '';

    for (const route of this.routes) {
      const match = path.match(route.pattern);
      if (match) {
        matched = true;
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, index) => {
          params[name] = decodeURIComponent(match[index + 1]);
        });

        content = await route.handler(params, query);
        break;
      }
    }

    if (!matched) {
      content = await this.notFoundHandler({}, query);
    }

    if (this.onRouteChangeCallback) {
      this.onRouteChangeCallback(rawHash, content);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  public init(): void {
    window.addEventListener('hashchange', () => this.handleHashChange());
    this.handleHashChange();
  }
}
