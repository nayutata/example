import React from 'react'
import { Card } from 'antd'
import axios from '../../axios/index'
import Utils from '../../utils/utils'
import CommonTable from '../../components/CommonTable' 
import utils from '../../utils/utils';
import QueryForm from '../../components/QueryForm';
import '../../style/common.less';

/**
 * 已拆箱
 */
export default class DevanningList extends React.Component{

    state = {
        list:[],  
    }

    params = { 
        pageSize:20,
        pageNo:1,
        totalCount:0,
        devanningStatus:'1',
        isDelete:'1'
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

    componentDidMount(){
        this.requestList();
    }

    queryFormItemList = [
         
        {
            type:'AcShipName',
            label:'船名',
            field:'vesselName',  
            width:80 
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
  

    render(){
  
        //已拆箱的表头
        const columnsOfDevanning = [{
            title: 'id',
            dataIndex: 'id'
          }, {
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
          } , {
            title: '登记时间',
            dataIndex: 'devanningTime',
            render(devanningTime){
                return utils.formateDate1(devanningTime);
            }
          }  
        ];
        
     
        return (
            <div> 
                <Card className="card-shadow">
                    <QueryForm formList={this.queryFormItemList} filterSubmit={this.handleFilter}/>
                </Card> 
                <Card style={{marginTop:'20px'}} className="card-shadow">
                <CommonTable
                    rowSelection={false}
                    columns={columnsOfDevanning}  
                    dataSource={this.state.list}
                    pagination={this.state.pagination}
                />  
                </Card>
            </div>
        );
    }
}
 