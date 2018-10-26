import JsonP from 'jsonp'
import axios from 'axios'
import qs from 'qs'
import { Notification } from '../components/design'


export default class Axios {
    static jsonp(options) {
        return new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response) {
                //to-do
                // debugger;
                if (response.status === 'success') {
                    resolve(response);
                } else {
                    reject(response.message);
                }
            })
        })
    }

    static ajax(options) {

        let loading;
        if (options.data && options.data.isShowLoading !== false) {
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'block';
        }
        let baseApi = window.AppConfig.serviceUrl;

        //如果访问后端，这个需要true，否则为false
        axios.defaults.withCredentials = true;

        if (options.baseURL) {
            baseApi = options.baseURL;
        }

        //如果isMock为true，说明是要访问模拟数据
        if (options.isMock) {
            axios.defaults.withCredentials = false;
            baseApi = '/api';
        }

        return new Promise((resolve, reject) => {
            axios({
                url: options.url,
                method: options.method ? options.method : 'get',
                baseURL: baseApi,
                timeout: 80000,
                params: (options.data && options.data.params) || '',
                data: (options.data && options.data.data) || '',
                paramsSerializer: params => { return qs.stringify(params, { indices: false }) }//https://segmentfault.com/q/1010000010323643
            }).then((response) => {

                if (options.data && options.data.isShowLoading !== false) {
                    loading = document.getElementById('ajaxLoading');
                    loading.style.display = 'none';
                }
                if (response.status == '200') {

                    let res = response.data;
                    if (res.code == '0') {
                        resolve(res);
                    } else if (res.code == '401') {
                        window.location = res.data.loginUrl
                    } else if (res.code == '200') {
                        resolve(res);
                    } else if (res.code == "400") {
                        res.data.list.map((item) => {
                            Notification.error(item.val)
                            // notification.open({
                            //     message: '失败通知',
                            //     description: item.val
                            // });
                        });

                    }
                    else {
                        // Modal.info({
                        //     title: '提示',
                        //     content: res.message
                        // });
                        Notification.error(res.message)
                    }
                } else {
                    reject(response.data);
                }
            })

        });
    }


}