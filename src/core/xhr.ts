import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from "../types";
import { parseHeaders } from "../helpers/headers";
import { createAxiosError } from "../helpers/error";
import cancelToken from "../cancel/CancelToken";

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
    return new Promise((resolve, reject) => {
        const { data = null, url, method = 'get', headers, timeout, responseType, cancelToken } = config;
        const request = new XMLHttpRequest();

        if (timeout) {
            request.timeout = timeout;
        }
        if (responseType) {
            request.responseType = responseType;
        }

        request.open(method.toUpperCase(), url!, true);

        request.onreadystatechange = function handleLoad() {
            if (request.readyState !== 4) {
                return
            }
            if (request.status === 0) {
                return
            }

            const responseHeaders = parseHeaders(request.getAllResponseHeaders());
            const responseData = responseType !== 'text' ? request.response : request.responseText;
            const response: AxiosResponse = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            }

            resolve(response);
        }

        request.onerror = function handleError() {
            reject(createAxiosError('Network error.', config, null, request));
        }
        request.ontimeout = function handleTimeout() {
            reject(createAxiosError(`Timeout of ${timeout} ms.`, config, 'ECONNABORTED', request));
        }

        Object.keys(headers).forEach((name) => {
            if (data === null && name.toLowerCase() === 'content-type') {
                delete headers[name];
            } else {
                request.setRequestHeader(name, headers[name]);
            }
        })

        if (cancelToken) {
            cancelToken.promise.then(reason => {
                request.abort();
                reject(reason);
            })
        }

        request.send(data);

        function handleResponse(response: AxiosResponse): void {
            if (response.status >= 200 && response.status < 300) {
                resolve(response);
            } else {
                reject(createAxiosError(`Request failed with status code ${response.status}`, config, null, request, response));
            }
        }
    })
}

