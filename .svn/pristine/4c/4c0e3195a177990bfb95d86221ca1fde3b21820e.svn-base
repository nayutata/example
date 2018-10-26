import React from "react";
import { Button, Card, Col, Form, Row, Modal, notification } from "antd";
import Utils from "../../utils/utils";
import axios from "../../axios/index";
import ETable from "../../components/ETable/index";
import QueryForm from "../../components/QueryForm";
import dict from '../../utils/dict';
import CntOrderDetailEdit from "./CntOrderDetailEdit";

class CntOrderDetailHistory extends React.Component {

  state = {
    list: [],
    selectedRowKeys: [],
    fileInput: {},
    isOpenEdit: false,
    isOpenSyncOrder: false,
    syncOrderList: [],
  }

  formItemList = [
    {
      type: 'DICT',
      label: '拖车行：',
      field: 'truckComp',
      width: 80,
      dictKey: 'truckCompAll'
    },
    {
      type: 'INPUT',
      label: '订舱号：',
      field: 'bl',
      width: 80,
      initialValue: ''
    },
    {
      type: 'INPUT',
      label: '提单号：',
      field: 'billNo',
      width: 80,
      initialValue: ''
    },
    {
      type: 'INPUT',
      label: '箱号：',
      field: 'cntNo',
      width: 80,
      initialValue: ''
    },
  ];

  params = {
    pageNo: 1,
    pageSize: 10,
  }

  handleSubmit = (params) => {
    this.params = {
      ...params,
      pageNo: 1,
      pageSize: this.params.pageSize
    }
    this.requestList();
  }

  componentDidMount() {
    this.requestList();
  }

  //舱单详情列表
  requestList = () => {
    axios.ajax(
      {
        url: "/yybd/cntOrder/getOrderDetail",
        data: {
          params: {
            ... this.params,
            orderNo: this.props.location.orderNo || '201802280006'
          }
        }
      }
    ).then((res) => {
      let _this = this;
      if (res.data.list) {
        res.data = {
          ...this.params,
          totalCount: res.data.list.length,
          list: res.data.list.slice(this.params.pageSize * (this.params.pageNo - 1), this.params.pageSize * this.params.pageNo)
        }
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

  // 作废
  handleDelete = (record) => {
    let id = '';
    if (record) {
      id = record.id;
    } else {
      return;
    }

    if (id == null) return;

    Modal.confirm({
      okText: '确定',
      cancelText: '取消',
      content: "确定要作废吗?",
      onOk: () => {
        axios.ajax({
          url: '/yybd/truckCompany/delete',
          data: {
            params: {
              id: id
            }
          }
        }).then((res) => {
          if (res.code == '200') {
            this.requestList();
          }
        })
      }
    });

  }

  // 查看
  handleSyncOrder = (record) => {
    let eirId = '';
    if (record) {
      eirId = record.eirId;
    } else {
      return;
    }
    if (eirId == null) return;
    axios.ajax({
      url: '/yybd/truckCompany/syncOrder',
      data: {
        params: {
          eirId: eirId
        }
      }
    }).then((res) => {
      this.setState({
        syncOrderList: res.data.list
      });
    })
    this.setState({
      isOpenSyncOrder: true
    });
  }

  selectedRecord = {}

  handleEdit = (record) => {
    this.selectedRecord = record;
    this.setState({
      isOpenEdit: true
    });
  }
  // 编辑提交
  handleEditSubmit = () => {
    this.editForm.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let editForm = this.editForm.props.form.getFieldsValue();
      console.info('editForm', editForm)
    });
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index'
      }, {
        title: '订舱号/提单号',
        dataIndex: 'bl',
        render: (text, record) => record.bl || record.billNo || ''
      }, {
        title: '箱号',
        dataIndex: 'cntNo',
        render: v => v || '--'
      }, {
        title: '箱型',
        dataIndex: 'cntType',
        render: v => v || '--'
      }, {
        title: '箱主',
        dataIndex: 'cntOwner',
        render: v => v || '--'
      }, {
        title: '业务类型',
        dataIndex: 'busiType',
        render: (busiType) => {
          return dict.busiType[busiType];
        }
      }, {
        title: '业务属性',
        dataIndex: 'tradeType',
        render(tradeType) {
          return dict.TradeType[tradeType];
        }
      }, {
        title: '拖车行',
        dataIndex: 'ref1',
        render: v => v || '--'
      }, {
        title: '船信息',
        dataIndex: 'ref3',
        render: (text, record) => (
          record.ref3 + '/' + record.voyage
        )
      }, {
        title: '提箱进度',
        dataIndex: 'deirState',
        render: v => v || '--'
      }, {
        title: '返箱进度',
        dataIndex: 'reirState',
        render: v => v || '--'
      }, {
        title: '提箱截止时间',
        dataIndex: 'txEndTime',
        render: Utils.formateDate1
      }, {
        title: '进箱截止时间',
        dataIndex: 'jxEndTime',
        render: Utils.formateDate1
      }, {
        title: '卸货港',
        dataIndex: 'ref4',
        render: v => v || '--'
      }, {
        title: '进箱流向',
        dataIndex: 'flag2',
        render: v => v || '--'
      }, {
        title: '操作',
        dataIndex: 'action',
        width: 120,
        render: (text, record) => (
          <span className="table-operation">
            <a type="primary" onClick={() => this.handleSyncOrder(record)}>查看</a>
            <a type="primary" style={{ marginLeft: 10 }} onClick={() => this.handleEdit(record)}>编辑</a>
            <a type="primary" style={{ marginLeft: 10 }} onClick={() => this.handleDelete(record)}>作废</a>
          </span>
        )
      }
    ]
    const columnsTow = [
      {
        title: '预录入Id',
        key: 'eirId',
        dataIndex: 'eirId'
      },
      {
        title: '箱号',
        key: 'containerNo',
        dataIndex: 'containerNo'
      }, {
        title: '提箱办单车牌号',
        key: 'dtruckNo',
        dataIndex: 'dtruckNo'
      },
      {
        title: '提箱状态',
        key: 'dEirState',
        dataIndex: 'dEirState',
        render(dEirState) {
          return dict.deirState[dEirState];
        }
      }, {
        title: '提箱空重',
        key: 'demptyfull',
        dataIndex: 'demptyfull',
        render(demptyfull) {
          return dict.demptyfull[demptyfull]
        }
      }, {
        title: '提箱办单时间',
        dataIndex: 'dingateTime',
        render: Utils.formateDate1
      }, {
        title: '提箱箱况',
        key: 'disdamage',
        dataIndex: 'disdamage',
        render(demptyfull) {
          return dict.damage[demptyfull]
        }
      }, {
        title: '返箱办单车牌号',
        key: 'rtruckNo',
        dataIndex: 'rtruckNo'
      },
      {
        title: '返箱状态',
        key: 'rEirState',
        dataIndex: 'rEirState',
        render(rEirState) {
          return dict.reirState[rEirState];
        }
      }, {
        title: '收箱空重',
        key: 'remptyfull',
        dataIndex: 'remptyfull',
        render(remptyfull) {
          return dict.remptyfull[remptyfull]
        }
      }, {
        title: '返箱办单时间',
        dataIndex: 'ringateTime',
        render: Utils.formateDate1
      }, {
        title: '提箱箱况',
        key: 'risdamage',
        dataIndex: 'risdamage',
        render(risdamage) {
          return dict.damage[risdamage]
        }
      }, {
        title: '最后更新时间',
        key: 'lastUpdateTime',
        dataIndex: 'lastUpdateTime',
        render: Utils.formateDate1
      }
    ]

    return (
      <div className='booking-getWeight'>
        <Row style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Button onClick={e => {
            {/*window.history.back();*/ }
            this.props.history.goBack();
          }} type="primary" style={{ marginLeft: '20px' }}>返回</Button>
        </Row>
        <Row>
          <Col span={24}>
            <Card>
              <QueryForm formList={this.formItemList} filterSubmit={this.handleSubmit}></QueryForm>
            </Card>
            <div className="content-wrap">
              <ETable
                rowKey={(record) => (record.id)}
                rowSelection="checkbox"
                columns={columns}
                updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                selectedRowKeys={this.state.selectedRowKeys}
                dataSource={this.state.list}
                pagination={this.state.pagination}
              />

            </div>
          </Col>
        </Row >
        <Modal
          title="查看"
          visible={this.state.isOpenSyncOrder}
          confirmLoading={false}
          width={1600}
          footer={null}
          onCancel={() => {
            this.setState({
              isOpenSyncOrder: false,
              syncOrderList: ''
            })
          }}
        >
          <ETable
            columns={columnsTow}
            rowSelection={false}
            dataSource={this.state.syncOrderList}
          />
        </Modal>

        <Modal

          title="编辑"
          visible={this.state.isOpenEdit}
          onCancel={() => {
            this.editForm.props.form.resetFields();
            this.setState({
              isOpenEdit: false
            })
          }}
          onOk={this.handleEditSubmit}
        >
          <CntOrderDetailEdit record={this.selectedRecord} wrappedComponentRef={(f) => { this.editForm = f; }} />
        </Modal>
      </div>
    )
  }

}

export default (Form.create({})(CntOrderDetailHistory));