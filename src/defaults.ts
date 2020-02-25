import { AxiosRequestConfig } from "./types";
import { transfromRequest, transformResponse } from "./helpers/data";
import { processHeaders } from "./helpers/headers";

const defaults: AxiosRequestConfig = {
    method: 'get',
    timeout: 0,
    headers: {
        common: {
            Accept: 'application/json, text/plain, */*'
        }
    },

    transfromRequest: [
        function(data: any, headers: any): any {
            processHeaders(headers, data);
            return transfromRequest(data);
        }
    ],
    transformResponse: [
        function(data: any): any {
            return transformResponse(data);
        }
    ]
}

const methodsNoData = ['delete', 'get', 'head', 'options'];

methodsNoData.forEach(method => {
    defaults.headers[method] = {};
})

const methodsWithData = ['post', 'put', 'patch']

methodsWithData.forEach(method => {
    defaults.headers[method] = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})

export default defaults