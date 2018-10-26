import React from 'react'
import { Input, Select, Form, DatePicker, Row, Col, Cascader} from 'antd'
import Utils from '../../utils/utils'; 
import { AutoComplete } from 'antd'; 
import { connect } from 'react-redux'
import { getDictList } from '../../redux/action'
import Moment from 'moment'
import '../../style/common.less'

const FormItem = Form.Item;
const Option = Select.Option;
 
class SimpleForm extends React.Component{

    componentDidMount(){
 
       this.getRemoteDict();
    }

    //获取远程数据字典
    getRemoteDict = ()=>{
        const {dispatch,itemDesc} = this.props; 
        if(itemDesc && itemDesc.length>0){  
            itemDesc.forEach((item,idx)=>{ 
                if(item.type === 'REMOTE_DICT'){
                    dispatch(getDictList(item.dictKey));
                }
            })
        }
    }

    //初始化整个表单
    initFormList = ()=>{
        //rc-form的字段装饰器，用于数据和UI的双向绑定
        const {getFieldDecorator,setFieldsValue} = this.props.form;
        //itemDesc: 表单字段的信息
        //data: 表单数据
        //表单类型： {'detail':'查看','edit':'编辑','create':'创建'}
        //colNum: 字段的列数
        const {itemDesc=[],data={},type,colNum = 1} = this.props;
        
        //计算出列的span
        const colSpan = 24/colNum;

        //用于保存生成的组件
        const formItemList = [];

        //FormItem的布局
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        if(itemDesc && itemDesc.length>0){
            itemDesc.forEach((item,idx)=>{
                const{label,field,placeholder,rules} = item; 
                let initialValue = data[field];   
  
                if(item.type === 'INPUT'){
                    const INPUT  = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            data && type=='detail'? data[field]:
                            getFieldDecorator([field],{
                                initialValue:initialValue,
                                rules:rules
                            })(
                                <Input type="text" id={field} placeholder={placeholder}/>
                            )
                        }
                    </FormItem>
                    formItemList.push(<Col span={colSpan} key={idx}>{INPUT}</Col>)
                } 
                //本地数据字典
                else if(item.type === 'LOCAL_DICT'){
                    initialValue = !isNaN(initialValue) ? ''+initialValue:initialValue;
                    const {dict,onChange} = item;
                    const DICT  = <FormItem label={label}  key={field} {...formItemLayout}>
                        {
                            data && type=='detail'? data[field]:
                            getFieldDecorator([field],{
                                initialValue: initialValue,
                                rules:rules
                            })(
                                <Select onChange={onChange}> 
                                    {Utils.getDictOptionsUI(dict)}
                                </Select>
                            )
                        }
                    </FormItem>
                    formItemList.push(<Col span={colSpan} key={idx}>{DICT}</Col>)
                }
                //远程数据字典
                else if(item.type === 'REMOTE_DICT'){ 
                    const {dataStore} = this.props;
                    const dataList= dataStore&& dataStore[item.dictKey]? dataStore[item.dictKey]:[];
                    const children = dataList.map((item)=>{
                        return  <Option key={item.key} id={item.key}>{item.val}</Option>;
                    });
                    const DICT  = <FormItem label={label}  key={field} {...formItemLayout}>
                        {
                            data && type=='detail'? data[field]:
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
                    formItemList.push(<Col span={colSpan} key={idx}>{DICT}</Col>)
                }
                //只从store中取数据
                else if(item.type === 'STORE_DICT'){  
                    const {storeKey} = item;
                    const {dataStore} = this.props;
                    const dataList= dataStore&& dataStore[storeKey]? dataStore[storeKey]:[];
                    const children = dataList.map((item)=>{
                        return  <Option key={item.key} id={item.key}>{item.val}</Option>;
                    });
                    const DICT  = <FormItem label={label}  key={field} {...formItemLayout}>
                        {
                            data && type=='detail'? data[field]:
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
                    formItemList.push(<Col span={colSpan} key={idx}>{DICT}</Col>) 
                }
                //日期控件
                else if(item.type === 'DATEPICKER'){ 
                    const datepicker = <FormItem label={label}  key={field} {...formItemLayout}>
                        {
                             data && type=='detail'? data[field]:
                            getFieldDecorator([field],{ 
                                initialValue: typeof initialValue === "undefined" ?initialValue:Moment(parseInt(initialValue)),
                                rules:rules
                            })(
                                <DatePicker format="YYYY-MM-DD"/>
                            )
                        }
                    </FormItem>
                    formItemList.push(<Col span={colSpan} key={idx}>{datepicker}</Col>) 
                }
                //
                else if(item.type === 'CASCADER'){

                    const CASCADER = <FormItem label={label}  key={field} {...formItemLayout}>
                        {
                             data && type=='detail'? data[field]:
                            getFieldDecorator([field],{ 
                               initialValue:initialValue,
                               rules:rules
                            })(
                                <Cascader options={item.dict}/>
                            )
                        }
                    </FormItem>
                    formItemList.push(<Col span={colSpan} key={idx}>{CASCADER}</Col>) 
                }
            })
        }
        return formItemList;
    }

    render(){
   
        return (
            <Form layout="horizontal" className="simple-form">
                {/* 使用栅格 {https://ant.design/components/form-cn/} */}
                <Row gutter={24}>
                    {this.initFormList()}
                </Row>
            </Form>
        );
    }
}
SimpleForm = Form.create({})(SimpleForm);

const mapStateToProps = state => {
 
    return {
        dataStore:state
    };
}

export default connect(mapStateToProps)(Form.create({})(SimpleForm));