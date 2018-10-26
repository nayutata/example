import React from 'react'
import { Input, Select, Form, Button, Checkbox, Radio, DatePicker} from 'antd'
import Utils from '../../utils/utils';
import timestamp from 'time-stamp'; 
import { AutoComplete } from 'antd';
import axios from '../../axios/index'
import moment from 'moment'



const FormItem = Form.Item;
const Option = Select.Option;

const dataSource = ['12345', '23456', '34567'];

class FilterForm extends React.Component{

    state = {
        shipCompanyList:[],
        shipNameList:[]
    }

    componentDidMount(){
        const formList = this.props.formList;
        const formItemList = [];
        if(formList && formList.length>0){  
            formList.forEach((item,idx)=>{
                if(item.type == 'AcShipCompany'){
                    this.getAcShipCompany();
                }else if(item.type == 'AcShipName'){
                    this.getAcShipName();
                }
            })
        }
    }

    //获取船公司
    getAcShipCompany = ()=>{
        axios.ajax({
            url:'yybd/common/dictList', 
            data:{
                params:{
                    group:'shipCompanyCode'
                }
            }
        }).then((res)=>{
            if(res.code == '200'){  

                // console.log(this);
                this.setState({
                    shipCompanyList:res.data.list[0].data
                })
                 
            }
        })
    }

    //获取船名
    getAcShipName = ()=>{
        axios.ajax({
            url:'yybd/common/dictList', 
            data:{
                params:{
                    group:'shipRecord'
                }
            }
        }).then((res)=>{
            if(res.code == '200'){ 
                this.setState({
                    shipNameList:res.data.list[0].data
                })
                 
            }
        })
    }

    //
    handleFilterSubmit = ()=>{
        let fieldsValue = this.props.form.getFieldsValue();
        console.log('fieldsValue:'+ JSON.stringify(fieldsValue));
        this.props.filterSubmit(fieldsValue);
    }

    //
    reset = ()=>{
        this.props.form.resetFields();
    }
    //
    initFormList = ()=>{
        //
        const {getFieldDecorator} = this.props.form;
        //
        const formList = this.props.formList;
        const formItemList = [];
        if(formList && formList.length>0){
            formList.forEach((item,idx)=>{
                let label = item.label;
                let field = item.field;
                let initialValue = item.initialValue || '';
                let placeholder = item.placeholder;
                let width = item.width;
                if(item.type == '时间查询'){
                    const begin_time = <FormItem label="时间" key={field}>
                        {
                            getFieldDecorator('startTime',{
                                getValueProps: (value)=>{return value?value.valueOf():''},
                                normalize: (value)=>{return value?value.valueOf():''}
                            })(
                                // <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>
                            )
                        }
                    </FormItem>
                    formItemList.push(begin_time)
                    const end_time = <FormItem label="~" colon={false} key={field}>
                        {
                            getFieldDecorator('endTime')(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>
                            )
                        }
                    </FormItem>
                    formItemList.push(end_time)
                }else if(item.type == 'INPUT'){
                    const INPUT  = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field],{
                                initialValue:initialValue
                            })(
                                <Input type="text" placeholder={placeholder}/>
                            )
                        }
                    </FormItem>
                    formItemList.push(INPUT)
                }else if(item.type == 'SELECT'){
                    const SELECT  = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field],{
                                initialValue:initialValue
                            })(
                                <Select style={{width:width}} placeholder={placeholder}>
                                    {Utils.getOptionList(item.list)}
                                </Select>
                            )
                        }
                    </FormItem>
                    formItemList.push(SELECT)
                }else if(item.type == 'CHECKBOX'){
                    const CHECKBOX = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field],{
                                valuePropName: 'checked',
                                initialValue:initialValue
                            })(
                                <Checkbox>{label}</Checkbox>
                            )
                        }
                    </FormItem>
                    formItemList.push(CHECKBOX)
                }
                else if(item.type == 'AcShipCompany'){

                    const {shipCompanyList} = this.state;
                    const children = shipCompanyList.map((item)=>{
                        return  <Option key={item.key}>{item.val}</Option>;
                    });

                    const CHECKBOX = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field],{ 
                                initialValue:initialValue
                            })(
                                <AutoComplete   
                                filterOption={(inputValue,option)=>option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                >
                                    {children}
                                </AutoComplete>
                            )
                        }
                    </FormItem>
                    formItemList.push(CHECKBOX)
                }else if(item.type == 'AcShipName'){

                    const {shipNameList} = this.state;
                    const children = shipNameList.map((item)=>{
                        return  <Option key={item.key}>{item.val}</Option>;
                    });

                    const CHECKBOX = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field],{ 
                                initialValue:initialValue
                            })(
                                <AutoComplete   
                                filterOption={(inputValue,option)=>option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                >
                                    {children}
                                </AutoComplete>
                            )
                        }
                    </FormItem>
                    formItemList.push(CHECKBOX)
                }else if(item.type == 'DATEPICKER'){
                    const datepicker = <FormItem label={label} key={field}>
                        {
                            getFieldDecorator([field],{
                                getValueProps: (value)=>{return value?value.valueOf():''},
                                normalize: (value)=>{return value?value.valueOf():''}
                            })(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>
                            )
                        }
                    </FormItem>
                    formItemList.push(datepicker) 
                }else if(item.type == 'HIDDEN'){
                  const HIDDEN  = <span>
                    {
                      getFieldDecorator([field],{
                        initialValue:initialValue
                      })(
                        <Input type="text" hidden placeholder={placeholder}/>
                      )
                    }
                  </span>
                  formItemList.push(HIDDEN)
                }
            })
        }
        return formItemList;
    }

    render(){
        return (
            <Form layout="inline">
                {this.initFormList()}
                <FormItem>
                    <Button type="primary" style={{margin:'0 20px'}} onClick={this.handleFilterSubmit}>查询</Button>
                    <Button onClick={this.reset}>重置</Button>
                </FormItem>
            </Form>
        );
    }
}

export default Form.create({})(FilterForm);