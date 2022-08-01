import nodeFetch, { RequestInfo, RequestInit } from 'node-fetch'
import http from 'http'
import https from 'https'

const httpAgent = new http.Agent({ keepAlive: true })
const httpsAgent = new https.Agent({ keepAlive: true })

const fetch = (url: RequestInfo, options: RequestInit = {}) => {
  return nodeFetch(url, {
    agent: (parsedUrl) => {
      if (parsedUrl.protocol === 'http:') {
        return httpAgent
      } 
        return httpsAgent
      
    },
    ...options,
  })
}

export default fetch