import React from 'react'
import Utils from '../../utils/utils'
import { Table } from 'antd'
import "./index.less"
export default class CommonTable extends React.Component {

    state = {
        selectedIds: [],
        selectedItem: []
    }

    /**
     * 如果只在一页进行选择 selectedRowKeys的大小和selectedRows是一样的。
     * 如果在一页以上进行选择 selectedRowKeys的数量 > selectedRows的数量。
     *   selectedRowKeys 包含了多页的选项。  selectedRows 只包含当前页的选项
     *
     * @memberof CommonTable
     */
    onSelectChange = (selectedRowKeys, selectedRows) => {
        const { rowSelection, rowKey } = this.props;
        const _selectedIds = [];
        const _selectedItem = [];

        if (rowSelection == 'checkbox') {
            //通过rowKey进行筛选
            selectedRowKeys.map((key) => {
                let found = false;
                //先查找state找item
                this.state.selectedItem.map((item) => {
                    if (item[rowKey] === key) {
                        _selectedIds.push(item.id);
                        _selectedItem.push(item);
                        found = true;
                    }
                });

                //如果state中没有找到，再从selectedRows中查找。
                if (!found) {
                    selectedRows.map((item) => {
                        if (item[rowKey] === key) {
                            _selectedIds.push(item.id);
                            _selectedItem.push(item);
                        }
                    });
                }

            });


            this.setState({
                selectedRowKeys,
                selectedIds: _selectedIds,
                selectedItem: _selectedItem
            });
            this.props.updateSelectedItem(selectedRowKeys, _selectedItem, _selectedIds);
        }else{
            this.props.updateSelectedItem(selectedRowKeys, selectedRows, null);
        }
    };

    getOptions = () => {
        let p = this.props;


        //定义默认的 rowSelection
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: this.props.disabled
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