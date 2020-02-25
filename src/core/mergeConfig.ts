import { AxiosRequestConfig } from '../types'
import { isPlainObject } from '../helpers/util';

const strats = Object.create(null);

function defaultStrat(val1: any, val2: any): any {
    return typeof val2 !== 'undefined' ? val2 : val1;
}

function fromVal2Strat(val1: any, val2: any): any {
    if(typeof val2 !== 'undefined') {
        return val2;
    }
}

function deepMergeStrat(val1: any, val2: any): any {
    if(isPlainObject(val2)) {
        return deepMerge(val1, val2);
    } else if(typeof val2 !== 'undefined') {
        return val2;
    } else if(isPlainObject(val1)) {
        return deepMerge(val1);
    } else if(typeof val1 !== 'undefined') {
        return val1;
    }
}

const stratKeyFromVal2 = ['url', 'param', 'data']

stratKeyFromVal2.forEach(key => {
    strats[key] = fromVal2Strat
})

const sratKeysDeepMerge = ['headers'];

sratKeysDeepMerge.forEach(key => {
    strats[key] = deepMergeStrat;
})

export default function mergeConfig(config1: AxiosRequestConfig, config2?: AxiosRequestConfig): AxiosRequestConfig {
    if (!config2) {
        config2 = {};
    }

    const config = Object.create(null);

    for (let key in config2) {
        mergeField(key);
    }

    for(let key in config1) {
        if(!config2[key]) {
            mergeField(key);
        }
    }

    function mergeField(key: string): void {
        const strat = strats[key] || defaultStrat;
        config[key] = strat(config1[key], config2![key]);
    }

    return config;
}

export function deepMerge(...objs: any[]): any {
    const result = Object.create(null);
    objs.forEach(obj => {
        if(obj) {
            Object.keys(obj).forEach(key => {
                const val = obj[key];
                if(isPlainObject(val)) {
                    if(isPlainObject(result[key])) {
                        result[key] = deepMerge(result[key], val);
                    } else {
                        result[key] = deepMerge(val);
                    }
                } else {
                    result[key] = val;
                }
            })
        }
    })

    return result;
}