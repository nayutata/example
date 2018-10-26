import React from 'react'
import {Form,Card,Row,Col,Button} from 'antd'
import ETable from '../../components/ETable/index'
import '../../style/common.less'
import Utils from '../../utils/utils'
import axios from '../../axios/index'
import dict from '../../utils/dict'; 

class RefundCheckOrderDetails extends React.Component {

    state={
        list:[],
        pOrderNo:this.props.pOrderNo,
        showRefundDetailForm:true,//是否显示订单详情还是费目详情
    }

    componentDidMount=()=>{

     }

     detailsRefundOnClick=(feeOrderList)=>{
        //let RefundCheckOrderDetailsList=this.props.RefundCheckOrderDetailsList;
        this.setState({
            list:feeOrderList,
            showRefundDetailForm:false
        })


     }

     hiddenTwoDetailForm=()=>{
       this.setState({
        showRefundDetailForm:true
       })
     }
     
    render () {

        const columnsFee=[{
            title: '船名',
            dataIndex: 'shipName',
          },{
            title: '航次',
            dataIndex: 'voyage',
          },{
            title: '费目',
            dataIndex: 'feeMoreType',
            render(feeMoreType){
              return dict.FeeMoreType[feeMoreType];
            }
          },{
            title: '业务类型',
            dataIndex: 'busType',
            render(busType){
              return dict.BusType[busType];
            }
          },{
            title: '箱号',
            dataIndex: 'cntNo',
          },
          {
            title: '尺寸',
            dataIndex: 'cntSize',
          },
          {
            title: '金额',
            dataIndex: 'orderPrice',
            render(orderPrice){
              return orderPrice+"元";
            }
          },{
            title: '付款对象',
            dataIndex: 'payObjectName',
          },{
            title: '船公司',
            dataIndex: 'shipCompName',
          },{
            title: '拖车行',
            dataIndex: 'truckCompName',
          },{
            title: '车牌号',
            dataIndex: 'truckLIP',
          },
          
          {
            title: '办单真实车牌号',
            dataIndex: 'realTruckLIP',
          },
          
          {
            title: '结算类型',
            dataIndex: 'balanceType',
            render(balanceType){
              return dict.BalanceType[balanceType];
            }
          },{
            title: '支付状态',
            dataIndex: 'payStatus',
            render(payStatus){
              return dict.PayStatus[payStatus];
            }
          },{
            title: '计费人',
            dataIndex: 'skCompanyName',
          },{
            title: '创建时间',
            dataIndex: 'createTime',
            render(createTime){
              return Utils.formateDate1(createTime);
          }
          },{
            title: '提箱办单状态',
            dataIndex: 'eirState',
            render(eirState){
              return dict.EirState[eirState];
          }
          },
        
        
        ]

        const columnsOfNoDevanning= [  {
            title: '　　　　　　',
            dataIndex: 'batchNo',
            render:(batchNo, record) => (
            <div>
            
                <Row style={{ textAlign: 'left' }}>
                    <Col span={8} style={{ textAlign: 'right' }}>{<span>所属订单号:</span>}</Col>
                    <Col span={16} style={{ textAlign: 'center' }}>  {<div style={{ textAlign: 'left' }}><span>{record.pOrderNo}</span></div>} </Col>
                </Row>
                <Row style={{ textAlign: 'left' }}>
                    <Col span={8} style={{ textAlign: 'right' }}>{<span>订单描述:</span>}</Col>
                    <Col span={16} style={{ textAlign: 'center' }}> {<div style={{ textAlign: 'left' }}><span>{record.title}</span></div>} </Col>
                </Row>
                <Row style={{ textAlign: 'left' }}>
                    <Col span={8} style={{ textAlign: 'right' }}>{<span>资金平台备注:</span>}</Col>
                    <Col span={16} style={{ textAlign: 'center' }}>  {<div style={{ textAlign: 'left' }}><span>{record.refstr2}</span></div>} </Col>
                </Row>
            </div>
              ) 
          },
          {
            title: '订单号',
            dataIndex: 'orderNo',
          },
          {
            title: '支付流水号',
            dataIndex: 'paySerialNo'
          },
          {
            title: '支付金额',
            dataIndex: 'totalAmount'
          }, {
            title: '付款方',
            dataIndex: 'payer'
          }, {
            title: '收款方',
            dataIndex: 'payee'
          }, {
            title: '支付状态',
            dataIndex: 'status',
            render(status){
                return dict.refundStatus[status];
            }
          }, {
            dataIndex: 'createTime',
            render(createTime){
                return Utils.formateDate1(createTime);
            }
          }, {
            title: '操作',
            dataIndex: 'action',
            render:(action, record) => (
                <span className="table-operation">
                    <a href="javascript:;" onClick={()=>this.detailsRefundOnClick(record.feeOrderList)}>查看</a>　
                </span>
              )
          }
        ]

        return (
            <div>
              <Card>
                  
                  <div>
                        <div style={{ display: this.state.showRefundDetailForm ? 'block' : 'none' }}>
                              <Row style={{ textAlign: 'right', marginBottom: '20px' }}>
                                <Button onClick={this.props.hiddenDetailForm} type="primary" style={{ marginLeft: '20px' }}>返回</Button>
                              </Row>
                                {/* sdfd:{this.props.pOrderNo}: */}
                                <ETable
                                    rowKey={(record)=>(record.eirId)}
                                    //rowSelection="checkbox"
                                    columns={columnsOfNoDevanning}
                                    updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                                    selectedRowKeys={this.state.selectedRowKeys}
                                    dataSource={this.props.RefundCheckOrderDetailsList}
                                />
                        </div> 

                        <div style={{ display: !this.state.showRefundDetailForm ? 'block' : 'none' }}>
                              <Row style={{ textAlign: 'right', marginBottom: '20px' }}>
                                <Button onClick={this.hiddenTwoDetailForm} type="primary" style={{ marginLeft: '20px' }}>返回</Button>
                              </Row>
                              {/* sdfd:{this.props.pOrderNo}: */}
                              <ETable
                                  rowKey={(record)=>(record.eirId)}
                                  //rowSelection="checkbox"
                                  scroll={{ x: 2000 }}
                                  columns={columnsFee}
                                  updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                                  selectedRowKeys={this.state.selectedRowKeys}
                                  dataSource={this.state.list}
                              />
                        </div> 
                    </div>
                  </Card>
            </div>
        )
    }
}
 export default Form.create()(RefundCheckOrderDetails);
