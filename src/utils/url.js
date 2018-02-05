export const getUrlPath = path => {
  return window.auiPathPrefix ? `/${window.auiPathPrefix}${path}` : path;
};
