import React from 'react'
import {Card,Form,Button,Input,Checkbox,Radio,Select,Switch,DatePicker,TimePicker,Upload,Icon,message, InputNumber, Row, Col ,Table, notification, AutoComplete} from 'antd'
import axios from '../../axios/index'
import utils from '../../utils/utils'
import {connect} from 'react-redux'
import dict from '../../utils/dict'; 
import moment from 'moment'
import Utils from '../../utils/utils'
// 提空（含返重）预约指派界面
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;
class EmptyService extends React.Component{
    state = {
        list:[],
        truckCompList:[],//获取拖车行表单信息
        isoCodeList:[],//字典表
        podList:[],//字典表
        cntAgentList:[],//字典表
        cntOwnerList:[],//字典表
        vesselNameList:[],//获取出口航名
        outVoyageList:[],//获取出口航次
        currentTime:null,
    }
    //定义表单大小
     formItemLayout = {
        labelCol:{
            span:6
        },
        wrapperCol:{
            span:14
        }
    }

    dictCode = {
        vesselNameList:'shipRecord',
        cntOwnerList:'cntOwnerCodeAndCode',
        cntAgentList:"cntAgentCode",
        podList:"portCode",
        isoCodeList:"isoCode",
        truckCompList:"truckComp"
    }

    componentDidMount=()=>{
        //获取字典表
        this.requestDict("truckComp","truckCompList")
        this.requestDict("shipRecord","vesselNameList")
        this.requestDict("cntOwnerCodeAndCode","cntOwnerList")
        this.requestDict("cntAgentCode","cntAgentList")
        this.requestDict("portCode","podList")
        this.requestDict("isoCode","isoCodeList")

        
         //this.requestTruckCompList();
        //  this.requestIsoCodeList();
        //  this.requestPodList();
        //  this.requestCntAgentList();
        //  this.requestCntOwnerList();
        //  this.requestVesselNameList();
        //获取船名
        this.requestOutVoyageList("ATL01");
    }
    //获取字典表
    requestDict(dictCode,name){
        axios.ajax({
            url:'yybd/common/dictList', 
            data:{
                params:{
                    group:dictCode
                }
            }
        }).then((res)=>{
            if(res.code == '200'){ 
                let listOther = {};
                listOther[name] = res.data&&res.data.list[0]?res.data.list[0].data:[]
                this.setState({
                    ...listOther,
                }) 
            }
        })
    }
    //时间操作
    disabledEndDate = (endValue) => {
		let me = this;
		const startValue = this.state.currentTime;	
		if (!endValue || !startValue) {
		  return false;
		}
		return endValue.valueOf() <= startValue.valueOf();
    }
    //获取当前时间
	handleEndOpenChange = (open) => {
		let me = this
		if(open){
			me.currentTime = moment();
		}
		this.setState({ endOpen: open,currentTime:moment() });
	}

    //获取航名
    requestOutVoyageList(evesselName){
        //获取表单
        axios.ajax({
            url:'yybd/vessel/vesselList', 
            data:{
                params:{
                    evesselName:evesselName,
                    outInFlag:"out",
                    inBoundVoy:"",
                }
            }
        }).then((res)=>{
            if(res.code == '200'){ 
                this.props.form.setFields({"outVoyage":null});
                this.setState({
                    outVoyageList:res.data.list
                })
                 
            }
        })
    }

    //预约指派触发时间，提交表单
    handleSubmit=()=>{
        let emptyServiceFrom=this.props.form.getFieldsValue();
        emptyServiceFrom.txEndTime=utils.formateDate3(emptyServiceFrom.txEndTime);
        emptyServiceFrom.jxEndTime=utils.formateDate3(emptyServiceFrom.jxEndTime);
        console.log(emptyServiceFrom);
        this.props.form.validateFields((err,values)=>{
            if(!err){
                // 验证通过，提交表单
                axios.ajax({  
                    url:'/yybd/shipCompany/orderTruck/tk',  
                    data:{
                        params:{
                            ...emptyServiceFrom
                        },
                        ...emptyServiceFrom
                    }
                }).then((res)=>{
                    console.log(res);
                    if(res.code==200){
                        notification.open({
                            message: '通知',
                            description: "预约成功"
                          });

                          const {truckCompList} = this.state;
                          let truckCompVal =truckCompList.map((item)=>{
                              if(item.key==emptyServiceFrom.truckComp)
                              {
                                return item.val;
                              }
                            });
                          this.state.list.push({
                              "truckName":truckCompVal,
                              "amount":emptyServiceFrom.cntNum,
                              "box":emptyServiceFrom.isoCode,
                              "businessType":"提空（含返重）",
                              "BusinessAttribute":emptyServiceFrom.tradeType=="I"?"内贸":"外贸"
                          });
                          this.props.form.setFields({"bookingNo":null});
                          this.props.form.setFields({"cntNum":null});
                          //emptyServiceFrom.bookingNo="";
                          this.setState({
                            
                        })
                    }else{
                        notification.open({
                            message: '通知',
                            description: "预约失败"
                          });
                    }
                    
                    
                })

            }
        })
    }
    //获取出口航名
    vesselNameForm=(label,field,isSelect)=>{
        const {getFieldDecorator} = this.props.form;

        const resForms=[];
        const {vesselNameList} = this.state;
        let children =vesselNameList.map((item)=>{
            return  <Option key={item.key}>{item.val}</Option>;
        });
        
        const formItem = <FormItem label={label} {...this.formItemLayout}>
                {
                    getFieldDecorator([field],{ 
                        initialValue:'ATL01',
                        rules: [
                            {
                                required: true,
                                message: {label}+'不能为空'
                            }
                        ]
                    })(
                        <Select   
                            showSearch
                            optionFilterProp="children"
                            onChange={val=>this.handleChange(val)}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {children}
                        </Select>
                    )
                }
            </FormItem>

        return formItem;
    }
    //点击航名时获取航次事件
    handleChange=(val)=>{
        if(val){
            this.requestOutVoyageList(val);
        }
    }
    //根据出口航名获取航次
    outVoyageFrom=()=>{
        const {outVoyageList} = this.state;
        let children=null;
        if(outVoyageList && outVoyageList.length>0){
            children =outVoyageList.map((item)=>{
                 return  <Option key={item.outBoundVoy}>{item.outBoundVoy}</Option>;
            });
        }
        return children;
    }

    //获取拖车行表单
    truckCompForm=(label,field,isSelect)=>{
        const {getFieldDecorator} = this.props.form;
        const {userInfo} = this.props;
        
        const resForms=[];
        let children=null;
        if(field=="truckComp"){
            const {truckCompList} = this.state;
            children =truckCompList.map((item)=>{
                return  <Option key={item.key}>{item.val}</Option>;
            });
        }else if(field=="isoCode"){
            const {isoCodeList} = this.state;
            children =isoCodeList.map((item)=>{
                return  <Option key={item.key}>{item.val}</Option>;
            });
        }else if (field=="pod"){
            const {podList} = this.state;
            children =podList.map((item)=>{
                return  <Option key={item.key}>{item.val}</Option>;
            });
        }else if (field=="cntAgent"){
            const {cntAgentList} = this.state;
            children =cntAgentList.map((item)=>{
                return  <Option key={item.key}>{item.val}</Option>;
            });
        }else if (field=="cntOwner"){
            const {cntOwnerList} = this.state;
            children =cntOwnerList.map((item)=>{
                return  <Option key={item.key}>{item.val}</Option>;
            });
        }
       
        const formItem = <FormItem label={label} {...this.formItemLayout}>
        {
            getFieldDecorator([field],{ 
                initialValue:isSelect=="Y"?userInfo.description:'',
                rules: [
                    {
                        required: true,
                        message: {label}+'不能为空'
                    }
                ]
            })(
                <Select   
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                    {children}
                </Select>
            )
        }
    </FormItem>
        return formItem;
    }

    render(){

        const { getFieldDecorator } = this.props.form;

        const formItemLayout = this.formItemLayout;//定义表单大小

        const columns = [
            {
                title:'拖车行',
                dataIndex:'truckName'
            }, {
                title: '数量',
                dataIndex: 'amount'
            }, {
                title: '箱型',
                dataIndex: 'box',
            }, {
                title: '业务类型',
                dataIndex: 'businessType',
            }, {
                title: '业务属性',
                dataIndex: 'BusinessAttribute',
            }
        ]

        const {userInfo} = this.props;
        return (
            <div>
                <Card>
                <Row>
                    <Col span={14}>
                            <Form layout="horizontal" >
                                <Row>
                                    <Col span={12} >
                                        <FormItem label="业务属性" {...formItemLayout} >

                                        {
                                            getFieldDecorator("tradeType",{
                                                initialValue: 'I',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '内外贸标识不能为空'
                                                    }
                                                ]
                                            })(
                                                <Select  >
                                                    {Utils.getDictOptionsUI(dict.TradeType)}
                                                </Select>
                                            )
                                        }
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        <FormItem label="订舱号" {...formItemLayout}>
                                        {
                                            getFieldDecorator("bookingNo",{
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '订舱号不能为空'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder="请输入订舱号"/>
                                            )
                                        }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12} >
                                    {this.truckCompForm("拖车行","truckComp","N")} 
                                    </Col>
                                    <Col span={12} >
                                        <FormItem label="提空箱量" {...formItemLayout}>
                                        {
                                            getFieldDecorator("cntNum",{
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '提空箱量不能为空'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder="请输入提空箱量"/>
                                            )
                                        }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12} >
                                        <FormItem label="箱况" {...formItemLayout} >
                                        {
                                            getFieldDecorator("isDamage",{
                                                initialValue: 'N',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '箱况不能为空'
                                                    }
                                                ]
                                            })(
                                                <Select  >
                                                    {Utils.getDictOptionsUI(dict.damage)}
                                                </Select>
                                            )
                                        }
                                        </FormItem>
                                    </Col>
                                    <Col span={12} >
                                        {this.truckCompForm("箱型","isoCode","N")}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12} >
                                        <FormItem label="提箱截止时间" {...formItemLayout} >
                                        {
                                            getFieldDecorator("txEndTime",{
                                                initialValue: '',
                                                rules: [
                                                    
                                                ]
                                            })(
                                                <DatePicker 
                                                disabledDate={this.disabledEndDate}
                                                format="YYYY-MM-DD"
                                                onOpenChange={this.handleEndOpenChange}
                                                placeholder="请选择时间"/>
                                            )
                                        }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12} >
                                        <FormItem  {...formItemLayout} style={{textAlign:"center"}} >
                                        {
                                            getFieldDecorator("isBkFull",{
                                                initialValue: 'Y',
                                            })(
                                                <Checkbox checked={true} disabled> 返重</Checkbox>
                                            )
                                        }
                                        </FormItem>
                                    </Col>
                                
                                </Row>
                                <Row>
                                    <Col span={12} >
                                        {this.vesselNameForm("出口航名","vesselName","N")}
                                    </Col>
                                    <Col span={12} >
                                        <FormItem label="出口航次" {...formItemLayout}>
                                        {
                                            getFieldDecorator("outVoyage",{
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '出口航次不能为空'
                                                    }
                                                ]
                                            })(
                                                <Select  >
                                                    {this.outVoyageFrom()}
                                                </Select>
                                            )
                                        }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12} >
                                        {this.truckCompForm("卸货港","pod","N")}
                                    </Col>
                                    <Col span={12} >
                                        <FormItem label="返箱截止时间" {...formItemLayout}>
                                        {
                                            getFieldDecorator("jxEndTime",{
                                                initialValue: moment().subtract(-7, 'days'),
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '返箱截止时间不能为空'
                                                    }
                                                ]
                                            })(
                                                <DatePicker 
                                                disabledDate={this.disabledEndDate}
                                                format="YYYY-MM-DD"
                                                onOpenChange={this.handleEndOpenChange}

                                                placeholder="请选择时间"/>
                                            )
                                        }
                                        </FormItem>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={12} >
                                        {this.truckCompForm("控箱代理","cntAgent","Y")}
                                    </Col>
                                    <Col span={12} >
                                        {this.truckCompForm("箱主","cntOwner","N")}
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={12} >
                                        <FormItem label="申请单位" {...formItemLayout} >
                                        {
                                            getFieldDecorator("appunit",{
                                                initialValue: userInfo.companyName,
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: '申请单位不能为空'
                                                    }
                                                ]
                                            })(
                                                <Input placeholder="请输入申请单位"/>
                                            )
                                        }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} style={{textAlign:"center"}} >
                                    <Button type="primary" onClick={this.handleSubmit}>预约指派</Button>
                                    </Col>
                                </Row>
                            </Form>

                    </Col>
    
                    <Col span={10}>
                        <div className="content-wrap">
                            <Table
                                bordered
                                columns={columns}
                                dataSource={this.state.list}
                            />
                        </div>
                    </Col>
                </Row>
                    
            </Card>
        </div>
        );
    }
}
// export default Form.create()(EmptyService);

const mapStateToProps = state =>{
    return {
        userInfo:state.userInfo
    }
}

export default connect(mapStateToProps)(Form.create()(EmptyService));
