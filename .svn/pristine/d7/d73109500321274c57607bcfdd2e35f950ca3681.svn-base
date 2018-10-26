import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { path as _get } from 'ramda'
const FormItem = Form.Item;

class EditForm extends Component {

    render() {
        const { getFieldDecorator } = this.props.form;
        const val = this.props.value
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <Form>
                {/* {JSON.stringify(val, null, 4)} */}
                {getFieldDecorator('eirId', {
                    initialValue: val.eirId
                })(
                    <Input type='hidden' />
                )}
                {getFieldDecorator('orderNo', {
                    initialValue: val.orderNo
                })(
                    <Input type='hidden' />
                )}
                {getFieldDecorator('appNo', {
                    initialValue: val.appNo
                })(
                    <Input type='hidden' />
                )}
                {getFieldDecorator('orderType', {
                    initialValue: this.props.orderType
                })(
                    <Input type='hidden' />
                )}
                <FormItem
                    {...formItemLayout}
                    label="车牌号"
                    hasFeedback
                >
                    {getFieldDecorator('truckNo', {
                        initialValue: val.truckNo,
                        rules: [{ required: true, message: '请输入车牌号!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="手机号"
                    hasFeedback
                >
                    {getFieldDecorator('mobile', {
                        initialValue: val.mobile,
                        rules: [{ required: true, message: '请输入手机号!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="闸道号"
                    hasFeedback
                >
                    {getFieldDecorator('pointNo', {
                        initialValue: val.pointNo,
                        rules: [{ required: true, message: '请输入闸道号!' }],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="箱号"
                >
                    {getFieldDecorator('cntNo', {
                        initialValue: val.cntNo,
                        rules: [{ required: true, message: '请输入箱号!' }],
                    })(
                        <Input disabled={true} />
                    )}
                </FormItem>
            </Form>
        );
    }
}

export default Form.create({})(EditForm)