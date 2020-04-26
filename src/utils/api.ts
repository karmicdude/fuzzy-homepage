import axios from 'axios';
import config from 'utils/config';

export default axios.create({
  baseURL: config.apiBaseUrl,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
  },
});
