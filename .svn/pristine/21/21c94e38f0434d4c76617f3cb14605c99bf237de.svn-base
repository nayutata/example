import React, { Component } from 'react'
import {Card,Button} from 'antd'
import ETable from '../../components/ETable/index'  
import QueryForm from '../../components/QueryForm';
import '../../style/common.less'
import Utils from '../../utils/utils'
import axios from '../../axios/index'
import dict from '../../utils/dict'; 

// 测试eirId=“5516985754003”
export default class OrderStatus extends Component {

    state={
        list:[],
    }

    queryFormItemList = [
       {
           type:'INPUT',
           label:'预录入ID',
           field:'eirId',  
           width:80 
       }
   ]

   params = { 
        pageSize:20,
        pageNo:1,
        totalCount:0,
        // eirId:'5516985754003',
    }

   handleFilter = (params)=>{ 
    let _p = { 
        ... params, 
        pageNo:1,
        pageSize:this.params.pageSize
    }
    this.params = _p;
    this.requestList();
    }

    requestList = ()=>{
    
           axios.ajax({  
               url:'/yybd/truckCompany/syncOrder',  
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

    render () {
        
        const columnsOfNoDevanning= [  {
            title: '预录入ID',
            dataIndex: 'eirId'
          } , {
            title: '箱号',
            dataIndex: 'containerNo',
          } , {
            title: '提箱办单车牌号',
            dataIndex: 'dtruckNo'
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
          } 
          ,{
            title: '返箱箱况',
            dataIndex: 'risdamage',
            render(risdamage){
                return dict.damage[risdamage];
            }
          } 
          ,{
            title: '最后更新时间',
            dataIndex: 'lastUpdateTime',
            render(lastUpdateTime){
                return Utils.formateDate1(lastUpdateTime);
            }
          } 
        ];

        return (
            <div>
                <Card className="card-shadow">
                    <QueryForm formList={this.queryFormItemList} filterSubmit={this.handleFilter}/>
                    {/* <QueryForm formList={this.queryFormItemList} filterSubmit={this.handleFilter}/> */}
                    {/* <Button type="primary" style={btnStyle} onClick={()=>this.handleChaiXiang()}>批量拆箱</Button> */}
                </Card> 

                <Card style={{marginTop:'20px'}} className="card-shadow">
                     <ETable
                        rowKey={(record)=>(record.eirId)}
                        rowSelection="checkbox"
                        columns={columnsOfNoDevanning}
                        updateSelectedItem={Utils.updateSelectedItem.bind(this)}
                        selectedRowKeys={this.state.selectedRowKeys}
                        dataSource={this.state.list}
                    />   
                </Card>
            </div>
        )
    }
}

// export default Form.create()(OrderStatus);