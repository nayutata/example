import React from 'react';
import {Card,Form,Button,Input,Checkbox,Radio,Select,Switch,DatePicker,TimePicker,Upload,Icon,message, InputNumber, Row, Col ,Table, notification} from 'antd';
import axios from '../../axios/index'
import utils from '../../utils/utils'
import {connect} from 'react-redux'
import dict from '../../utils/dict'; 
import Utils from '../../utils/utils'
//收箱预约指派,
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;
class ReceiVingBox extends React.Component{
    state = {
        list:[],
        value: "szx",
        isTypesDisp: "block",
        truckCompList:[],//获取拖车行表单信息
        isoCodeList:[],
        podList:[],
        cntAgentList:[],
        cntOwnerList:[],
        vesselNameList:[],//获取出口航名
        outVoyageList:[],//获取出口航次
    }
    //定义表单大小
    formItemLayout = {
        labelCol:{
            span:5
        },
        wrapperCol:{
            span:15
        }
    }
    componentDidMount=()=>{
        //获取字典表
        this.requestDict("truckComp","truckCompList")
        this.requestDict("shipRecord","vesselNameList")
        this.requestDict("cntOwnerCodeAndCode","cntOwnerList")
        this.requestDict("cntAgentCode","cntAgentList")
        this.requestDict("portCode","podList")
        this.requestDict("isoCode","isoCodeList")
        // this.requestTruckCompList();
        // this.requestIsoCodeList();
        // this.requestPodList();
        // this.requestCntAgentList();
        // this.requestCntOwnerList();
        // this.requestVesselNameList();
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
    //获取出口航名数据
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

    

    //预约指派提交表单触发事件
    handleSubmit=()=>{
        console.log("收箱预约指派");
        let receivingBoxForm=this.props.form.getFieldsValue();
        receivingBoxForm.bkPort="CNSDG";//收箱港区默认
        receivingBoxForm.jxEndTime=utils.formateDate3(receivingBoxForm.jxEndTime);
        console.log(receivingBoxForm);
        this.props.form.validateFields((err,values)=>{
            if(!err){
                // 验证通过，提交表单
                axios.ajax({  
                    url:'/yybd/shipCompany/orderTruck/sksz',  
                    data:{
                        params:{
                            ...receivingBoxForm
                        },
                        ...receivingBoxForm
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
                              if(item.key==receivingBoxForm.truckComp)
                              {
                                return item.val;
                              }
                            });
                            //szx,sckkx,sdckx
                            let cntCollectingStatus=receivingBoxForm.cntCollectingStatus;
                            let cntCollectingName="";
                            if(cntCollectingStatus=="szx"){
                                cntCollectingName="收重箱"
                            }else if(cntCollectingStatus=="sckkx"){
                                cntCollectingName="收出口空箱"
                            }else if (cntCollectingStatus=="sdckx"){
                                cntCollectingName="收堆存空箱"
                            }
                          this.state.list.push({
                              "truckName":truckCompVal,
                              "amount":receivingBoxForm.cntNum,
                              "box":receivingBoxForm.isoCode,
                              "businessType":cntCollectingName,
                              "BusinessAttribute":receivingBoxForm.tradeType=="I"?"内贸":"外贸"
                          });
                    }else{
                        notification.open({
                            message: '通知',
                            description: "预约失败"
                          });
                    }
                    
                    this.setState({
                        
                    })
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
    //出口航名触发获取出口航次
    handleChange=(val)=>{
        if(val){
            this.requestOutVoyageList(val);
        }
    }
    //获取出口航次
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

    // 收箱类型，收重箱,收出口空箱,收堆存空箱
    onRadioChange=(e)=>{
        console.log('radio checked', e.target.value);
        let isTypesDisp="block";
        if(e.target.value=="sdckx"){
            console.log('选择收推存空箱', e.target.value);
            isTypesDisp="none";
        }

        this.setState({
            value: e.target.value,
            isTypesDisp:isTypesDisp
          });

    }

  

    render(){
        const { getFieldDecorator } = this.props.form;

        const formItemLayout =this.formItemLayout;//定义表单大小

        //定义右边栏列表表头
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

        const isTypesDisplay={
            display:this.state.isTypesDisp
        }
        const {userInfo} = this.props;
    return (
        <div>
        
        <Card>
                <Row>
                    <Col span={14}>
                    <Form layout="horizontal" >

                        <Row>
                            <Col span={24} >
                                <FormItem label="" {...formItemLayout} style={{textAlign:"center"}}>
                                {
                                    getFieldDecorator("cntCollectingStatus",{
                                        initialValue: 'szx',
                                    })(
                                        <RadioGroup onChange={this.onRadioChange} value={this.state.value} >
                                            <Radio value="szx">收重箱</Radio>
                                            <Radio value="sckkx">收出口空箱</Radio>
                                            <Radio value="sdckx">收堆存空箱</Radio>
                                        </RadioGroup>
                                    )
                                }
                                </FormItem>
                            </Col>
                        </Row>

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
                                        <Select>
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
                                <FormItem label="收箱箱量" {...formItemLayout}>
                                {
                                    getFieldDecorator("cntNum",{
                                        initialValue: '',
                                        rules: [
                                            {
                                                required: true,
                                                message: '收箱箱量不能为空'
                                            }
                                        ]
                                    })(
                                        <Input placeholder="请输入收箱箱量"/>
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
                        <Row  style={isTypesDisplay}>
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
                                        <Select >
                                            {this.outVoyageFrom()}
                                        </Select>
                                    )
                                }
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={12} style={isTypesDisplay}>
                                {this.truckCompForm("卸货港","pod","N")}
                            </Col>
                            <Col span={12} >
                                <FormItem label="收箱截止时间" {...formItemLayout}>
                                {
                                    getFieldDecorator("jxEndTime",{
                                        initialValue: '',
                                        rules: [
                                       
                                        ]
                                    })(
                                        <DatePicker placeholder="请选择时间" />
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
                            <Col span={24} style={{textAlign:"center"}}>
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
// export default Form.create()(ReceiVingBox);

const mapStateToProps = state =>{
    return {
        userInfo:state.userInfo
    }
}

export default connect(mapStateToProps)(Form.create()(ReceiVingBox));