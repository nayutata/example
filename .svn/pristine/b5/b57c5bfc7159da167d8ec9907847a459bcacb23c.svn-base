import React from "react";
import { Button, Card, Modal, notification, Form } from "antd";
import Utils from "../../utils/utils";
import QueryForm from '../../components/QueryForm';
import axios from "../../axios";
import ETable from "../../components/ETable";
import EditForm from "./editForm";

class TruckCompanyManage extends React.Component {

  state = {
    list: [],
    isShowOpenEdit:false
  }

  formItemList = [
    {
      type: 'DICT',
      label: '拖车行名称',
      field: 'truckCompnm',
      width: 80,
      dictKey: 'truckCompAll'
    },
  ];

  params = {
    pageNo: 1,
    pageSize: 10
  }


  selectedRecord = {}

  handleFilterSubmit = (params) => {
    this.requestList(params);
  }

  componentDidMount() {
    this.requestList();
  }

  requestList = (params) => {
    let _params = {
      ...this.params,
      ...params,
      pageNo: 1,
    }

    axios.ajax(
      {
        url: "/yybd/truckCompany/list",
        data: {
          params: _params
        }
      }
    )
      .then((res) => {
        let _this = this;
        if (res.data.list) {
          res.data = {
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

  // 设置为常用
  handleSetAsUsually = (record) => {
    let id = '';
    if (record) {
      id = record.id;
    } else {
      return;
    }

    if (id == null) return;

    Modal.confirm({
      title: '设置',
      okText: '确定',
      cancelText: '取消',
      content: record.isUsually == true ? "确定取消常用" : "确定设为常用吗?",
      onOk: () => {
        axios.ajax({
          url: '/yybd/truckCompany/setAsUsually',
          data: {
            params: {
              id: id
            }
          }
        }).then((res) => {
          if (res.code == '200') {
            notification.success({
              message: '操作成功'
            });
            this.requestList();
          }
        })
      }
    });

  }

  handleUpdate = (record) => {
    this.selectedRecord = record;
    this.setState({
      isShowOpenEdit:true
    });
  }

  // 编辑
  handleEditSubmit = () => {
    this.editForm.props.form.validateFields((err,values)=> {
      if (err) {
        return;
      }
      let editForm = this.editForm.props.form.getFieldsValue();
      axios.ajax({
        url: '/yybd/truckCompany/update',
        data: {
          params: {
            id: this.selectedRecord.id,
            contactor: editForm.contactor,
            mobile: editForm.mobile,
            tel: editForm.tel,
            qq: editForm.qq
          }
        }
      }).then((res) => {
        if (res.code == '200') {
          this.setState({
            isShowOpenEdit:false
          })
          notification.success({
            message: '操作成功'
          });
          this.editForm.props.form.resetFields();
          this.requestList();
        }
      })
    });
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index'
      }, {
        title: '拖车行名称',
        dataIndex: 'truckCompnm',
        render: v => v || '--',
      }, {
        title: '常用联系人',
        dataIndex: 'contactor',
        render: v => v || '--'
      }, {
        title: '联系固话',
        dataIndex: 'tel',
        render: v => v || '--'
      }, {
        title: '手机号',
        dataIndex: 'mobile',
        render: v => v || '--'
      }, {
        title: 'QQ',
        dataIndex: 'qq',
        render: v => v || '--'
      }, {
        title: '常用',
        dataIndex: 'isUsually',
        width: 70,
        render: (val, record) => {
          if (val == true) {
            return "常用";
          } else {
            return <span style={{ color: 'red' }}>不常用</span>;
          }
        }
      }, {
        title: '操作',
        dataIndex: 'action',
        width: 180,
        render: (text, record) => (
          <span className="table-operation">
            <Button type="primary" onClick={() => this.handleSetAsUsually(record)}>{record.isUsually == true ? "常用取消" : "设为常用"}</Button>
            <Button type="primary" onClick={() => this.handleUpdate(record)}>编辑</Button>
          </span>
        )
      }
    ]
    return (
      <div>
        <Card>
          <QueryForm formList={this.formItemList} filterSubmit={this.handleFilterSubmit} />
        </Card>
        <div className="content-wrap">
          <ETable
            rowSelection={false}
            columns={columns}
            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
            selectedRowKeys={this.state.selectedRowKeys}
            dataSource={this.state.list}
            pagination={this.state.pagination}
          />
        </div>
        <Modal
          title="编辑"
          visible={this.state.isShowOpenEdit}
          onCancel={()=>{
            this.editForm.props.form.resetFields();
            this.setState({
              isShowOpenEdit:false
            })
          }}
          onOk={this.handleEditSubmit}
        >
          <EditForm record={this.selectedRecord} wrappedComponentRef={(f) => { this.editForm = f; }} />
        </Modal>
      </div>
    );
  }
}

export default (Form.create({})(TruckCompanyManage));