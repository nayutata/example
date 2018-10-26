import React from "react";
import {Button, Card} from "antd";
import Utils from "../../utils/utils";
import axios from "../../axios/index";
import ETable from "../../components/ETable/index";
import QueryForm from '../../components/QueryForm';

export default class BookingTable extends React.Component {

  state = {
    list: [],
  }

  formItemList = [
    {
      type: 'DICT',
      label: '船名：',
      field: 'evesselName',
      width: 80,
      dictKey: 'shipRecord'
    },
    {
      type: 'INPUT',
      label: '进口航次：',
      field: 'inBoundVoy',
      width: 80,
      initialValue: ''
    },
    {
      type:'LOCAL_DICT',
      label:'指派状态',
      field:'dispatch',
      width: 80,
      dict: {'notDispatch': '未指派', 'allDispatch': '指派完成' , 'partDispatch': '部分指派'}
    }
  ];

  params = {
    pageNo: 1,
    pageSize: 10,
    outInFlag: 'in'
  }

  handleFilterSubmit = (params) => {
    this.params = {
      ... params,
      pageNo:1,
      pageSize:this.params.pageSize
    }
    this.requestList();
  }

  componentDidMount() {
    this.requestList();
  }

  requestList = () => {
    axios.ajax(
      {
        url: "/yybd/vessel/vesselList",
        data: {
          params: {
            ...this.params,
            outInFlag: 'in'
          }
        }
      }
    ).then((res) => {
         let _this = this;
         if (res.data.list) {
             res.data = {
               ...this.params,
               totalCount: res.data.list.length,
               list: res.data.list.slice(this.params.pageSize * (this.params.pageNo - 1), this.params.pageSize * this.params.pageNo)
             }
             res.data.list.map((item, index) => {
               item.key = index;
               item.index = index + 1;
               return item;
             })
         }

         this.setState({
            list:(res.data.list)?res.data.list:[],
            pagination:Utils.pagination(res.data,(current)=>{
              _this.params.pageNo = current;
              _this.requestList();
            })
         })

    })
  }

  showDetailForm(record) {
    this.props.showDetailForm(record);
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'index'
      }, {
        title: '船名(中文)',
        dataIndex: 'cvesselName',
        render: (text, record) => (
          <a title="提取仓单信息" onClick={() => this.showDetailForm(record)}>{text}</a>
        )
      }, {
        title: '进口航次',
        dataIndex: 'inBoundVoy',
        render: v => v || '--'
      }, {
        title: '出口航次',
        dataIndex: 'outBoundVoy',
        render: v => v || '--'
      }, {
        title: '船公司代码',
        dataIndex: 'owner'
      }, {
        title: '抵港时间',
        dataIndex: 'etaTime',
        width: 200,
        render: Utils.formateDate1
      },{
        title: '指派状态',
        dataIndex: 'billStatus',
        render: (text, record) =>{
          if (text === 'partDispatch'){
            return <span>
                        部分指派(剩余箱量:{record.leftNum})
                    </span>
          }else if(text === 'allDispatch'){
            return "全部指派";
          }else{
            return "未指派";
          }
        }
      },{
        title: '操作',
        dataIndex: 'action',
        width:180,
        render: (text, record) => (
          <span className="table-operation">
                  <Button type="primary" size="small" icon="setting"
                          onClick={() => this.showDetailForm(record)}>提取仓单信息</Button>
          </span>
        )
      }
    ]
    return (
      <div>
        <Card>
          <QueryForm formList={this.formItemList} filterSubmit={this.handleFilterSubmit}></QueryForm>
        </Card>
        <div className="content-wrap">
          <ETable
            rowSelection={false}
            columns={columns}
            updateSelectedItem={Utils.updateSelectedItem.bind(this)}
            selectedRowKeys={this.state.selectedRowKeys}
            dataSource={this.state.list}
            pagination={this.state.pagination}
          />
        </div>
      </div>
    );
  }
}
