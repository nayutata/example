import * as React from 'react'
import axios from './../../axios/index'
import CommonTable from '../../components/CommonTable'
import Utils from '../../utils/utils'
import { Notification } from '../../components/design'

export class ViewTable extends React.Component {
    state = {
        tableDataSource: []
    }
    componentDidMount() {
        this.request()
    }

    request = () => {
        axios.ajax({
            url: '/yybd/truckCompany/syncOrder',
            data: {
                params: {
                    eirId: this.props.eirId,
                    pageNo: 1,
                    pageSize: 20
                }
            }
        }).then(res => {
            this.setState({
                tableDataSource: res.data.list ? res.data.list : [],
            })
        }).catch(error => {
            Notification.error(error)
        })
    }

    componentWillReceiveProps(newProps) {
        if (this.props.eirId !== newProps.eirId)
            this.request()
    }

    column = [
        { title: '预录入ID', render: v => v.eirId || '--' },
        { title: '箱号', render: v => v.containerNo || '--' },
        { title: '提箱办单车牌号', render: v => v.dtruckNo || '--' },
        { title: '提箱状态', render: v => v.deirState || '--' },
        { title: '提箱空重', render: v => v.demptyfull || '--' },
        { title: '提箱办单时间', render: v => <div>{v.dingateTime ? Utils.formateDate1(v.dingateTime).split(' ').map((t, i) => <p key={i}>{t}</p>) : '--'} </div> },
        { title: '提箱箱况', render: v => v.disdamage || '--' },
        { title: '返箱办单车牌号', render: v => v.rtruckNo || '--' },
        { title: '返箱状态', render: v => v.reirState || '--' },
        { title: '收箱空重', render: v => v.remptyfull || '--' },
        { title: '返箱办单时间', render: v => <div>{v.ringateTime ? Utils.formateDate1(v.ringateTime).split(' ').map((t, i) => <p key={i}>{t}</p>) : '--'} </div> },
        { title: '返箱箱况', render: v => v.risdamage || '--' },
        { title: '最后更新时间', render: v => <div>{v.lastUpdateTime ? Utils.formateDate1(v.lastUpdateTime).split(' ').map((t, i) => <p key={i}>{t}</p>) : '--'} </div> }
    ]

    render() {
        return <CommonTable
            columns={this.columns}
            dataSource={this.state.tableDataSource}
            pagination={false}
            rowSelection={null}
        />
    }
}