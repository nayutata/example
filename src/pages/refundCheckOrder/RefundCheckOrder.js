import React, { Component } from 'react'
import {Card,Button,Modal,Row,Col,Form,Select,Radio,Input} from 'antd'
import ETable from '../../components/ETable/index'  
import QueryForm from '../../components/QueryForm';
import '../../style/common.less'
import Utils from '../../utils/utils'
import axios from '../../axios/index'
import dict from '../../utils/dict'; 
import RefundCheckOrderDetails from './RefundCheckOrderDetails'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
 class refundCheckOrder extends Component {

    state={
        list:[],//退款审核列表数据
        eirIdList:[],//eirId弹窗款列表数据
        title:'',
        isFormVisible:false,//查询erpId办单状态列表
        showDetailForm:true,//控制是否显示详情
        RefundCheckOrderDetailsList:[],//详情列表数据
        isRefundReviewVisible:false,//退款审核弹窗框是否显示
        value:2,
        refundInfo:null,
        textArealabel:'拒绝理由',//退款审核列表文本款
    }
    //查询表单定义
    queryFormItemList = [
        {
            type:'INPUT',
            label:'批次号',
            field:'batchNo',  
            width:80 
        },
        {
            type:'INPUT',
            label:'订单号',
            field:'orderNo',  
            width:80 
        },
        {
            type:'INPUT',
            label:'箱号',
            field:'cntNo',  
            width:80 
        },
        {

            type:'DICT',
            label:'车牌号',
            field:'truckNo',  
            width:80,
            dictKey: dict.remoteDictKey.getTruckListAllGroupComp
        },
        {
            type:'DICT',
            label:'付款方',
            field:'payerId',  
            width:80,
            dictKey: dict.remoteDictKey.truckCompAll
        }
    ]
    //查询数据
    params = { 
        pageSize:20,
        pageNo:1,
        totalCount:0,
        // eirId:'5516985754003',
    }
    
    componentDidMount=()=>{
       this.requestList();
    }

    //
    handleSubmit=()=>{

    }

    //表单查询事件
    handleFilter = (params)=>{ 
        let _p = { 
            ... params, 
            pageNo:1,
            pageSize:this.params.pageSize
        }
        this.params = _p;
        this.requestList();
    }
    //获取列表数据
    requestList = ()=>{
        
               axios.ajax({  
                   url:'/yybd/refundCheckOrder/list',  
                   data:{
                       params:{
                           ... this.params 
                       }
                   }
               }).then((res)=>{
                   let _this = this;
                   if(res && res.data && res.data.pageNo == 1){
                       _this.params.totalCount = res.data.totalCount;
                   }else{
                       res.data.totalCount = _this.params.totalCount
                   }
                   if(res.data.list){
                       res.data.list.map((item,index)=>{
                           item.key=item.id
                           return item;
                       })
                   }
         
                   this.setState({
                       list:(res.data.list)?res.data.list:[],
                       pagination:Utils.pagination(res.data,(current)=>{
                           _this.params.pageNo = current;
                           _this.requestList();
                       })
                   })
                     
               })
           }
        //获取eirId办单数据
        eirIdSubmit=(eirId)=>{
            axios.ajax({  
                url:'/yybd/truckCompany/syncOrder',  
                data:{
                    params:{
                        ...eirId
                    }
                }
            }).then((res)=>{
                let _this = this;
                if(res.data.list){
                    res.data.list.map((item,index)=>{
                        item.key=item.id
                        return item;
                    })
                }
      
                this.setState({
                    eirIdList:(res.data.list)?res.data.list:[],
                })
                  
            })
            this.setState({
                title:'创建',
                isFormVisible:true,
                isDrawerVisible:true,
            })


        }
        //详细页面点击返回时触发的事件
        hiddenDetailForm=()=>{
            this.setState({
                showDetailForm:true
            })
        }

    //获取详情数据
    detailsOnClick=(pOrderNo)=>{

        axios.ajax({  
            url:'/yybd/feePayOrderDetail/orderNotBalanceDetailShow',  
            data:{
                params:{
                    pOrderNo:pOrderNo
                }
            }
        }).then((res)=>{
            let _this = this;

            if(res.data.list){
                res.data.list.map((item,index)=>{
                    item.key=item.id
                    return item;
                })
            }
  
            this.setState({
                RefundCheckOrderDetailsList:(res.data.list)?res.data.list:[],
            })
              
        })
        this.setState({
            showDetailForm:false
        })
        
    }
    //判断是否显示退款审核
    refundReview=(status,checkStatus,orderNo)=>{
        // 
        if (status==5||status==9){
            if(checkStatus==0){
                return <a href="javascript:;" onClick={()=>this.refundReviewOnClick(orderNo)}>退款审核</a>
            }
        }
    }

    refundReviewOnClick=(orderNo)=>{
        axios.ajax({  
            url:'/yybd/refundCheckOrder/findRefundInfo',  
            data:{
                params:{
                    pOrderNo:orderNo
                }
            }
        }).then((res)=>{
            let _this = this;
            let refundInfo=null;
            if(res.data.entity){
                refundInfo=res.data.entity;
                refundInfo.createTime=Utils.formateDate1(res.data.entity.createTime);

            }
  
            this.setState({
                refundInfo
            })
              
        })

        this.setState({
            isRefundReviewVisible:true,
        })
    }
    //退款审核弹窗框点击事件
    handleRefundReviewSubmit=(e)=>{

        let {refundInfo}=this.state;
        let refundReviewFrom=this.props.form.getFieldsValue();

        axios.ajax({  
            url:'/yybd/refundCheckOrder/checkRefund',  
            data:{
                params:{
                    id:refundInfo.id,
                    pOrderNo:refundInfo.orderNo,
                    checkStatus:refundReviewFrom.checkStatus,
                    refusedRemark:refundReviewFrom.refusedRemark
                }
            }
        }).then((res)=>{
             if(res.code==200){
                this.requestList();
                this.setState({
                    isRefundReviewVisible:false
                })
             }else{
                 //失败
             } 
        })

    }

    oncheckStatusChange=(e)=>{
        let textArealabel=null;
        if(e.target.value==2){
            textArealabel="拒绝理由";
        }else{
            textArealabel="审核说明";
        }
        this.setState({
            textArealabel
        })
    }

    render () {
        const { getFieldDecorator } = this.props.form;
        //退款审核列表表头定义
        const columnsOfNoDevanning= [  {
            title: '订单号',
            dataIndex: 'orderNo'
          } , {
            title: '箱号',
            dataIndex: 'cntNo',
            render(cntNo){
                return cntNo?cntNo:"--"
            }
          } , {
            title: 'EIRID',
            dataIndex: 'eirId',
            render:(eirId, record) => (
                <span className="table-operation">
                    <a href="javascript:;" onClick={()=>this.eirIdSubmit({eirId})}>{eirId}</a>
                </span>
              ) 
          } , {
            title: '车牌号',
            dataIndex: 'truckNo',
            
          } , {
            title: '实际订单金额',
            dataIndex: 'payMoney',
          } , {
            title: '付款方',
            dataIndex: 'payer',
          } , {
            title: '业务类型',
            dataIndex: 'busType',
            render(busType){
                return dict.busType[busType];
            }
          } ,{
            title: '申请时间',
            dataIndex: 'createTime',
            render(createTime){
                return Utils.formateDate1(createTime);
            }
          } ,
          
          {
            title: '修改时间',
            dataIndex: 'updateTime',
            render(updateTime){
                return Utils.formateDate1(updateTime);
            }
          } ,{
            title: '支付状态',
            dataIndex: 'status',
            render(status){
                return dict.refundStatus[status];
            }
          } ,{
            title: '操作',
            dataIndex: 'action',
            width:180,
            render:(action, record) => (
                <span className="table-operation">
                    <a href="javascript:;" onClick={()=>this.detailsOnClick(record.orderNo)}>详情</a>　
                  {this.refundReview(record.status,record.checkStatus,record.orderNo)}
                </span>
              ) 
          } 
        ];


        const columnsEirId= [  {
            title: '预录入ID',
            dataIndex: 'eirId'
          } , {
            title: '箱号',
            dataIndex: 'containerNo',
            render(cntNo){
                return cntNo?cntNo:"--"
            }
          } , {
            title: '提箱办单车牌号	',
            dataIndex: 'dtruckNo',
            
          } , {
            title: '提箱状态',
            dataIndex: 'deirState',
            render(deirState){
                return dict.deirState[deirState];
            }
            
          } , {
            title: '提箱空重',
            dataIndex: 'demptyfull',
            render(demptyfull){
                return dict.demptyfull[demptyfull];
            }
          } , {
            title: '提箱办单时间',
            dataIndex: 'dingateTime',
            render(dingateTime){
                return Utils.formateDate1(dingateTime);
            }
          } , {
            title: '提箱箱况',
            dataIndex: 'disdamage',
            render(disdamage){
                return dict.damage[disdamage];
            }
            
          } ,{
            title: '返箱办单车牌号',
            dataIndex: 'rtruckNo',
            
          } ,
          
          {
            title: '返箱状态',
            dataIndex: 'reirState',
            render(reirState){
                return dict.reirState[reirState];
            }
            
          } ,{
            title: '收箱空重',
            dataIndex: 'remptyfull',
            render(remptyfull){
                return dict.remptyfull[remptyfull];
            }
          } ,{
            title: '返箱办单时间',
            dataIndex: 'ringateTime',
            render(ringateTime){
                return Utils.formateDate1(ringateTime);
            }
          } ,{
            title: '返箱箱况',
            dataIndex: 'risdamage',
            render(risdamage){
                return dict.damage[risdamage];
            }
          } ,{
            title: '最后更新时间',
            dataIndex: 'lastUpdateTime',
            render(lastUpdateTime){
                return Utils.formateDate1(lastUpdateTime);
            }
          } 
         
        ];

        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        const {refundInfo}=this.state;
        return (
            <div>
                    <Card>
                        <div style={{ display: this.state.showDetailForm ? 'block' : 'none' }}>
                        <Card className="card-shadow">
                            <QueryForm formList={this.queryFormItemList} filterSubmit={this.handleFilter}/>
                        </Card> 

                        <Card style={{marginTop:'20px'}} className="card-shadow">
                            <ETable
                                rowKey={(record)=>(record.eirId)}
                                //rowSelection="checkbox"
                                columns={columnsOfNoDevanning}
                                updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                                selectedRowKeys={this.state.selectedRowKeys}
                                dataSource={this.state.list}
                            />   
                        </Card>

                        <Modal
                        //title={this.state.title}
                        visible={this.state.isFormVisible}
                        //onOk={this.handleSubmit}
                        width={800} 
                        confirmLoading={false}
                        width={1600}
                        footer={null}
                        onCancel={()=>{
                            // this.dataForm.props.form.resetFields();
                            this.setState({
                                isFormVisible:false,
                                data:''
                            })
                        }}
                    >
                        <ETable
                                    rowKey={(record)=>(record.eirId)}
                                    //rowSelection="checkbox"
                                    columns={columnsEirId}
                                    updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                                    selectedRowKeys={this.state.selectedRowKeys}
                                    dataSource={this.state.eirIdList}
                                />
                    </Modal>

                    <Modal
                        //title={this.state.title}
                        visible={this.state.isRefundReviewVisible}
                        onOk={this.handleRefundReviewSubmit}
                        confirmLoading={false}
                        onCancel={()=>{
                            // this.dataForm.props.form.resetFields();
                            this.setState({
                                isRefundReviewVisible:false,
                                data:''
                            })
                        }}
                    >
                    <Form layout="horizontal">
                        <FormItem label="申请时间" {...formItemLayout}>
                        
                            {refundInfo?refundInfo.createTime:null}
                        </FormItem>
                        <FormItem label="申请理由" {...formItemLayout}> 
                            {refundInfo?refundInfo.refundRemark:null}
                        </FormItem>
                        <FormItem label="" {...formItemLayout} style={{textAlign:"center"}}>
                            {
                                getFieldDecorator('checkStatus',{
                                    initialValue:this.state.value
                                })(
                                    <RadioGroup onChange={this.oncheckStatusChange} value={this.state.value}>
                                        <Radio value={1}>通过</Radio>
                                        <Radio value={2}>拒绝</Radio>
                                </RadioGroup>
                                )
                            }
                        </FormItem>
                        <FormItem label={this.state.textArealabel} {...formItemLayout}> 
                            {
                                getFieldDecorator('refusedRemark',{
                                    initialValue:refundInfo?refundInfo.refusedRemark:null
                                })(
                                    <TextArea placeholder={'请输入'+this.state.textArealabel} rows={5} />
                                )
                            }
                        </FormItem>
                    </Form>
                    </Modal>
            </div>

            <div style={{ display: !this.state.showDetailForm ? 'block' : 'none' }}>
                <RefundCheckOrderDetails RefundCheckOrderDetailsList={this.state.RefundCheckOrderDetailsList} hiddenDetailForm={this.hiddenDetailForm.bind(this)} />
            </div>

                </Card>
            </div>
        )
    }
}

export default Form.create()(refundCheckOrder);