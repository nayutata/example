import React from 'react'
import { Input, Select, Form, DatePicker} from 'antd'
import Utils from '../../utils/utils';
import { AutoComplete } from 'antd';
import { connect } from 'react-redux'
import { getDictList } from '../../redux/action'
import Moment from 'moment'
import '../../style/common.less'
const FormItem = Form.Item;
const Option = Select.Option;

class SingleFormItem extends React.Component {

  state = {}

  componentDidMount(){
    if(this.props.dictKey){
        this.getRemoteDict();
    }
  }

  //获取远程数据字典
  getRemoteDict = ()=>{
    const {dispatch} = this.props;
    dispatch(getDictList(this.props.dictKey));
  }

  initForm = () => {
    //获取表单字段装饰器
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    };
    const {getFieldDecorator} = this.props.form;

    const{label,field,placeholder,rules,type,initialValue,dict,dictKey} = this.props;

    if(type === 'INPUT'){
      return <FormItem label={label} key={field} {...formItemLayout}>
        {
            getFieldDecorator([field],{
              initialValue:initialValue,
              rules:rules
            })(
              <Input type="text" id={field} placeholder={placeholder}/>
            )
        }
      </FormItem>
    }
    //本地数据字典
    else if(type === 'LOCAL_DICT'){
      return <FormItem label={label}  key={field} {...formItemLayout}>
        {
            getFieldDecorator([field],{
              initialValue: initialValue,
              rules:rules
            })(
              <Select>
                {Utils.getDictOptionsUI(dict)}
              </Select>
            )
        }
      </FormItem>
    }
    //远程数据字典
    else if(type === 'REMOTE_DICT'){
      const {dataStore} = this.props;
      const dataList = dataStore && dataStore[dictKey] ? dataStore[dictKey] : [];
      const children = dataList.map((item) => {
        return <Option key={item.key} id={item.key}>{item.val}</Option>;
      });
      return <FormItem label={label}  key={field} {...formItemLayout}>
        {
            getFieldDecorator([field],{
              initialValue:initialValue,
              rules:rules
            })(
              <AutoComplete
                filterOption={(inputValue,option)=>option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
              >
                {children}
              </AutoComplete>
            )
        }
      </FormItem>
    }
    //日期控件
    else if(type === 'DATEPICKER'){
      return <FormItem label={label}  key={field} {...formItemLayout}>
        {
            getFieldDecorator([field],{
              initialValue: typeof initialValue === "undefined" ?initialValue:Moment(parseInt(initialValue)),
              rules:rules
            })(
              <DatePicker format="YYYY-MM-DD"/>
            )
        }
      </FormItem>
    }
  }

  render() {
    return (
      <div>
        {this.initForm()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    dataStore: state
  };
}

export default connect(mapStateToProps)(Form.create({})(SingleFormItem));