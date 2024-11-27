export interface RouterOptions {
  /**
   * Directory to look for routes.
   * @see {@link https://storona.domin.lol/reference/config.html#directory}
   * @default "routes"
   */
  directory?: string;

  /**
   * Prefix all routes with a string or an API version.
   * Set to true to use the package version. 1.0.0 -> /v1
   * Set to a string to use a custom prefix.
   * @see {@link https://storona.domin.lol/reference/config.html#prefix}
   * @default false
   */
  prefix?: boolean | `/${string}`;

  /**
   * Silence all logs.
   * @see {@link https://storona.domin.lol/reference/config.html#quiet}
   * @default false
   */
  quiet?: boolean;

  /**
   * Ignore (silence) all warnings.
   * @see {@link https://storona.domin.lol/reference/config.html#ignore-warnings}
   * @default false
   */
  ignoreWarnings?: boolean;
}

export interface RouteStructure {
  endpoint: string;
  method: string;
}

interface ValidEndpoint {
  /** Path to the route file. */
  path: string;
  /** Registered endpoint. */
  endpoint: string | RegExp;
  /** Registered method. */
  method: string;
  /** Whether endpoint was registered or not. */
  registered: true;
}

interface InvalidEndpoint {
  /** Path to the route file. */
  path: string;
  /** Whether endpoint was registered or not. */
  registered: false;
  /** Error instance for the failing route. */
  error: Error;
}

export type EndpointInfo = ValidEndpoint | InvalidEndpoint;
