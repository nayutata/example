import React, { Component } from 'react'
import axios from './../../axios/index'
import { Notification } from '../../components/design'
import { path as _get } from 'ramda'
import { Input, Button, Select, Row, Col, Form, Card, Radio, Modal } from 'antd'
import EditOwnerForm from './EditOwnerForm'
import ValidatorUtils from '../../utils/ValidatorUtils'
const FormItem = Form.Item
const Option = Select.Option
const RadioGroup = Radio.Group

class RightForm extends Component {

    state = {
        visible: true,
        truckCompList: [],
        isBkEmpty: true,

        editVisible: false,
        editOwnerFormValue: {},
        owner: '',
        eirId: ''
    }

    componentDidMount() {
        axios.ajax({
            url: 'yybd/common/dictList',
            data: {
                params: {
                    group: 'truckComp'
                }
            }
        }).then((res) => {
            if (res.code == '200') {
                this.setState({
                    truckCompList: res.data.list
                })
            }
        })
    }

    handleSubmit = () => {
        if (this.props.cntNoSelectList.length <= 0) {
            Notification.error('请至少选择一个箱!')
            return
        }
        this.props.form.validateFields((err, values) => {
            let params = {
                ...values,
                orderType: this.props.orderType,
                cntNum: this.props.cntNoSelectList.length,
                transactList: this.props.cntNoSelectList.map((cntNoSelect, i) => (
                    {
                        ...cntNoSelect,
                        cntNo: values['cntNo' + (i + 1)],
                        shipSeal: values['shipSeal' + (i + 1)],
                        customSeal: values['customSeal' + (i + 1)]
                    }
                ))
            }
            console.log('values-------------' + JSON.stringify(values, null, 4))
            console.log('params----------' + JSON.stringify(params, null, 4))
            if (err) {
                return
            }
            axios.ajax({
                url: '/yybd/truckCompany/dispatch',
                data: {
                    params: params
                }
            }).then(res => {
                this.setState({ cntNoSelectList: [] })
                Notification.success('派车成功')
                this.forceUpdate()
            })
        });
    }

    handleEditSubmit = () => {
        this.editOwnerForm.validateFields((err, values) => {
            if (err) {
                return
            }
            axios.ajax({
                url: '/yybd/cntOrder/updateOutSysCntOwner',
                data: {
                    params: values
                }
            }).then(res => {
                Notification.success('修改成功')
                this.forceUpdate()
            })
        });
    }

    changeIsBkEmpty = () => {
        if (this.state.isBkEmpty) {
            this.setState({
                isBkEmpty: false
            })
        } else {
            this.setState({
                isBkEmpty: true
            })
        }
    }
    showModal = (owner, eirId) => {
        this.setState({ editVisible: true, owner: owner, eirId: eirId })
    }

    render() {
        const { orderType, cntNoSelectList } = this.props
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
        };
        return (
            <Card className='ant-affix' className='card-shadow'>
                <h2 style={{ textAlign: 'center' }}>指派车辆</h2>
                <Form>
                    <FormItem
                        {...formItemLayout}
                        label="车牌号"
                        hasFeedback
                    >
                        {getFieldDecorator('truckNo', {
                            // initialValue: cntNoSelectList[0].truckNo,
                            rules: [{ required: true, message: '请输入车牌号!' }],
                        })(
                            <Select>
                                {this.state.truckCompList.map(v => v.data.map(vv => <Option key={vv.key}>{vv.val}</Option>))}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="手机号"
                        hasFeedback
                    >
                        {getFieldDecorator('mobile', {
                            rules: [
                                { required: true, message: '请输入手机号!' },
                                ValidatorUtils.mobile
                            ],
                        })(
                            <Input placeholder="" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="闸口号"
                        hasFeedback
                    >
                        {getFieldDecorator('pointNo', {
                            rules: [
                                { required: true, message: '请输入闸口号!' },
                            ],
                        })(
                            <Select placeholder="" >
                                <Option value='6'>6</Option>
                            </Select>
                        )}
                    </FormItem>

                    {/* 箱号1 */}
                    {
                        cntNoSelectList.length > 0 ? <FormItem
                            {...formItemLayout}
                            label="箱号1"
                            hasFeedback={!['TZ', 'TZFK', 'TZFZ'].some(v => v === cntNoSelectList[0].busiType)}
                        >
                            {getFieldDecorator('cntNo1', {
                                initialValue: cntNoSelectList[0].cntNo,
                                rules: [
                                    { required: !(orderType === 'TX' && ['TKFZ'].some(v => v === cntNoSelectList[0].busiType)) && !['TK'].some(v => v === cntNoSelectList[0].busiType), message: '请输入箱号!' },
                                    ValidatorUtils.cntNoCheck
                                ],
                            })(
                                <Input placeholder="" disabled={['TZ', 'TZFK', 'TZFZ'].some(v => v === cntNoSelectList[0].busiType)} />
                            )}
                        </FormItem> : null
                    }

                    {/* 箱主1 */}
                    {
                        cntNoSelectList.length > 0 && ['TK', 'TKFZ'].some(v => v === cntNoSelectList[0].busiType) ?
                            < FormItem
                                {...formItemLayout}
                                label="箱主1"
                            >
                                <span>
                                    {cntNoSelectList[0].cntOwner} (<a onClick={() => this.showModal(cntNoSelectList[0].owner, cntNoSelectList[0].eirId)} title='修改箱主'>修改箱主</a>)
                        </span>
                            </FormItem> : null
                    }

                    {/* 船方封1 */}
                    {
                        cntNoSelectList.length > 0 && (['SZ', 'TZFZ'].some(v => v === cntNoSelectList[0].busiType) || cntNoSelectList[0].busiType === 'TKFZ' && orderType === 'SX') ? <Row >
                            <Col {...formItemLayout.labelCol} />
                            <Col {...formItemLayout.wrapperCol} >
                                <FormItem
                                    {...formItemLayout}
                                    label="船方封1"
                                    hasFeedback
                                >
                                    {getFieldDecorator('shipSeal1', {
                                        rules: [
                                            { required: true, message: '请输入船方封!' },
                                        ],
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row> : null
                    }

                    {/* 返空 返重1 */}
                    {
                        cntNoSelectList.length > 0 && orderType === 'SX' && ['TZFK'].some(v => v === cntNoSelectList[0].busiType) ?
                            <FormItem
                                wrapperCol={{
                                    xs: { span: 24 },
                                    sm: { span: 16, offset: 8 },
                                }}
                                // {...formItemLayout}
                                hasFeedback
                            >
                                <RadioGroup value='返空' onChange={e => {
                                    console.log(e.target.value)
                                    // showModal(<OnLineFormBookingEdit
                                    //     extra={p.cntNoSelectList[0]}
                                    //     // refresh={p.refresh}
                                    //     API={WebService.truckCompany_orderList}
                                    //     eirId={p.cntNoSelectList[0].eirId}
                                    // />)
                                }} options={[{ label: '返空', value: '返空' }, { label: '返重', value: '返重' }]} />
                            </FormItem> : null
                    }

                    {/* 箱号2 */}
                    {
                        cntNoSelectList.length > 1 ?
                            <FormItem
                                {...formItemLayout}
                                label="箱号2"
                                hasFeedback={!['TZ', 'TZFK', 'TZFZ'].some(v => v === cntNoSelectList[1].busiType)}
                            >
                                {getFieldDecorator('cntNo2', {
                                    initialValue: cntNoSelectList[1].cntNo,
                                    rules: [
                                        { required: !(orderType === 'TX' && ['TKFZ'].some(v => v === cntNoSelectList[1].busiType)) && !['TK'].some(v => v === cntNoSelectList[1].busiType), message: '请输入箱号!' },
                                        { validator: this.validatePointNo }
                                    ],
                                })(
                                    <Input placeholder="" disabled={['TZ', 'TZFK', 'TZFZ'].some(v => v === cntNoSelectList[1].busiType)} />
                                )}
                            </FormItem> : null
                    }

                    {/* 箱主2 */}
                    {
                        cntNoSelectList.length > 1 && ['TK', 'TKFZ'].some(v => v === cntNoSelectList[1].busiType) ?
                            <FormItem {...formItemLayout} label='箱主2'>
                                <span>
                                    {cntNoSelectList[1].cntOwner}
                                    (<a onClick={() => this.showModal(cntNoSelectList[1].owner, cntNoSelectList[1].eirId)} title='修改箱主'>修改箱主</a>)
                    </span>
                            </FormItem> : null
                    }

                    {/* 船方封2 */}
                    {
                        cntNoSelectList.length > 1 && (['SZ', 'TZFZ'].some(v => v === cntNoSelectList[1].busiType) || cntNoSelectList[1].busiType === 'TKFZ' && orderType === 'SX') ? <Row >
                            <Col {...formItemLayout.labelCol} />
                            <Col {...formItemLayout.wrapperCol} >
                                <FormItem
                                    {...formItemLayout}
                                    label="船方封2"
                                    hasFeedback
                                >
                                    {getFieldDecorator('shipSeal2', {
                                        rules: [
                                            { required: true, message: '请输入船方封!' },
                                        ],
                                    })(
                                        <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                        </Row> : null
                    }

                    {/* 返空 返重2 */}
                    {
                        cntNoSelectList.length > 1 && orderType === 'SX' && ['TZFK'].some(v => v === cntNoSelectList[1].busiType) ?
                            <FormItem
                                wrapperCol={{
                                    xs: { span: 24 },
                                    sm: { span: 16, offset: 8 },
                                }}
                                // {...formItemLayout}
                                hasFeedback
                            >
                                <RadioGroup value='返空' onChange={v => {
                                    // showModal(<OnLineFormBookingEdit
                                    //     extra={p.cntNoSelectList[0]}
                                    //     // refresh={p.refresh}
                                    //     API={WebService.truckCompany_orderList}
                                    //     eirId={p.cntNoSelectList[0].eirId}
                                    // />)
                                }} options={[{ label: '返空', value: '返空' }, { label: '返重', value: '返重' }]} />
                            </FormItem> : null
                    }

                    < FormItem
                        {...formItemLayout}
                        label='箱数量' >
                        <span>{cntNoSelectList.length}</span>
                    </FormItem>
                    <FormItem style={{ textAlign: 'center' }}>
                        <Button type='primary' onClick={this.handleSubmit}>派车</Button>
                    </FormItem>
                </Form>

                <Modal
                    title="修改箱主"
                    visible={this.state.editVisible}
                    onCancel={() => {
                        this.setState({
                            editVisible: false
                        })
                    }}

                    onOk={this.handleEditSubmit}
                >
                    <EditOwnerForm
                        ref={f => this.editOwnerForm = f}
                        value={this.state.editOwnerFormValue}
                        owner={this.state.owner}
                        eirId={this.state.eirId}
                    />
                </Modal>
            </Card >
        );
    }
}

export default Form.create({})(RightForm)