import React, { Component } from 'react';
import axios from './../../axios/index'
import { Notification } from '../../components/design'
import { path as _get } from 'ramda'
import { Input, Select, Form } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option

class EditOwnerForm extends Component {

    state = {
        visible: true,
        ownerList: []
    }

    componentWillMount() {
        this.setState({ ownerList: [] })
    }

    getOwnerList = () => {
        axios.ajax({
            url: 'yybd/cntOrder/getOutSysCntOwnerCode',
            data: {
                params: {
                    owner: this.props.owner
                }
            }
        }).then((res) => {
            if (res.code == '200') {
                this.setState({
                    ownerList: res.data.list
                })
            }
        }).catch(error => {
            Notification.error(error)
        })
    }

    componentDidMount() {
        this.getOwnerList()
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.owner !== this.props.owner) {
            this.getOwnerList()
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <Form>
                {getFieldDecorator('eirId', {
                    initialValue: this.props.eirId
                })(
                    <Input type='hidden' />
                )}
                <FormItem
                    {...formItemLayout}
                    label="箱主："
                >
                    {getFieldDecorator('owner', {
                        initialValue: this.props.owner,
                        rules: [{ required: true, message: '请选择箱主!' }],
                    })(
                        <Select>
                            {this.state.ownerList.map(v => <Option key={v.cntOwnerCode} value={v.cntOwnerCode}>{v.cntOwnerCode}</Option>)}
                        </Select>
                    )}
                </FormItem>
            </Form>
        );
    }
}

export default Form.create({})(EditOwnerForm);