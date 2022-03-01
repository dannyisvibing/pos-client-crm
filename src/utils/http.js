import qs from 'qs';
import axios from 'axios';
import camelcaseKeyDeep from 'camelcase-keys-deep';
import { ResponseStatus } from '../constants/server';

export const init = (store, onUnAuthCb) => {
  axios.interceptors.request.use(config => {
    const {
      auth: { session }
    } = store.getState();
    config.headers = config.headers || {};
    if (session) {
      config.headers['x-access-token'] = session.sessionId || '';
    }
    return config;
  });

  axios.interceptors.response.use(
    res => {
      res.data = camelcaseKeyDeep(res.data);
      return res;
    },
    err => {
      const status = err.response && err.response.status;
      const {
        auth: { session }
      } = store.getState();
      if (status === ResponseStatus.UNAUTH && onUnAuthCb && session) {
        onUnAuthCb();
      }
      return Promise.reject(err);
    }
  );
};

export default function request({
  url,
  method = 'get',
  params = {},
  headers = {},
  body = {},
  type = 'application/json',
  stringify = false,
  timeout = 20000
}) {
  if (!url) return Promise.reject(new Error('Request URL is undefined'));
  const urlParams = {
    ...params
  };
  const reqHeaders = {
    Accept: 'application/json',
    'Content-Type': type,
    ...headers
  };
  const apiUrl = `${process.env.REACT_APP_API_BASE_URL}${url}`;
  const formattedBody = stringify
    ? Object.keys(body).reduce((acc, key) => {
        acc[key] =
          typeof body[key] === 'object' ? JSON.stringify(body[key]) : body[key];
        return acc;
      }, {})
    : body;
  return axios({
    method,
    url: apiUrl,
    data: stringify ? qs.stringify(formattedBody) : formattedBody,
    params: urlParams,
    headers: reqHeaders,
    timeout
  });
}

export const getStatic = ({ url }) =>
  axios({
    method: 'get',
    url,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then(res => res.data)
    .catch(err => {
      throw err;
    });
