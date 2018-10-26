import React from "react";
import { Card } from "antd";
import Utils from "../../utils/utils";
import axios from "../../axios/index";
import ETable from "../../components/ETable/index";
import QueryForm from '../../components/QueryForm';
import {Link} from 'react-router-dom'
export default class CntOrderHistory extends React.Component {

  state = {
    list: [],
  }

  formItemList = [
    {
      type: 'DICT',
      label: '船名：',
      field: 'vesselName',
      width: 80,
      dictKey: 'shipRecord'
    },
    {
      type: 'INPUT',
      label: '航次：',
      field: 'voyage',
      width: 80,
    },
    {
      type: 'INPUT',
      label: '订舱号/提单号：',
      field: 'billNo',
      width: 80,
      initialValue: ''
    },
    {
      type: 'DICT',
      label: '拖车行：',
      field: 'truckComp',
      width: 80,
      dictKey: 'truckCompAll'
    },
    {
      type: 'DATEPICKER',
      field: 'startTime',
      width: 150,
      label: '起始指派时间：',
    },
    {
      type: 'DATEPICKER',
      field: 'endTime',
      width: 150,
      label: '结束指派时间：',
    },
  ];

  params = {
    pageNo: 1,
    pageSize: 10
  }

  handleFilterSubmit = (params) => {
    this.params = {
      ... params,
      pageNo:1,
      pageSize:this.params.pageSize
    }
    this.requestList();
  }

  componentDidMount() {
    this.requestList();
  }

  //列表查询
  requestList = () => {
    axios.ajax(
      {
        url: "/yybd/cntOrder/listHistoryOrder",
        data: {
          params: {
            ... this.params,
            busiType: this.props.busiType
          }
        }
      }
    ).then((res) => {
        let _this = this;
        if (res && res.data && res.data.pageNo == 1) {
          _this.params.totalCount = res.data.totalCount;
        } else {
          res.data.totalCount = _this.params.totalCount
        }
        if (res.data.list) {
          res.data.list.map((item, index) => {
            item.key = index;
            item.index = index + 1;
            return item;
          })
        }
        this.setState({
          list: res.data.list ? res.data.list : [],
          pagination: Utils.pagination(res.data, (current) => {
            _this.params.pageNo = current;
            _this.requestList();
          })
        })
      })
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 40,
      }, {
        title: '船名/航次',
        dataIndex: 'vesselName',
        width: 130,
        render: (text, record) => (
          <Link to={{pathname:"/cntOrderDetailHistory", orderNo:record.orderNo}} >{
            (record.vesselName || '') + (record.vesselName && record.voyage ? '/' : '') + (record.voyage||'')
          }</Link>
        )
      }, {
        title: '业务属性',
        dataIndex: 'tradeType',
        render: (v) => v === "I" ? '内贸' : '外贸'
      }, {
        title: '订舱号/提单号',
        dataIndex: 'bl',
        width: 150,
        render: (text,record) => record.bl || record.billNo || '--'
      }, {
        title: '箱量',
        dataIndex: 'cntNum'
      }, {
        title: '拖车行',
        dataIndex: 'truckComp',
        width: 220,
      }, {
        title: '申请单位',
        dataIndex: 'appunit',
        width: 200
      }, {
        title: '指派时间',
        dataIndex: 'createTime',
        width: 150,
        render: Utils.formateDate1
      }, {
        title: '操作',
        dataIndex: 'action',
        width: 130,
        render: (text, record) => (
          <span className="table-operation">
            <Link to={{pathname:"/cntOrderDetailHistory", orderNo:record.orderNo}} >箱清单管理</Link>
            {/*
            <Button type="primary" size="small" icon="setting" onClick={() => {console.info('箱清单管理');}}>箱清单管理</Button>
          */}
          </span>
        )
      }
    ]
    return (
      <div>
        <Card>
          <QueryForm formList={this.formItemList} filterSubmit={this.handleFilterSubmit}></QueryForm>
        </Card>
        <div className="content-wrap">
          <ETable
            rowSelection={false}
            columns={columns}
            dataSource={this.state.list}
            pagination={this.state.pagination}
          />
        </div>
      </div>
    );
  }
}
