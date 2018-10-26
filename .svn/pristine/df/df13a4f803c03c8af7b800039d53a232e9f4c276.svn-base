import React from 'react'
import { Input, Select, Form, Button, Checkbox, DatePicker, Cascader, Row, Col } from 'antd'
import Utils from '../../utils/utils';
import { AutoComplete } from 'antd';
import { connect } from 'react-redux'
import { getDictList } from '../../redux/action'
import '../../style/common.less'

const FormItem = Form.Item;
const Option = Select.Option;


class QueryForm extends React.Component {

    state = {
    }

    componentDidMount() {
        const { dispatch, formList } = this.props;
        if (formList && formList.length > 0) {
            formList.forEach((item, idx) => {
                if (item.type == 'DICT') {
                    dispatch(getDictList(item.dictKey));
                }
            })
        }
    }

    //处理提交按钮事件
    handleFilterSubmit = () => {
        //获取表单数据
        let fieldsValue = this.props.form.getFieldsValue();
        //对表单数据中特别的数据做处理。比如：moment
        if (fieldsValue) fieldsValue = Utils.flatFormValue(fieldsValue);
        //回调父组件传人的事件
        this.props.filterSubmit(fieldsValue);
    }

    //
    reset = () => {
        this.props.form.resetFields();
    }

    //初始化表单
    initFormList = () => {
        //获取表单字段装饰器
        const { getFieldDecorator } = this.props.form;
        //
        const formList = this.props.formList;
        const formItemList = [];
        //colNum: 字段的列数
        const { colNum = 3 } = this.props;

        //计算出列的span
        const colSpan = 24 / colNum;

        //FormItem的布局
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 }
        };
        if (formList && formList.length > 0) {
            formList.forEach((item, idx) => {
                let label = item.label;
                let field = item.field;
                let initialValue = item.initialValue || '';
                let placeholder = item.placeholder;
                let width = item.width;
                if (item.type == '时间查询') {
                    const begin_time = <FormItem label="时间" key={field}>
                        {
                            getFieldDecorator('startTime', {
                                getValueProps: (value) => { return value ? value.valueOf() : '' },
                                normalize: (value) => { return value ? value.valueOf() : '' }
                            })(
                                // <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>
                    formItemList.push(begin_time)
                    const end_time = <FormItem label="~" colon={false} key={field}>
                        {
                            getFieldDecorator('endTime')(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>
                    formItemList.push(end_time)
                } else if (item.type == 'INPUT') {
                    const INPUT = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue
                            })(
                                <Input type="text" id={field} placeholder={placeholder} />
                            )
                        }
                    </FormItem>
                    formItemList.push(<Col span={colSpan} key={idx}>{INPUT}</Col>)
                } else if (item.type == 'SELECT') {
                    const SELECT = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue
                            })(
                                <Select placeholder={placeholder}>
                                    {Utils.getOptionList(item.list)}
                                </Select>
                            )
                        }
                    </FormItem>
                    formItemList.push(<Col span={colSpan} key={idx}>{SELECT}</Col>)
                } else if (item.type == 'CHECKBOX') {
                    const CHECKBOX = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator([field], {
                                valuePropName: 'checked',
                                initialValue: initialValue
                            })(
                                <Checkbox>{label}</Checkbox>
                            )
                        }
                    </FormItem>
                    formItemList.push(<Col span={colSpan} key={idx}>{CHECKBOX}</Col>)
                } else if (item.type == 'DICT') {
                    const { dataStore } = this.props;
                    const dataList = dataStore && dataStore[item.dictKey] ? dataStore[item.dictKey] : [];
                    const children = dataList.map((item) => {
                        return <Option key={item.key} value={item.key}>{item.val}</Option>;
                    });

                    const DICT = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator([field], {
                                initialValue: initialValue
                            })(
                                <AutoComplete
                                    filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                >
                                    {children}
                                </AutoComplete>
                            )
                        }
                    </FormItem>
                    formItemList.push(<Col span={colSpan} key={idx}>{DICT}</Col>)
                }
                //时间控件
                else if (item.type == 'DATEPICKER') {
                    const datepicker = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator([field], {

                            })(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                            )
                        }
                    </FormItem>
                    formItemList.push(<Col span={colSpan} key={idx}>{datepicker}</Col>)
                }
                //级联查询 https://ant.design/components/cascader-cn/
                else if (item.type == 'CASCADER') {
                    const CASCADER = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator([field], {

                            })(
                                <Cascader options={item.dict} />
                            )
                        }
                    </FormItem>
                    formItemList.push(<Col span={colSpan} key={idx}>{CASCADER}</Col>)
                }
                //本地数据字典
                else if (item.type === 'LOCAL_DICT') {
                    const dict = item.dict;
                    const DICT = <FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator([field], {
                            })(
                                <Select allowClear={true} >
                                    {Utils.getDictOptionsUI(dict)}
                                </Select>
                            )
                        }
                    </FormItem>
                    formItemList.push(<Col span={colSpan} key={idx}>{DICT}</Col>)
                }
            })
        }
        return formItemList;
    }

    render() {
        return (
            <Form className="simple-form">
                <Row gutter={24}>
                    <Col span={18}>
                        {this.initFormList()}
                    </Col>
                    <Button type="primary" style={{ margin: '0 20px' }} onClick={this.handleFilterSubmit}>查询</Button>
                    <Button onClick={this.reset}>重置</Button>
                </Row>



            </Form>
        );
    }
}

// export default Form.create({})(QueryForm);


const mapStateToProps = state => {

    return {
        dataStore: state
    };
}

export default connect(mapStateToProps)(Form.create({})(QueryForm));