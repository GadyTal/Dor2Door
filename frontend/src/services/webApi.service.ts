import axios, { AxiosResponse } from "axios";
import once from "lodash/once";
import { Config } from "../shared/Config";
import { UserRoles } from "../shared/Responses.Contracts";
const getFullUrl = (url: string) => `${Config.API_URL}/${url}`;
let isGoogleLoaded: boolean = false;
export const makeRequest = (
  url: string,
  data: any,
  method: any,
  headers = null,
  withCredentials = true
): Promise<AxiosResponse<any>> | any => {
  if (!method) return console.error("Please provide a method!");
  // validate token
  if (withCredentials && !axios.defaults.headers.common["Authorization"]) {
    // check localstorage for token
    let token = getTokenFromLocalStorage();
    if (token) setToken(token);
    else if (window.location.href.indexOf(Config.AppRoutes.NewSubmission) === -1){
      console.error("No token");
      // TODO - fix route with react history
      return window.location.href = '#' + Config.AppRoutes.Login;
    }
  }
  let reqOptions = {
    body: data,
    withCredentials,
  };
  switch (method) {
    case "GET":
      return axios.get(getFullUrl(url), reqOptions);
    case "POST":
      return axios.post(getFullUrl(url), data, reqOptions);
    case "DELETE":
      return axios.delete(getFullUrl(url), reqOptions);
    case "PUT":
      return axios.put(getFullUrl(url), data, reqOptions);
    default:
      return null;
  }
};

// Init google places
export const loadGoogleMaps = once(
  (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (isGoogleLoaded) resolve();
      let urlWithToken =
        "https://maps.googleapis.com/maps/api/js?key=" +
        Config.GOOGLE_API_KEY +
        "&libraries=places";
      let head = document.getElementsByTagName("head")[0];
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.src = urlWithToken;
      script.onload = () => {
        isGoogleLoaded = true;
        resolve();
      };
      script.onerror = (e) => {
        reject(e);
      };
      head.appendChild(script);
    });
  }
);

export const setToken = (token: string) => {
  axios.defaults.headers.common["Authorization"] = token;
  // remove before save
  localStorage.removeItem(Config.tokenPrefix);
  // save also in localstorage
  localStorage.setItem(Config.tokenPrefix, encodeToLocalStorage(token));
  console.log('Token setted!!');
};

export const setRole = (role: string) => {
  localStorage.setItem(Config.rolePrefix, encodeToLocalStorage(role));
};

export const getRole = () : string | boolean => {
  let role = localStorage.getItem(Config.rolePrefix);
  if (role) {
    return decodeFromLocalStorage(role);
  }
  return false;
};

function encodeToLocalStorage(token: string) {
  return btoa(token);
}

function decodeFromLocalStorage(token: string) {
  return atob(token);
}

export function getTokenFromLocalStorage() {
  let token = localStorage.getItem(Config.tokenPrefix);
  if (token) {
    return decodeFromLocalStorage(token);
  }
  return false;
}

// For routing back
export const setRouteBack = (route: string) => {
  // add hash
  if (route.indexOf('#') === -1) route = '/#' + route;
  localStorage.setItem(Config.routePrefix, encodeToLocalStorage(route));
};

export const getRouteBack = () : string | boolean => {
  let route = localStorage.getItem(Config.routePrefix);
  // clean localstorage from this route
  localStorage.removeItem(Config.routePrefix);
  if (route) {
    return decodeFromLocalStorage(route);
  }
  return false;
};

