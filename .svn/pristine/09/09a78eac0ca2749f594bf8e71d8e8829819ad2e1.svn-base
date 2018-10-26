import React from 'react'
import { Card, Button,  notification, Modal, Pagination } from 'antd'
import axios from '../../axios/index'
import Utils from '../../utils/utils'
import CommonTable from '../../components/CommonTable'  
import QueryForm from '../../components/QueryForm';
import '../../style/common.less'
 

/**
 * 拆箱
 */
export default class NoDevanningList extends React.Component{

    state = {
        list:[], 
    }

    params = { 
        pageSize:10,
        pageNo:1,
        totalCount:0,
        devanningStatus:'0',
        isDelete:'0'
    }
 

    requestList = ()=>{
 
        axios.ajax({  
            url:'/yybd/cntOrderDetail/devanningList',  
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
            // if(res.data.list){
            //     res.data.list.map((item,index)=>{
            //         // item.key=item.id
            //         return item;
            //     })
            // }
  
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

    queryFormItemList = [
         
        {
            type:'DICT',
            label:'船名',
            field:'vesselName',  
            width:80,
            dictKey:'shipRecord'
        } ,
        {
            type:'INPUT',
            label:'航次',
            field:'voyage',  
            width:80 
        },   
        {
            type:'INPUT',
            label:'提单号',
            field:'billNo',  
            width:80 
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

    handleFilter = (params)=>{ 
        let _p = { 
            ... params, 
            pageNo:1,
            pageSize:this.params.pageSize
        }
        this.params = _p;
        this.requestList();
    }

    // 操作拆箱
    handleChaiXiang = (record)=>{ 
        debugger;
        let eirids = [];
        if(record){
            eirids.push(record.eirId)
        }else{
            const {selectedRowKeys} = this.state;
            if(selectedRowKeys && selectedRowKeys.length>0){
                eirids = selectedRowKeys;
            }
        }

        if(eirids.length==0)return;

        Modal.confirm({
            title:'确认',
            content: '确定要拆箱吗?',
            onOk:()=>{
                axios.ajax({
                    url:'/yybd/cntOrderDetail/batchDevanning', 
                    data:{
                        params:{
                            eirids:eirids
                        }
                    }
                }).then((res)=>{
                    if(res.code == '200'){  
                        notification.open({
                            message: '通知',
                            description: res.detail
                          });
                        this.requestList();
                    }
                })
            }
        });
          
    }
 

    render(){

        //未拆箱的表头
        const columnsOfNoDevanning= [  {
            title: '箱号',
            dataIndex: 'cntNo'
          } , {
            title: '箱型/尺寸',
            dataIndex: 'cntNo11',
            render:(text, record) => (
                <span>
                    {record.flag3}/{record.flag4}
                </span>
            )
          } , {
            title: '提单号',
            dataIndex: 'billNo'
          } , {
            title: '船名',
            dataIndex: 'flag2'
          } , {
            title: '航次',
            dataIndex: 'voyage'
          } , {
            title: '船公司',
            dataIndex: 'flag5'
          } , {
            title: '登记状态',
            dataIndex: 'devanningStatus',
            render(devanningStatus){
                return devanningStatus == '0' ?'未拆箱':'已拆箱'
            }
          } ,{
            title: '操作',
            dataIndex: 'action',
            width:180,
            render:(text, record) => (
                <span className="table-operation">
                  <Button type="primary" size="small"   onClick={()=>this.handleChaiXiang(record)}>拆箱</Button>
                </span>
              ) 
          } 
        ];

        const btnStyle={
            float : 'right'
        }
     
        return (
            <div> 
                <Card className="card-shadow">
                    <QueryForm formList={this.queryFormItemList} filterSubmit={this.handleFilter}/>
                    <Button type="primary" style={btnStyle} onClick={()=>this.handleChaiXiang()}>批量拆箱</Button>
                </Card> 

                <Card style={{marginTop:'20px'}} className="card-shadow">
                    <CommonTable
                        rowKey="eirId"
                        rowSelection="checkbox"
                        columns={columnsOfNoDevanning}
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)} 
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                    />  
             
                </Card>
            </div>
        );
    }
}
 