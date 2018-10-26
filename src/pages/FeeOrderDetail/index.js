import React from 'react'
import { Card, Button, Modal,Collapse } from 'antd'
import axios from '../../axios/index'
import Utils from '../../utils/utils'
import CommonTable from '../../components/CommonTable' 
import dict from '../../utils/dict'; 
import QueryForm from '../../components/QueryForm'; 
import '../../style/common.less'
  
const Panel = Collapse.Panel;
/**
 * 费目明细
 */
export default class FeeOrderDetail extends React.Component{

    state = {
        list:[],  
    }

    //固定参数
    params = { 
        pageSize:10,
        pageNo:1,
        totalCount:0
    }
 
    //数据接口定
    serviceInterface = {
        list:'/yybd/feeOrderDetail/list', 
    }

    //查询列表请求
    requestList = ()=>{
 
        axios.ajax({  
            method: 'POST',
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
                    item.key=item.orderNo
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
            type:'CASCADER',
            label:'费目类型',
            field:'fmTypeArray',
            dict: dict.FmTypeArray 
        },
        {
            type:'LOCAL_DICT',
            label:'尺寸',
            field:'cntSize',
            dict: dict.CntSize,
            width: 80
        },
        {
            type:'LOCAL_DICT',
            label:'业务类型',
            field:'busType',
            dict: dict.BusType,
            width: 120
        },
        {
            type:'DICT',
            label:'船名',
            field:'vesselName',  
            width:80,
            dictKey: dict.remoteDictKey.shipRecord
        }, 
        {
            type:'INPUT',
            label:'航次',
            field:'voyage',  
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
            label:'船公司',
            field:'shipComp',  
            width:80,
            dictKey: dict.remoteDictKey.shipCompanyCode
        }, 
        {
            type:'DICT',
            label:'拖车行',
            field:'truckComp',  
            width:80,
            dictKey: dict.remoteDictKey.truckCompAll
        }, 
        {
            type:'DICT',
            label:'车牌号',
            field:'truckNo',  
            width:80,
            dictKey: dict.remoteDictKey.getTruckListAllGroupComp
        }, 
        {
            type:'LOCAL_DICT',
            label:'结算类型',
            field:'balanceType',
            dict: dict.BalanceType,
            width: 120
        },
        {
            type:'LOCAL_DICT',
            label:'办单状态',
            field:'eirState',
            dict: dict.EirState,
            width: 120
        },
        {
            type:'LOCAL_DICT',
            label:'支付状态',
            field:'payStatus',
            dict: dict.PayStatus,
            width: 120
        },
        {
            type:'LOCAL_DICT',
            label:'业务属性',
            field:'tradeType',
            dict: dict.TradeType,
            width: 80
        },
        {   type:"DATEPICKER",
            label:'开始时间',
            field:'startTime',
            width:80
        },
        {   type:"DATEPICKER",
            label:'结束时间',
            field:'endTime',
            width:80
        } 

    ]

    //查询表单中查询按钮回调函数
    handleFilter = (params)=>{ 
        let _p = { 
            ... params, 
            pageNo:1,
            pageSize:this.params.pageSize
        }

        //将费目类型数据从数组中取出
        if(_p['fmTypeArray']){
            _p['fmType'] = _p['fmTypeArray'][0];
            _p['feeMoreType'] = _p['fmTypeArray'][1];
            _p['fmTypeArray'] = '';
        }

        this.params = _p;
        this.requestList();
    }

    //同步状态
    handleRefresh = ()=>{
        axios.ajax({
            url: '/yybd/feeOrderDetail/syncStatus', 
        }).then((res)=>{
            if(res.code == '200'){ 
                Modal.info({
                    title: '提示',
                    content: '刷新成功！'
                });
                this.requestList();
            }
        })
    }
   
    render(){
  
        //表头定义
        const columns = [
            {
                title: '船名',
                dataIndex: 'shipName'
            },
            {
                title: '航次',
                dataIndex: 'voyage'
            },
            {
                title: '费目',
                dataIndex: 'feeMoreType',
                render(feeMoreType){
                    return dict.FeeMoreType[feeMoreType];
                }
            }, 
            {
                title: '业务类型',
                dataIndex: 'busType',
                render(busType){
                    return dict.BusType[busType];
                }
            }, 
            {
                title: '业务属性',
                dataIndex: 'tradeType',
                render(tradeType){
                    return dict.TradeType[tradeType];
                }
            }, 
            {
                title: '箱号',
                dataIndex: 'cntNo'
            }, 
            {
                title: '尺寸',
                dataIndex: 'cntSize'
            }, 
            {
                title: '金额',
                dataIndex: 'orderPrice' 
            },
            {
                title: '付款对象',
                dataIndex: 'payObjectType',
                render(payObjectType){
                    return dict.PayObjectType[payObjectType];
                }
            }, 
            {
                title: '船公司',
                dataIndex: 'shipCompName'
            }, 
            {
                title: '拖车行',
                dataIndex: 'truckCompName' 
            }, 
            {
                title: '车牌号',
                dataIndex: 'truckLIP' 
            }, 
            {
                title: '办单真实车牌号',
                dataIndex: 'truckLIP2' 
            }, 
            {
                title: '结算类型',
                dataIndex: 'balanceType',
                render(balanceType){
                    return dict.BalanceType[balanceType];
                }
            }, 
            {
                title: '支付状态',
                dataIndex: 'payStatus',
                render(payStatus){
                    return dict.PayStatus[payStatus];
                }
            }, 
            {
                title: '计费人',
                dataIndex: 'fmObjectName'
            },
            {
                title: '创建时间',
                dataIndex: 'createTime', 
                render(createTime){
                    return Utils.formateDate1(createTime);
                }
            },
            {
                title: '提箱办单状态',
                dataIndex: 'eirState', 
                render(eirState){
                    return dict.EirState[eirState];
                }
            }
        ];
    
        return (
            <div> 
                <Collapse>
                    <Panel header="查询" key="1" className="card-shadow">
                    <QueryForm formList={this.queryFormItemList} filterSubmit={this.handleFilter}/>                     
                   
                    
                    </Panel>
                </Collapse>

                <Card style={{marginTop:'20px'}} className="card-shadow">
                    <Button 
                        type="primary"
                        onClick={()=>{this.handleRefresh()}}
                        style={{float:'right',marginLeft:'10px',marginBottom:'10px'}}
                    >立即刷新</Button>
                     <Button 
                        type="primary"   
                        style={{float:'right',marginBottom:'10px'}}
                    >导出</Button>
                    <CommonTable
                        rowSelection={false}
                        columns={columns} 
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                    />  
                </Card>
               
            </div>
        );
    }
}
 