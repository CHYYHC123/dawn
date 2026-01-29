import axios from 'axios';

export const articleFetcher = (url: string) => axios.get(url).then(res => res.data);
