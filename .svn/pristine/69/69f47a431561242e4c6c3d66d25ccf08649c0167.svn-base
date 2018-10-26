import React from 'react'
import { Card, Button, Modal } from 'antd'
import axios from '../../axios/index'
import Utils from '../../utils/utils'
import CommonTable from '../../components/CommonTable' 
import dict from '../../utils/dict'; 
import QueryForm from '../../components/QueryForm';
import SimpleForm from '../../components/SimpleForm';
import '../../style/common.less'
  
/**
 * 车辆备案
 */
export default class TruckRecord extends React.Component{

    state = {
        list:[],  
    }

    params = { 
        pageSize:10,
        pageNo:1,
        totalCount:0
    }
 
    //统一在一个地方定义接口
    serviceInterface = {
        list:'/yybd/truck/list',
        create:'/yybd/truck/create',
        edit:'/yybd/truck/update',
        delete:'/yybd/truck/delete',
        toggle:'/yybd/truck/toggle'
    }

    requestList = ()=>{
 
        axios.ajax({  
            url: this.serviceInterface.list,  
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
                    item.key=item.truckNo
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

    componentDidMount(){
        this.requestList();
    }

    //查询表单的数据项
    queryFormItemList = [ 
        {
            type:'DICT',
            label:'车牌号',
            field:'truckNo',  
            dictKey: 'truckNoLevelNameListAll'
        }  
    ]

    //查询表单中查询按钮回调函数
    handleFilter = (params)=>{ 
        let _p = { 
            ... params, 
            pageNo:1,
            pageSize:this.params.pageSize
        }
        this.params = _p;
        this.requestList();
    }
  
    // 操作会员
    handleOperator = (type,record)=>{
        let item = this.state.selectedItem;
        if(type =='create'){
            this.setState({
                title:'创建',
                isFormVisible:true,
                type
            })
        }else if(type=="edit" || type=='detail'){
            item = record;
            if(!item){
                Modal.info({
                    title: '信息',
                    content: '请选择!'
                })
                return;
            }
            this.setState({
                title:type=='edit'?'编辑':'查看',
                isFormVisible:true,
                data:item,
                type
            })
        }else if(type=='delete'){
            item = record;
            if(!item){
                Modal.info({
                    title: '信息',
                    content: '请选择!'
                })
                return;
            }
            Modal.confirm({
                title:'确认',
                content: '确定要删除此吗?',
                onOk:()=>{
                    axios.ajax({
                        url:this.serviceInterface[type],
                        data:{
                            params:{
                                truckNo:item.truckNo
                            }
                        }
                    }).then((res)=>{
                        if(res.code == '200'){ 
                            this.requestList();
                        }
                    })
                }
            });
        }else if(type=='toggle'){
            item = record;
            if(!item){
                Modal.info({
                    title: '信息',
                    content: '请选择!'
                })
                return;
            }
            Modal.confirm({
                title:'确认',
                content: '确定要切换吗?',
                onOk:()=>{
                    axios.ajax({
                        url:this.serviceInterface[type],
                        data:{
                            params:{
                                truckNo:item.truckNo
                            }
                        }
                    }).then((res)=>{
                        if(res.code == '200'){ 
                            this.requestList();
                        }
                    })
                }
            });
        }
    }

    //获取海关回执报文
    getTradeRsAndUpdate = ()=>{
        Modal.confirm({
            title:'确认',
            content: '确定要获取海关回执报文吗?',
            onOk:()=>{
                axios.ajax({
                    url: '/yybd/truck/getTradeRsAndUpdate', 
                }).then((res)=>{
                    
                })
            }
        });
    }

    handleSubmit = ()=>{
        let type = this.state.type;
        let data = this.truckForm.props.form.getFieldsValue();
        if(data) data = Utils.flatFormValue(data);
   
        axios.ajax({
            method: 'POST',
            url: this.serviceInterface[type],
            data:{
                params:{
                    ...data
                }
            }
        }).then((res)=>{
            if(res.code == '200'){
                this.setState({
                    isFormVisible:false,
                    data:''
                }) 
                this.truckForm.props.form.resetFields();
                this.requestList();
            }
        })
    }

    render(){
  
        //表头定义
        const columns = [
          {
            title: '车牌号',
            dataIndex: 'truckLIP'
          }, {
            title: '司机',
            dataIndex: 'contactor'
          } , {
            title: '手机号',
            dataIndex: 'mobile' 
          } , {
            title: '车辆分类',
            dataIndex: 'veSort',
            render(veSort){
                return dict.VeSort[veSort];
            }
          } , {
            title: '车辆类型',
            dataIndex: 'veType',
            render(veType){
                return dict.VeType[veType];
            }
          } , {
            title: '有效期',
            dataIndex: 'valDate',
            render(valDate){
                return Utils.formateDate2(valDate);
            }
          } , {
            title: '状态',
            dataIndex: 'isDispatch',
            render(isDispatch){
                return isDispatch == 'N' ?'不可派车':'可派车'
            }
          } , {
            title: '获取海关报文状态',
            dataIndex: 'tradeRsStatu',
            render(tradeRsStatu){
                return dict.TradeRsStatus[tradeRsStatu];
            }
          },{
            title: '操作',
            dataIndex: 'action',
            width:180,
            render:(text, record) => (
                <span className="table-operation">
                    <a href="javascript:;" onClick={()=>this.handleOperator('toggle',record)}>切换状态</a>
                    <a href="javascript:;" onClick={()=>this.handleOperator('edit',record)} style={{marginLeft:'10px'}}>编辑</a>
                    <a href="javascript:;" onClick={()=>this.handleOperator('delete',record)} style={{marginLeft:'10px'}}>删除</a>
                </span>
              ) 
          }  
        ];
  
        const truckFormItemDescList = [ 
            
            {
                type:'REMOTE_DICT',
                label:'车牌号',
                field:'truckNo',
                dictKey: 'getTruckListAllGroupComp' 
            },
            {
                type:'LOCAL_DICT',
                label:'车辆分类',
                field:'veSort',
                dict: dict.VeSort
            },
            {
                type:'LOCAL_DICT',
                label:'车辆类型',
                field:'veType',
                dict: dict.VeType
            },
            {
                type:'INPUT',
                label:'车辆自重',
                field:'veWt',
                placeholder:'单位(KG)',
            },
            {
                type:'INPUT',
                label:'司机',
                field:'contactor'
            },
            {
                type:'INPUT',
                label:'手机号',
                field:'mobile'
            },
            {
                type:'DATEPICKER',
                label:'有效日期',
                field:'valDate'
            },
        ]
     
        return (
            <div> 
                <Card className="card-shadow">
                    <QueryForm formList={this.queryFormItemList} filterSubmit={this.handleFilter}/>
                    <Button 
                        type="primary"  
                        onClick={()=>this.getTradeRsAndUpdate()}
                        style={{float:'right',marginLeft:'10px'}}
                    >获取海关回执报文</Button>
                    <Button 
                        type="primary"  
                        onClick={()=>this.handleOperator('create')}
                        style={{float:'right'}}
                    >新增</Button>
                    
                </Card> 

                <Card style={{marginTop:'20px'}} className="card-shadow">
                    <CommonTable
                        rowSelection={false}
                        columns={columns} 
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        rowKey={(record)=>(record.truckNo)}
                    />  
                </Card>
                <Modal
                    title={this.state.title}
                    visible={this.state.isFormVisible}
                    onOk={this.handleSubmit}
                    width={800}
                   
                    onCancel={()=>{
                        this.truckForm.props.form.resetFields();
                        this.setState({
                            isFormVisible:false,
                            data:''
                        })
                    }}
                >
                    <SimpleForm 
                        itemDesc={truckFormItemDescList} 
                        data={this.state.data} 
                        type={this.state.type} 
                        colNum ={2} //控制表单的列数
                        wrappedComponentRef={(inst) => this.truckForm = inst }
                    />
                </Modal>
            </div>
        );
    }
}
 