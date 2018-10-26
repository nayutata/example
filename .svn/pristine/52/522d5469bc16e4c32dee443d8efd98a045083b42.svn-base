import React from 'react'
import {Card,Form,Select,Button,Input,DatePicker,Checkbox,message} from 'antd'
import axios from '../../axios/index';
import { AutoComplete } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
const FormItem = Form.Item;
const Option = Select.Option;
class RightForm extends React.Component{

  state={
    truckCompList:[],
    isBkEmpty : true,
  }

  componentDidMount(){
    axios.ajax({
      url:'yybd/common/dictList',
      data:{
        params:{
          group:'truckComp'
        }
      }
    }).then((res)=>{
      if(res.code == '200'){
        this.setState({
          truckCompList:res.data.list[0].data
        })
      }
    })
  }

  handleSubmit = ()=>{
    this.props.form.validateFields((err,values)=>{
      if(!err){
        this.props.dispatchTruckComp(this.props.form.getFieldsValue());
      }
    });
  }

  changeIsBkEmpty = ()=>{
    if(this.state.isBkEmpty){
      this.setState({
        isBkEmpty:false
      })
    }else{
      this.setState({
        isBkEmpty:true
      })
    }
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol:{
        xs:24,
        sm:8
      },
      wrapperCol:{
        xs:24,
        sm:13
      }
    }
    const offsetLayout = {
      wrapperCol:{
        xs:24,
        sm:{
          span:12,
          offset:4
        }
      }
    }
    return (
      <div>
        <Card title="委派拖车行">
          <Form layout="horizontal">
            <FormItem label="拖车行" {...formItemLayout} key="truckComp">
              {
                getFieldDecorator('truckComp',{
                  initialValue:'',rules: [
                    {
                      required: true,
                      message: '拖车行不能为空'
                    }
                  ]
                })(
                  <AutoComplete style={{ width: '100%' }}
                    filterOption={(inputValue,option)=>option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                  >
                    {
                      this.state.truckCompList.map((item)=>{
                        return  <Option key={item.key}>{item.val}</Option>;
                      })
                    }
                  </AutoComplete>
                )
              }
            </FormItem>
            <FormItem label="申请单位" {...formItemLayout} key="appunit">
              {
                getFieldDecorator('appunit', {
                  initialValue: this.props.dataStore.userInfo.companyName,
                  rules: [
                    {
                      required: true,
                      message: '申请单位不能为空'
                    }
                  ]
                })(
                  <Input style={{ width: '100%' }}/>
                )
              }
            </FormItem>
            <FormItem label="提箱截止时间" {...formItemLayout} key="txEndTime">
              {
                getFieldDecorator('txEndTime',{
                  initialValue: moment(Date.now()),
                  rules: [
                  {
                    required: true,
                    message: '提箱截止时间不能为空'
                  }
                ]
                })(
                  <DatePicker showTime format="YYYY-MM-DD"/>
                )
              }
            </FormItem>
            <FormItem {...offsetLayout}  key="isBkEmpty">
              {
                getFieldDecorator('isBkEmpty',{
                })(
                  <Checkbox checked={this.state.isBkEmpty} onClick={this.changeIsBkEmpty}>返空</Checkbox>
                )
              }
            </FormItem>
            {
              this.state.isBkEmpty ? [
                <FormItem label="返箱截止时间" {...formItemLayout} key="backEndTime">
                  {
                    getFieldDecorator('backEndTime',{
                      initialValue: moment(Date.now()),
                      rules: [
                        {
                          required: true,
                          message: '返箱截止时间不能为空'
                        }
                      ]
                    })( <DatePicker showTime format="YYYY-MM-DD"/> )
                  }
                </FormItem>
              ] : null
            }
            <FormItem {...offsetLayout}>
              <Button type="primary" onClick={this.handleSubmit}>预约指派</Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    dataStore:state
  };
}

export default connect(mapStateToProps)(Form.create({})(RightForm));