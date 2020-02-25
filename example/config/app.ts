import axios, { AxiosTransformer } from '../../src/index'
import qs from 'qs'

axios.defaults.headers.common['test2'] = 123;

// tslint:disable-next-line: no-floating-promises
axios({
    url: '/config/post',
    method: 'post',
    data: qs.stringify({
        a: 1
    }),
    headers: {
        test: '321'
    }
}).then((res) => {
    console.log(res.data);
})

// tslint:disable-next-line: no-floating-promises
// axios({
//     transformRequest: [(function (data) {
//         return qs.stringify(data);
//     }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
//     transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
//         if(typeof data === 'object') {
//             data.b = 2;
//         }

//         return data;
//     }],
//     url: '/config/post',
//     method: 'post',
//     data: {
//         a: 2
//     }
// }).then((res) => {
//     console.log(res.data);
// })

// const instance = axios.create({
//     transformRequest: [(function (data) {
//         return qs.stringify(data);
//     }), ...(axios.defaults.transformRequest as AxiosTransformer[])],
//     transformResponse: [...(axios.defaults.transformResponse as AxiosTransformer[]), function (data) {
//         if(typeof data === 'object') {
//             data.b = 2;
//         }

//         return data;
//     }],
//     url: '/config/post',
//     method: 'post',
//     data: {
//         a: 2
//     }
// })

// instance({
//     url: '/config/post',
//     method: 'post',
//     data: {
//         a: 1
//     }
// }).then((res) => {
//     console.log(res.data)
// })