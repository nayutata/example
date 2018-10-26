import React from 'react'
import { Card, Button, Modal,Collapse,Drawer } from 'antd'
import axios from '../../axios/index'
import Utils from '../../utils/utils'
import CommonTable from '../../components/CommonTable' 
import dict from '../../utils/dict'; 
import QueryForm from '../../components/QueryForm';
import SimpleForm from '../../components/SimpleForm';
import { connect } from 'react-redux'
import { getDictList } from '../../redux/action'
import '../../style/common.less'
  
const Panel = Collapse.Panel;
/**
 * 费目配置
 */
class FeeConfigure extends React.Component{

    state = {
        isFormVisible:false,
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
        list:'/yybd/feeConfigure/list',
        create:'/yybd/feeConfigure/create',
        edit:'/yybd/feeConfigure/update',
        delete:'/yybd/feeConfigure/delete',
        toggle:'/yybd/feeConfigure/toggle'
    }

    //查询列表请求
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
            dict: dict.CntSize 
        },
        {
            type:'LOCAL_DICT',
            label:'业务类型',
            field:'busType',
            dict: dict.BusType 
        },
        {
            type:'LOCAL_DICT',
            label:'设置对象',
            field:'fmObjectType',
            dict: dict.FmObjectType 
        },
        {
            type:'LOCAL_DICT',
            label:'付款对象',
            field:'payObjectType',
            dict: dict.PayObjectType 
        },
        {
            type:'LOCAL_DICT',
            label:'业务属性',
            field:'tradeType',
            dict: dict.TradeType 
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
  
    //处理通用操作
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

            //拼装fmTypeArray数据
            item['fmTypeArray'] = [item.fmType,item.feeMoreType];

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
                                id:item.id
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
                                id:item.id
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
 
    //处理表单提交
    handleSubmit = ()=>{
        const {type} = this.state;

        this.dataForm.props.form.validateFields((err,values)=>{
            if(!err){
                let data = this.dataForm.props.form.getFieldsValue();
     
                if(data) {
                    data = Utils.flatFormValue(data);
                    //编辑的时候带上id
                    if(this.dataForm.props.data){
                        data['id'] = this.dataForm.props.data.id;
                    }
                }
        
                //从取出来
                if(data['fmTypeArray']){
                    data['fmType'] = data['fmTypeArray'][0];
                    data['feeMoreType'] = data['fmTypeArray'][1];
                    data['fmTypeArray'] = '';
                }
        
                //skCompanyType好像写死的
                data['skCompanyType'] = 0;
           
                axios.ajax({
                    method: 'POST',
                    url: this.serviceInterface[type],
                    data:{
                        params:{
                            ...data, 
                        }
                    }
                }).then((res)=>{
                    if(res.code == '200'){
                        this.setState({
                            isFormVisible:false,
                            data:''
                        }) 
                        this.dataForm.props.form.resetFields();
                        this.requestList();
                    }
                })
            }
        });
 
    }

    // onCloseDrawer = ()=>{
       
    //     console.log('onCloseDrawer',this.dataForm);
    //     this.dataForm.resetFields();
    //     this.setState({
    //         isFormVisible:false
    //     });
    // }

    render(){
        const {dispatch} = this.props;
        const _this = this;

        //表头定义
        const columns = [
          {
            title: '费目',
            dataIndex: 'fmName'
          }, {
            title: '业务类型',
            dataIndex: 'busType',
            render(busType){
                return dict.BusType[busType];
            }
          } , {
            title: '业务属性',
            dataIndex: 'tradeType',
            render(tradeType){
                return dict.TradeType[tradeType];
            }
          } , {
            title: '尺寸',
            dataIndex: 'cntSize'
          } , {
            title: '设置对象',
            dataIndex: 'fmObjectType',
            render(fmObjectType){
                return dict.FmObjectType[fmObjectType];
            }
          } , {
            title: '付款对象',
            dataIndex: 'payObjectType',
            render(payObjectType){
                return dict.PayObjectType[payObjectType];
            }
          } , {
            title: '是否收费',
            dataIndex: 'ispay',
            render(ispay){
                return dict.PayType[ispay];
            }
          } , {
            title: '收费标准',
            dataIndex: 'price' 
          }, {
            title: '浮动',
            dataIndex: 'fudong',
            render:(text, record) => (
                <span>加收{dict.Jfbz[record.jfbz] + record.amt}</span>
            )
          }, {
            title: '实收金额',
            dataIndex: 'realprice',
            render:(text, record) => (
                <span>{record.jfbz == 'D' ? record.price+ record.amt: record.price * (1+record.amt)}</span>
            )
          } , {
            title: '状态',
            dataIndex: 'status',
            render(status){
                return dict.Status[status];
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
  
        const formItemDescList = [ 
            
            {
                type:'INPUT',
                label:'费目名称',
                field:'fmName',
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'CASCADER',
                label:'费目类型',
                field:'fmTypeArray',
                dict: dict.FmTypeArray,
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'LOCAL_DICT',
                label:'业务类型',
                field:'busType',
                dict: dict.BusType,
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'LOCAL_DICT',
                label:'核算单位',
                field:'hsUnit',
                dict: dict.HsUnit,
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'LOCAL_DICT',
                label:'箱尺寸',
                field:'cntSize',
                dict: dict.CntSize,
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'INPUT',
                label:'单价',
                field:'price',
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'LOCAL_DICT',
                label:'计费模式',
                field:'jfMode',
                dict: dict.JfMode,
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'LOCAL_DICT',
                label:'计费标准',
                field:'jfbz',
                dict: dict.Jfbz,
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'INPUT',
                label:'计费数字',
                field:'amt',
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'LOCAL_DICT',
                label:'业务属性',
                field:'tradeType',
                dict: dict.TradeType,
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'LOCAL_DICT',
                label:'设置对象',
                field:'fmObjectType',
                dict: dict.FmObjectType,
                onChange:(value, option)=>{
                    dispatch(getDictList(dict.FmObjectTypeToRemoteDictKey[value],"feeConfig_fmObjectType"));
                    _this.dataForm.props.form.setFieldsValue({"fmObjectType":null});
                },
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'STORE_DICT',
                label:'关联单位',
                field:'fmObject',
                storeKey: 'feeConfig_fmObjectType'
            },
            {
                type:'LOCAL_DICT',
                label:'付款对象',
                field:'payObjectType',
                dict: dict.PayObjectType,
                onChange:(value, option)=>{
                    //根据value获取后弹字典数据，然后根据key：feeConfig_payObjectType存入到redux
                    dispatch(getDictList(dict.FmObjectTypeToRemoteDictKey[value],"feeConfig_payObjectType"));
                    //清空【缴费单位】的选项
                    _this.dataForm.props.form.setFieldsValue({"payObject":null});
                },
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'STORE_DICT', //从redux获取值的控件
                label:'缴费单位',
                field:'payObject',
                storeKey: 'feeConfig_payObjectType' //redux中的key值
            },
            {
                type:'REMOTE_DICT',
                label:'收款单位',
                field:'skCompany',
                dictKey: dict.remoteDictKey.allMember,
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'DATEPICKER',
                label:'开始时间',
                field:'beginTime',
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'LOCAL_DICT',
                label:'结算类型',
                field:'balanceType',
                dict: dict.BalanceType,
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'LOCAL_DICT',
                label:'是否支付',
                field:'ispay',
                dict: dict.PayType,
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
            {
                type:'LOCAL_DICT',
                label:'状态',
                field:'status',
                dict: dict.Status,
                rules:[{
                    required:true,
                    message:'不能为空'
                }]
            },
        ]
     
        return (
            
            <div> 
                {/* <Collapse> */}
                    {/* <Panel header="查询" key="1" className="card-shadow"> */}
                <Card className="card-shadow">
                    <QueryForm formList={this.queryFormItemList} filterSubmit={this.handleFilter}/>                     
                    <Button 
                        type="primary"  
                        onClick={()=>this.handleOperator('create')}
                        style={{float:'right'}}
                    >新增</Button>
                </Card>
                    {/* </Panel> */}
                {/* </Collapse> */}

                <Card style={{marginTop:'20px'}} className="card-shadow">
                    <CommonTable 
                        columns={columns} 
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                    />  
                </Card>
               
                <Modal
                    title={this.state.title}
                    visible={this.state.isFormVisible}
                    onOk={this.handleSubmit}
                    width={800} 
                    onCancel={()=>{
                        this.dataForm.props.form.resetFields();
                        this.setState({
                            isFormVisible:false,
                            data:{}
                        })
                    }}
                >
                    <SimpleForm 
                        itemDesc={formItemDescList} 
                        data={this.state.data} 
                        type={this.state.type} 
                        colNum={2}
                        wrappedComponentRef={(inst) => this.dataForm = inst }
                    />
                </Modal>


                {/* <Drawer
                    title="创建新的费目"
                    width={800}
                    placement="right"
                    onClose={this.onCloseDrawer}
                    maskClosable={false}
                    visible={this.state.isFormVisible}
                    style={{
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: 53,
                    }}
                >
                     <SimpleForm 
                        itemDesc={formItemDescList} 
                        data={this.state.data} 
                        type={this.state.type} 
                        colNum={2}
                        wrappedComponentRef={(inst) => this.dataForm = inst }
                    />
                    <div
                        style={{
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e8e8e8',
                        padding: '10px 16px',
                        textAlign: 'right',
                        left: 0,
                        background: '#fff',
                        borderRadius: '0 0 4px 4px',
                        }}
                    >
                        <Button
                        style={{
                            marginRight: 8,
                        }}
                        onClick={this.onCloseDrawer}
                        >
                        Cancel
                        </Button>
                        <Button onClick={this.handleSubmit} type="primary">Submit</Button>
                    </div>
                </Drawer> */}
            </div>
        );
    }
}


export default connect()(FeeConfigure);