import React from 'react'
import { Select } from 'antd'
import Moment from 'moment'
const Option = Select.Option;

export default {
    formateDate1(time) {
        if (!time) return '';
        return Moment(time).format('YYYY-MM-DD HH:mm:ss');
    },

    formateDate2(time) {
        if (!time) return '';;
        return Moment(time).format('YYYY-MM-DD');
    },

    formateDate3(time) {
        if (!time) return '';;
        return Moment(time).format('X') * 1000;
    },

    pagination(data, callback) {
        let page = {
            onChange: (current) => {
                callback(current);
            },
            current: data.pageNo,
            pageSize: data.pageSize,
            total: data.totalCount,
            showTotal: () => {
                return `共${data.totalCount}条`
            },
            showQuickJumper: true
        }
        return page;
    },

    //
    getDictOptionsUI(dictObject) {
        if (!dictObject) {
            return [];
        }
        let options = [];
        Object.keys(dictObject).forEach((key) => {
            options.push(<Option value={key} key={key}>{dictObject[key]}</Option>)

        })
        return options;
    },

    //
    getOptionList(data) {
        if (!data) {
            return [];
        }
        let options = [];
        data.map((item) => {
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options;
    },
    /**
     * ETable 行点击通用函数
     * @param {*选中行的索引} selectedRowKeys
     * @param {*选中行对象} selectedItem
     */
    updateSelectedItem(selectedRowKeys, selectedRows, selectedIds) {
        if (selectedIds) {
            this.setState({
                selectedRowKeys,
                selectedIds: selectedIds,
                selectedItem: selectedRows
            })
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem: selectedRows
            })
        }
    },

    /**
     * 
     * @param {*} oldFormValue 
     */
    flatFormValue(oldFormValue) {
        let flatData = Object.keys(oldFormValue).reduce((object, key) => {
            if (oldFormValue[key]) {
                object[key] = oldFormValue[key];
                if (oldFormValue[key] instanceof Moment) {
                    object[key] = oldFormValue[key].valueOf();
                }
            }
            return object;
        }
            , {});
        return flatData;
    },

    getValBaseOnKey(obj, key) {
        let k = Object.keys(obj).find(v => v == key)
        if (k)
            return obj[k]
        else
            return '--'
    }

}