import React from 'react'
import Utils from '../../utils/utils'
import { Table } from 'antd'
import "./index.less"
export default class ETable extends React.Component {

    state = {}

    // 选择框变更
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let rowSelection = this.props.rowSelection;
        const selectedIds = [];
        if (rowSelection == 'checkbox') {
            selectedRows.map((item) => {
                selectedIds.push(item.id);
            });
            this.setState({
                selectedRowKeys,
                selectedIds: selectedIds,
                selectedItem: selectedRows
            });
        }
        this.props.updateSelectedItem(selectedRowKeys, selectedRows, selectedIds);
    };

    onSelectAll = (selected, selectedRows, changeRows) => {
        let selectedIds = [];
        let selectKey = [];
        selectedRows.forEach((item, i) => {
            selectedIds.push(item.id);
            selectKey.push(i);
        });
        this.props.updateSelectedItem(selectKey, selectedRows[0] || {}, selectedIds);
    }

    getOptions = () => {
        let p = this.props;
        const name_list = {
        };
        if (p.columns && p.columns.length > 0) {
            p.columns.forEach((item) => {
                //开始/结束 时间
                if (!item.title) {
                    return
                }
                if (!item.width) {
                    if (item.title.indexOf("时间") > -1 && item.title.indexOf("持续时间") < 0) {
                        item.width = 132
                    } else if (item.title.indexOf("图片") > -1) {
                        item.width = 86
                    } else if (item.title.indexOf("权限") > -1 || item.title.indexOf("负责城市") > -1) {
                        item.width = '40%';
                        item.className = "text-left";
                    } else {
                        if (name_list[item.title]) {
                            item.width = name_list[item.title];
                        }
                    }
                }
                item.bordered = true;
            });
        }
        const { selectedRowKeys, selectedItem } = this.props;
        const rowSelection = {
            type: 'radio',
            selectedRowKeys,
            onChange: this.onSelectChange,
            onSelect: (record, selected, selectedRows) => {
            },
            getCheckboxProps: this.props.disabled,
            onSelectAll: this.onSelectAll
        };
        let row_selection = this.props.rowSelection;
        // 当属性未false或者null时，说明没有单选或者复选列
        if (row_selection === false || row_selection === null) {
            row_selection = false;
        } else if (row_selection == 'checkbox') {
            //设置类型未复选框
            rowSelection.type = 'checkbox';
        } else {
            //默认未单选
            row_selection = 'radio';
        }
        return <Table
            className="card-wrap page-table"
            bordered
            {...this.props}
            rowSelection={row_selection ? rowSelection : null}
        // onRow={(record, index) => ({
        //     onClick: () => {
        //         if (!row_selection) {
        //             return;
        //         }
        //         this.onRowClick(record, index)
        //     }
        // })}
        />
    };
    render = () => {
        return (
            <div>
                {this.getOptions()}
            </div>
        )
    }
}