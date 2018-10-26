import React from "react";
import {Input, Button, Card, Col, Icon, notification, Row, Form, Modal} from "antd";
import Utils from "../../utils/utils";
import axios from "../../axios/index";
import ETable from "../../components/ETable/index";
import RightForm from "./RightForm";
import dict from '../../utils/dict';
const FormItem = Form.Item;

class GetDetailForm extends React.Component {

  state = {
    list: [],
    selectedRowKeys:[],
    fileInput:{}
  }

  params = {
    pageNo: 1,
    pageSize: 10,
    eVesselName: this.props.record.evesselName,
    inBoundVoy: this.props.record.inBoundVoy,
    vesselId:this.props.record.owner,
  }

  handleSubmit = () => {
    this.params = {
      ... this.params,
      pageNo:1,
      ...this.props.form.getFieldsValue()
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
        url: "/yybd/shippingBill/billsInfo",
        data: {
          params: this.params
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
           item.key = item.id;
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

  //指派托车 行
  dispatchTruckComp = (formData) => {
    if(formData) {
      formData = Utils.flatFormValue(formData);
    }
    const {selectedRowKeys} = this.state;
    let ids = [];
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      ids = selectedRowKeys;
    }
    if (ids.length == 0) {
      return notification.warning({
        message: '警告',
        description: <pre>至少选择一个箱</pre>,
        icon: <Icon type="exclamation-circle" style={{color: 'orange'}}/>
      })
    }
    let isBkEmpty = formData.isBkEmpty ? 'Y' : 'N';
    formData = {
      ...formData,
      ids: ids,
      isBkEmpty: isBkEmpty,
      vesselId: this.params.eVesselName
    }

    console.info('formData', formData);

    if (formData.backEndTime && formData.txEndTime > formData.backEndTime) {
      return notification.warning({
        message: '警告',
        description: <pre>提箱截止时间不得大于进箱截止时间</pre>,
        icon: <Icon type="exclamation-circle" style={{color: 'orange'}}/>
      })
    }
    axios.ajax({
      url:'/yybd/shipCompany/orderTruck/tz',
      data:{
        params:formData
      }
    }).then((res)=>{
      console.info(res);
      if(res.code == '200'){
        this.setState({
          selectedRowKeys:[]
        })
        if (res.message) {
          notification.open({
            message: '通知',
            description: res.message
          });
        }
        this.requestList();
      }
    })

  }

  //导入箱号
  fileImport = ()=>{
    let fileInput = this.state.fileInput;
    if (fileInput.files != null && fileInput.files[0] instanceof Blob) {
      let fr = new FileReader()
      fr.onload = () => {
        axios.ajax(
          {
            url: "/yybd/shippingBill/billsInfo",
            data: {
              params: {
                eVesselName: this.props.record.evesselName,
                inBoundVoy: this.props.record.inBoundVoy,
                vesselId:this.props.record.owner,
              }
            }
          }
        ).then((res) => {
          if(res.code == '200' && res.data.list){
            let arr = (fr.result).split(/[\r\n\s]+/).filter(v => v != '')
            let selects = res.data.list.filter(v => arr.some(cntNo => cntNo == v.cntNo))
            let notFind = arr.filter(cntNo => res.data.list.some(v => cntNo == v.cntNo) == false)
            Modal.info({
              title: '信息',
              content: <div>
                <h3>导入成功{selects.length}个</h3>
                <h3>导入失败{notFind.length}个</h3>
                <div>{notFind.map((v, i) => <p key={i}>{v}</p>)}</div>
              </div>,
              okText: '确定',
            })

            let importRowKeys = [];
            if(selects && selects.length>0){
              selects.map((v,i)=>{
                importRowKeys.push(v.id);
              })
              this.setState({
                ...this.state.selectedRowKeys,
                selectedRowKeys:importRowKeys
              })
            }
          }else{
            Modal.info({
              title: '信息',
              content: '导入失败',
              okText: '确定',
            })
          }
         })
      }
      fr.readAsText(fileInput.files[0])
      fileInput.value = ''
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form;

    const columns = [
      {
        title: '序号',
        dataIndex: 'index'
      }, {
        title: '提单号',
        dataIndex: 'billNo'
      }, {
        title: '箱号',
        dataIndex: 'cntNo',
      }, {
        title: '箱型',
        dataIndex: 'cntType'
      }, {
        title: '船名/航次',
        dataIndex: 'vesselAndVoy',
        render: (text, record) => (
           (record.vesselName || '') + (record.vesselName && record.inBoundVoy ? '/' : '') + (record.inBoundVoy||'')
        )
      }, {
        title: '货主',
        dataIndex: 'cargoOwner'
      },{
        title: '箱主',
        dataIndex: 'cntOwner'
      },{
        title: '业务属性',
        dataIndex: 'tradeId',
        render(tradeId){
          return dict.tradeId[tradeId];
        }
      }
    ]

    return (
      <div className='booking-getWeight'>
        <Row style={{ textAlign: 'right', marginBottom: '20px' }}>
          <Button onClick={e => {this.props.hiddenDetailForm(this.props.record)}} type="primary" style={{ marginLeft: '20px' }}>返回</Button>
        </Row>
        <Row>
          <Col span={15}>
            <Card>
              <Form layout="inline">
                <FormItem label="提单号：" key="billNo">
                  { getFieldDecorator("billNo",)(<Input type="text"/>)}
                </FormItem>
                <FormItem label="箱号：" key="cntNo">
                  { getFieldDecorator("cntNo",)(<Input type="text"/>)}
                </FormItem>
                <FormItem>
                  <Button type="primary" style={{margin:'0 20px'}} onClick={this.handleSubmit}>查询</Button>
                  <Button type="primary" onClick={() => this.state.fileInput.click()}>导入<input ref={(x) => this.state.fileInput = x} hidden type="file" accept=".txt" onChange={this.fileImport.bind(this)}/></Button>
                </FormItem>
              </Form>
            </Card>
            <div className="content-wrap">
              <ETable
                rowKey={(record)=>(record.id)}
                rowSelection="checkbox"
                columns={columns}
                updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                selectedRowKeys={this.state.selectedRowKeys}
                dataSource={this.state.list}
                pagination={this.state.pagination}
              />
            </div>
          </Col>

          <Col span={8} offset={1}>
            <RightForm dispatchTruckComp = {this.dispatchTruckComp.bind(this)}/>
          </Col>
        </Row >
      </div>
    )
  }
}

export default (Form.create({})(GetDetailForm));