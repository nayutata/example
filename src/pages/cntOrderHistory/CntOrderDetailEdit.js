import React from "react";
import {Col, Form, Radio, Row, Select} from "antd";
import {connect} from "react-redux";
import dict from "../../utils/dict";
import SingleFormItem from "../../components/SingleFormItem";
const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class CntOrderDetailEdit extends React.Component {

  componentDidMount(){
    console.info('this.props',this.props)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: 24,
        sm: 8
      },
      wrapperCol: {
        xs: 24,
        sm: 13
      }
    }

    return (
      <Form layout="horizontal">
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="提单号">
              <span>{this.props.record.billNo || ''}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="预录入ID">
              <span>{this.props.record.eirId || ''}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="箱号">
              <span>{this.props.record.cntNo || ''}</span>
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="箱型尺寸">
              <span>{this.props.record.ref2}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <SingleFormItem initialValue={this.props.record.truckComp} field="truckComp" form={this.props.form} type="REMOTE_DICT" label="托车行:" dictKey = "truckCompAll"/>
          </Col>
          <Col span={12}>
            <SingleFormItem initialValue={this.props.record.isDamage} field="isDamage" form={this.props.form} type="LOCAL_DICT" label="箱况:" dict = {dict.damage}/>
          </Col>
        </Row>

        {/*不返-isBkEmpty === 'N' && isBkFull === 'N'*/}
        <Row>
          {
            (this.props.record.isBkEmpty === 'N' && this.props.record.isBkFull === 'N' && this.props.record.txEflag) ? null :
              [
                <Col span={12} key="1">
                  <SingleFormItem field="cntFeature" form={this.props.form} type="REMOTE_DICT" label="箱特征:" dictKey = "cntFeature"/>
                </Col>,
                <Col span={12} key="2">
                  <FormItem {...formItemLayout} label="进箱流向:">
                    <span>{this.props.record.isOut === 'Y'?'出口':'堆存'}</span>
                  </FormItem>
                </Col>
              ]
          }
        </Row>
        {
          this.props.record.txEflag?null:<Row>
            <Col span={24}>
              <FormItem label="收箱标识" {...formItemLayout}>
                {
                  getFieldDecorator('sxSign', {
                    initialValue: this.props.record.sxSign
                  })(
                    <RadioGroup>
                      <Radio value="sdckx">收堆存空箱</Radio>
                      <Radio value="sckkx">收出口空箱</Radio>
                      <Radio value="sz">收重箱</Radio>
                    </RadioGroup>
                  )
                }
              </FormItem>
            </Col>
          </Row>
        }
        <Row>
          <Col span={12}>
            <SingleFormItem field="txEndTime" form={this.props.form} type="DATEPICKER" label="提箱截止时间:"/>
          </Col>
          {(true && this.props.record.txEflag) ? null :
            <Col span={12}>
              <SingleFormItem field="jxEndTime" form={this.props.form} type="DATEPICKER" label="返箱截止时间:"/>
            </Col>
          }
        </Row>

        <Row>
          <Col span={12}>
            <SingleFormItem field="cntAgent" form={this.props.form} type="REMOTE_DICT" label="控箱代理:" dictKey = "cntAgentCode"/>
          </Col>
          <Col span={12}>
            <SingleFormItem field="cntOwner" form={this.props.form} type="REMOTE_DICT" label="箱主:" dictKey = "cntOwnerCodeAndCode"/>
          </Col>
        </Row>

      {
        this.props.record.txEflag?<Row>
          <Col span={24}>
              <FormItem label="进箱标识" {...formItemLayout}>
                {
                  getFieldDecorator('bkSign', {
                    initialValue: this.props.record.bkSign
                  })(
                    (this.props.record.isBkEmpty !== 'Y' && !this.props.record.isHandle) ?
                    <RadioGroup>
                      <Radio value="bkFull">返重</Radio>
                      <Radio value="bkEmpty">返空</Radio>
                      <Radio value="dontBk">不返</Radio>
                    </RadioGroup> :
                    <RadioGroup>
                      <Radio value="bkFull">返重</Radio>
                      <Radio value="bkEmpty">返空</Radio>
                    </RadioGroup>
                  )
                }
              </FormItem>
          </Col>
        </Row>:null
      }
      {
      this.props.record.isOut === "Y"?[
        <Row key='1'>
            <Col span={12}>
              <SingleFormItem field="bl" form={this.props.form} type="INPUT" label="订舱号:"/>
            </Col>
            <Col span={12}>
              <SingleFormItem field="vesselName" form={this.props.form} type="REMOTE_DICT" label="出口船名:" dictKey = "shipRecord"/>
            </Col>
          </Row>,
        <Row key='2'>
          <Col span={12}>
            <SingleFormItem field="outVoyage" form={this.props.form} type="REMOTE_DICT" label="出口航次:" dictKey = "shipRecord"/>
          </Col>
          <Col span={12}>
            <SingleFormItem field="pod" form={this.props.form} type="REMOTE_DICT" label="卸货港:" dictKey = "portCode"/>
          </Col>
        </Row>]:null
      }
      </Form>
    );
  }
}

const mapStateToProps = state => {
  return {
    dataStore:state
  };
}

export default connect(mapStateToProps)(Form.create()(CntOrderDetailEdit));