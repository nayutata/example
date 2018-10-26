import * as React from 'react'
import * as ReactDOM from 'react-dom'
import axios from './../../axios/index'
import { Notification } from '../../components/design'
import Utils from '../../utils/utils'
import RightForm from './RightForm'
import QueryForm from '../../components/QueryForm'
import dict from '../../utils/dict'
import { Tabs, Row, Col, Table, Card, Checkbox, Affix } from 'antd'
const { TabPane } = Tabs

export class TruckCompany extends React.Component {

    state = { activeTabPane: 'TX' }

    render() {
        return <Tabs type="card"
            style={{ textAlign: 'left', minWidth: '1000px' }}
            onChange={v => {
                this.setState({ activeTabPane: v == '1' ? 'TX' : 'SX' })
            }} >
            <TabPane tab='提箱(含返箱)' key="1">
                <TabItem orderType='TX' activeTabPane={this.state.activeTabPane} />
            </TabPane>
            <TabPane tab='收箱' key="2">
                <TabItem orderType='SX' activeTabPane={this.state.activeTabPane} />
            </TabPane>

        </Tabs >
    }
}

class TabItem extends React.Component {

    constructor(props) {
        super(props)
    }

    state = {
        formValue: {},
        cntNoSelectList: [],
        tableDataSource: [],
        asideHeight: 0,

        selectedRowKeys: [],
        selectedRows: [],
        selectedIds: [],
        selectedItem: [],
        pagination: {}
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
            url: '/yybd/truckCompany/orderList',
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
            res.data.list && res.data.list.map(v => v.key = v.eirId)
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
        this.setAsideHeight()
    }
    componentDidUpdate() {
        this.setAsideHeight()
    }
    setAsideHeight = () => {
        if (this.asideInstance) {
            let aside = ReactDOM.findDOMNode(this.asideInstance)
            if (aside.offsetHeight !== this.state.asideHeight) {
                this.setState({ asideHeight: aside.offsetHeight })
            }
        }
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

    isDisabled = (rowData) => {
        const val = this.state.cntNoSelectList
        let temp = val.find(s => s.eirId === rowData.eirId)
        if (temp)
            return false
        return val.length > 1 || val[0] && (val[0].cntSize === '40' || val[0].cntSize === '20' && rowData.cntSize !== '20')
    }



    render() {
        const AffixTarget = document.querySelector('.APP-content')
        const { orderType, activeTabPane } = this.props;
        const tempList = this.state.cntNoSelectList

        let rightForm = <div key='rightForm' ref={asideNode =>
            this.asideInstance = asideNode}>
            <RightForm
                ref={f => this.form = f}
                value={this.state.formValue}
                orderType={orderType}
                cntNoSelectList={this.state.cntNoSelectList}
            />
        </div>

        const newColnums = [{
            title: 'title',
            key: 'title',
            render: (text, rowData, index) => {
                return <div className="db-table-content-item">
                    <div className="db-table-content-item-title">
                        <span>
                            <Checkbox
                                onChange={e => {
                                    const arr = this.state.cntNoSelectList.filter(v => v.eirId != rowData.eirId)
                                    this.setState({
                                        cntNoSelectList: e.target.checked ? [...arr, rowData] : arr
                                    })
                                }}
                                disabled={
                                    tempList.find(s => s.eirId === rowData.eirId) ? false : (tempList.length > 1 || tempList[0] && (tempList[0].cntSize === '40' || tempList[0].cntSize === '20' && rowData.cntSize !== '20'))
                                }
                                value={this.state.cntNoSelectList.some(v => v.eirId == rowData.eirId)}
                            />
                        </span>

                        <span style={{ width: '95%', textAlign: 'left' }}>
                            <span style={{ width: '20%', display: 'inline-block', padding: '0 15px', height: '36px', lineHeight: '36px' }}>{Utils.formateDate1(rowData.createTime)}</span>
                            <span style={{ width: '22%', display: 'inline-block', padding: '0 15px', height: '36px', lineHeight: '36px' }}>订舱号: <i className="weight900">{rowData.bl || '--'}</i></span>
                            <span className="weight900" style={{ width: '20%', display: 'inline-block', padding: '0 15px', height: '36px', lineHeight: '36px' }}>{Utils.getValBaseOnKey(dict.busiType, rowData.busiType)}</span>
                            <span style={{ width: '20%', display: 'inline-block', padding: '0 15px', height: '36px', lineHeight: '36px' }}>{rowData.ownerName}</span>
                        </span>
                    </div>
                    <div className="db-table-content-item-content">
                        <div style={{ width: '5.05111%', lineHeight: '48px', height: '48px' }}>{((this.params.pageNo - 1) * 20) + (index + 1)}</div>
                        <div style={{ width: '15.7727%', lineHeight: '24px', height: '48px' }}>
                            <p>船名航次:<span>{rowData.shipName}{rowData.shipName && rowData.voyage ? ' / ' : ''}{rowData.voyage}</span></p>
                            <p>提单号:<span className="of-table-billNo">{rowData.billNo || '--'}</span></p>
                        </div>
                        <div style={{ width: '17.7727%', lineHeight: '48px', height: '48px' }}>
                            <p>{rowData.cntNo || '--'}</p>
                        </div>
                        <div style={{ width: '8.61937%', lineHeight: '48px', height: '48px' }}>
                            <p>{rowData.tradeType == 'I' ? '内贸' : '外贸' || '--'}</p>
                        </div>
                        <div style={{ width: '17.7727%', lineHeight: '48px', height: '48px' }}>{(rowData.cntSize + rowData.cntType) || '--'}</div>
                        <div style={{ width: '8.61937%', lineHeight: '48px', height: '48px' }}>{(rowData.portName) || '--'}</div>
                        <div style={{ width: '8.61937%', lineHeight: '48px', height: '48px' }}>{(rowData.cntOwner) || '--'}</div>
                        <div style={{ width: '17.7727%', lineHeight: '48px', height: '48px' }}>
                            <p>截止到:<span>
                                {orderType === 'TX' ?
                                    Utils.formateDate1(rowData.txEndTime) :
                                    Utils.formateDate1(rowData.jxEndTime)}
                            </span></p>
                        </div>
                    </div>
                </div>
            }
        }];
        return <Row>
            <Col span={17}>
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
                                <li style={{ width: '5.05111%' }}>
                                    <span style={{ textAlign: 'center', display: 'inline-block', width: '100%', height: '100%' }}>序号</span>
                                </li>
                                <li style={{ width: '15.7727%' }}>
                                    <span style={{ textAlign: 'center', display: 'inline-block', width: '100%', height: '100%' }}></span>
                                </li>
                                <li style={{ width: '17.7727%' }}>
                                    <span style={{ textAlign: 'center', display: 'inline-block', width: '100%', height: '100%' }}>箱号</span>
                                </li>
                                <li style={{ width: '8.61937%' }}>
                                    <span style={{ textAlign: 'center', display: 'inline-block', width: '100%', height: '100%' }}>业务属性</span>
                                </li>
                                <li style={{ width: '17.7727%' }}>
                                    <span style={{ textAlign: 'center', display: 'inline-block', width: '100%', height: '100%' }}>箱型尺寸</span>
                                </li>
                                <li style={{ width: '8.61937%' }}>
                                    <span style={{ textAlign: 'center', display: 'inline-block', width: '100%', height: '100%' }}>卸货港</span>
                                </li>
                                <li style={{ width: '8.61937%' }}>
                                    <span style={{ textAlign: 'center', display: 'inline-block', width: '100%', height: '100%' }}>>箱主</span>
                                </li>
                                <li style={{ width: '17.7727%' }}>
                                    <span style={{ textAlign: 'center', display: 'inline-block', width: '100%', height: '100%' }}>{(orderType == 'TX' ? '提箱' : '收箱') + '截止时间'}</span>
                                </li>
                            </ul>
                        }}
                    >


                    </Table>
                </Card>
            </Col>

            <Col span={6} offset={1} className="of-aside-container" >
                {(this.state.asideHeight + 100 > window.innerHeight || activeTabPane !== orderType) ?
                    rightForm :
                    <Affix offsetTop={100} target={() => AffixTarget || window}>
                        {rightForm}
                    </Affix>
                }
            </Col>
        </Row>
    }
}
