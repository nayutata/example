import * as React from 'react'
import axios from './../../axios/index'
import { Notification } from '../../components/design'
import Utils from '../../utils/utils'
import QueryForm from '../../components/QueryForm'
import '../truckCompany/DBTable.less'
import { Tabs, Row, Col, Modal, Table, Checkbox, Card } from 'antd'
import dict from '../../utils/dict'
import EditOwnerForm from '../truckCompany/EditOwnerForm'
import EditForm from './EditForm'
import { ViewTable } from './ViewTable'
const { TabPane } = Tabs

export class TruckHistory extends React.Component {

    render() {
        return <Tabs type="card" style={{ textAlign: 'left', minWidth: '1000px' }} onChange={v => { }} >
            <TabPane tab='提箱' key="1">
                <TabItem orderType='TX' />
            </TabPane>
            <TabPane tab='收箱' key="2">
                <TabItem orderType='SX' />
            </TabPane>
        </Tabs >
    }
}

class TabItem extends React.Component {

    constructor(props) {
        super(props)
    }

    state = {
        editFormValue: {},
        editOwnerFormValue: {},
        owner: '',
        eirId: '',
        viewVisible: false,
        editVisible: false,
        editOwnerVisible: false,
        cntNoSelectList: [],
        tableDataSource: [],
        pagination: {},
    }

    params = {
        pageSize: 20,
        pageNo: 1,
        totalCount: 0,
        orderType: this.props.orderType,
        billNo: '',
        owner: '',
        cntNo: '',
        vesselName: '',
        voyage: '',
    }

    request = () => {
        axios.ajax({
            url: '/yybd/truckCompany/orderHistoryList',
            data: {
                params: {
                    ...this.params
                }
            }
        }).then(res => {
            let that = this
            if (res && res.data && res.data.pageNo == 1) {
                that.params.totalCount = res.data.totalCount;
            } else {
                res.data.totalCount = that.params.totalCount
            }
            if (res.data.list) {
                res.data.list.map((item, index) => {
                    item.key = item.id
                    return item;
                })
            }

            this.setState({
                tableDataSource: res.data.list ? res.data.list : [],
                pagination: Utils.pagination(res.data, (current) => {
                    that.params.pageNo = current;
                    that.request();
                })
            })
        }).catch(error => {
            Notification.error(error)
        })
    }

    componentDidMount() {
        this.request()
    }

    componentWillReceiveProps(newProps) {
        if (this.props.orderType !== newProps.orderType)
            this.request()
    }

    queryFormItemList = [
        {
            type: 'DICT',
            label: '船公司',
            field: 'owner',
            width: 80,
            dictKey: 'shipCompanyCode'
        },
        {
            type: 'DICT',
            label: '船名',
            field: 'vesselName',
            width: 80,
            dictKey: 'shipRecord'
        },
        {
            type: 'INPUT',
            label: '航次',
            field: 'voyage',
            width: 80
        },
        {
            type: 'INPUT',
            label: '箱号',
            field: 'cntNo',
            width: 80
        },
        {
            type: 'INPUT',
            label: '订舱号/提单号',
            field: 'billNo',
            width: 80
        },
    ]

    handleFilter = (params) => {
        let temp = {
            ... this.params,
            ...params,
            pageNo: 1  //点击查询，重置为1
        }
        this.params = temp;
        this.request();
    }

    showViewForm = (eirId) => {
        this.setState({ viewVisible: true, eirId: eirId })
    }
    showEditForm = (rowData) => {
        this.setState({ editVisible: true, editFormValue: rowData })
    }

    handleEditSubmit = () => {
        this.editForm.validateFields((err, values) => {
            if (err) {
                return
            }
            axios.ajax({
                url: '/yybd/truckCompany/orderUpdate',
                data: {
                    params: values
                }
            }).then(res => {
                Notification.success('修改成功')
                this.setState({ editVisible: false })
                this.request();
            })
        });
    }


    showModal = (owner, eirId) => {
        this.setState({ editOwnerVisible: true, owner: owner, eirId: eirId })
    }
    handleEditOwnerSubmit = () => {
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
                this.setState({ editOwnerVisible: false })
                this.request()
            })
        });
    }

    render() {
        const { orderType } = this.props;
        const tempList = this.state.cntNoSelectList
        const newColnums = [{
            title: 'title',
            key: 'title',
            render: (text, rowData, index) => {
                return <div className="db-table-content-item">
                    <div className="db-table-content-item-title">
                        <span>
                            <Checkbox
                                onChange={e => {
                                    const arr = tempList.filter(v => v.eirId != rowData.eirId)
                                    this.setState({
                                        cntNoSelectList: e.target.checked ? [...arr, rowData] : arr
                                    })
                                }}
                            />
                        </span>

                        <span style={{ width: '95%', textAlign: 'left' }}>
                            <span style={{ width: '20%', display: 'inline-block', padding: '0 15px', height: '36px', lineHeight: '36px' }}>{Utils.formateDate1(rowData.createTime)}</span>
                            <span style={{ width: '20%', display: 'inline-block', padding: '0 15px', height: '36px', lineHeight: '36px' }}>订舱号: <i className="weight900">{rowData.bl || '--'}</i></span>
                            <span className="weight900" style={{ width: '20%', display: 'inline-block', padding: '0 15px', height: '36px', lineHeight: '36px' }}>{Utils.getValBaseOnKey(dict.busiType, rowData.busiType)}</span>
                            <span style={{ width: '20%', display: 'inline-block', padding: '0 15px', height: '36px', lineHeight: '36px' }}>{rowData.ownerName}</span>
                        </span>
                    </div>

                    <div className="db-table-content-item-content">
                        <div style={{ width: '3.82249%', lineHeight: '48px', height: '48px' }}>{((this.params.pageNo - 1) * 20) + (index + 1)}</div>
                        <div style={{ width: '13.0976%', lineHeight: '24px', height: '48px' }}>
                            <p>船名航次:<span>{rowData.shipName}{rowData.shipName && rowData.voyage ? ' / ' : ''}{rowData.voyage}</span>
                            </p>提单号:{rowData.billNo || '--'}</div>
                        <div style={{ width: '6.35207%', lineHeight: '48px', height: '48px' }}>
                            <p>{((rowData.busiType === 'TZFK' && orderType === 'SX') || rowData.busiType === 'TZFZ') ?
                                <a onClick={e => {
                                    // showModal(<OnLineFormBookingEdit
                                    //     extra={v}
                                    //     // refresh={refresh}
                                    //     API={WebService.truckCompany_orderHistoryList}
                                    //     eirId={v.eirId}
                                    // />)
                                }
                                }>{Utils.getValBaseOnKey(dict.tradeId, rowData.tradeId)}</a> : Utils.getValBaseOnKey(dict.tradeId, rowData.tradeId)}</p>
                        </div>
                        <div style={{ width: '6.35207%', lineHeight: '48px', height: '48px' }}>
                            <p>{rowData.cntNo || '--'}/{rowData.shipSeal || '--'}</p>
                        </div>
                        <div style={{ width: '10%', lineHeight: '48px', height: '48px' }}>{(rowData.cntSize + rowData.cntType) || '--'}</div>
                        <div style={{ width: '6.35207%', lineHeight: '48px', height: '48px' }}>
                            <a onClick={() => this.showModal(rowData.owner, rowData.eirId)} title='修改箱主'>{rowData.cntOwner}</a>
                        </div>
                        <div style={{ width: '13.0976%', lineHeight: '48px', height: '48px' }}>
                            <p>截止到:<span>{orderType === 'TX' ?
                                Utils.formateDate1(rowData.txEndTime) :
                                Utils.formateDate1(rowData.jxEndTime)}</span></p>
                        </div>
                        <div style={{ width: '8.2071%', lineHeight: '48px', height: '48px' }}>{rowData.truckLIP || '--'}</div>
                        <div style={{ width: '8.2071%', lineHeight: '48px', height: '48px' }}>{rowData.mobile || '--'}</div>
                        <div style={{ width: '8.2071%', lineHeight: '48px', height: '48px' }}>{rowData.portName || '--'}</div>
                        <div style={{ width: '8.2071%', lineHeight: '48px', height: '48px' }}>{Utils.getValBaseOnKey(dict.orderStatus, rowData.status) || '--'}</div>
                        <div style={{ width: '8.0976%', lineHeight: '48px', height: '48px' }}>
                            <div className="IconButtonGroup__A">
                                <a onClick={() => this.showViewForm(rowData.eirId)} style={{ marginRight: 6 }}>查看</a>
                                <a onClick={() => this.showEditForm(rowData)} style={{ marginRight: 6 }}>修改</a>
                                <a onClick={() => 0}>打印</a>
                            </div>
                        </div>
                    </div>

                </div>
            }
        }];
        return <Row>
            <Col span={24}>
                <Card style={{ marginBottom: 10 }} className='card-shadow'>
                    <QueryForm formList={this.queryFormItemList} filterSubmit={this.handleFilter} />
                </Card>
                <Card className='card-shadow'>
                    <Table className="db-table"
                        columns={newColnums}
                        dataSource={this.state.tableDataSource}
                        showHeader={false}
                        pagination={this.state.pagination}
                        title={() => {
                            return <ul className="db-table-header clearfix">
                                <li style={{ width: '3.82249%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}>序号</span></li>
                                <li style={{ width: '13.0976%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}></span></li>
                                <li style={{ width: '6.35207%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}>业务属性</span></li>
                                <li style={{ width: '6.35207%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}>箱号/铅封号</span></li>
                                <li style={{ width: '10%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}>箱型尺寸</span></li>
                                <li style={{ width: '6.35207%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}>箱主</span></li>
                                <li style={{ width: '13.0976%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}>{(orderType == 'TX' ? '提箱' : '收箱') + "截止时间"}</span></li>
                                <li style={{ width: '8.2071%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}>指派车牌号</span></li>
                                <li style={{ width: '8.2071%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}>手机号</span></li>
                                <li style={{ width: '8.2071%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}>卸货港</span></li>
                                <li style={{ width: '8.2071%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}>办单状态</span></li>
                                <li style={{ width: '5%' }}><span style={{ textAlign: 'center', display: 'inline-block', width: '100%' }}>操作</span></li></ul>
                        }}
                    > </Table>
                </Card>
            </Col>
            <Modal
                title="查看"
                width={1200}
                visible={this.state.viewVisible}
                footer={null}
                onCancel={() => this.setState({ viewVisible: false })}
            >
                <ViewTable
                    eirId={this.state.eirId}
                />
            </Modal>
            <Modal
                title="编辑"
                visible={this.state.editVisible}
                onCancel={() => {
                    // this.editForm.props.form.resetFields();
                    this.setState({
                        editVisible: false
                    })
                }}

                onOk={this.handleEditSubmit}
            >
                <EditForm
                    ref={f => this.editForm = f}
                    orderType={orderType}
                    value={this.state.editFormValue}
                />
            </Modal>
            <Modal
                title="修改箱主"
                visible={this.state.editOwnerVisible}
                onCancel={() => {
                    this.setState({
                        editOwnerVisible: false
                    })
                }}
                onOk={this.handleEditOwnerSubmit}
            >
                <EditOwnerForm
                    ref={f => this.editOwnerForm = f}
                    value={this.state.editOwnerFormValue}
                    owner={this.state.owner}
                    eirId={this.state.eirId}
                />
            </Modal>
        </Row>
    }
}
