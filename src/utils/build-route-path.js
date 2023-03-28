export function buildRoutePath(path) {
  const routePathRegex = /:([a-zA-z]+)/g
  const routeWithParams = path.replaceAll(routePathRegex, '(?<$1>[a-z0-9\-_]+)')

  const pathRegex = new RegExp(`^${routeWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}