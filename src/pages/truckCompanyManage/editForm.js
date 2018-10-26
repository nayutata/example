import React from "react";
import { Form, Input} from "antd";
import ValidatorUtils from '../../utils/ValidatorUtils';
const FormItem = Form.Item;

class EditForm extends React.Component {
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
        <FormItem label="常用联系人" {...formItemLayout} key="contactor">
          {
            getFieldDecorator('contactor', {
              initialValue: this.props.record.contactor,
              rules: [
                {
                  required: true,
                  message: '常用联系人不能为空'
                }
              ]
            })(
              <Input style={{ width: '100%' }} />
            )
          }
        </FormItem>

        <FormItem label="联系固话"{...formItemLayout} key="tel">
          {
            getFieldDecorator('tel', {
              initialValue: this.props.record.tel,
              rules: [
                {
                  required: true,
                  message: '联系固话不能为空'
                }
              ]
            })(
              <Input style={{ width: '100%' }} />
            )
          }
        </FormItem>
        <FormItem label="手机号" {...formItemLayout} key="mobile">
          {
            getFieldDecorator('mobile', {
              initialValue: this.props.record.mobile,
              rules: [
                {
                  required: true,
                  message: '手机号不能为空'
                },
                ValidatorUtils.mobile
              ]
            })(
              <Input style={{ width: '100%' }} />
            )
          }
        </FormItem>
        <FormItem label="QQ"  {...formItemLayout} key="qq">
          {
            getFieldDecorator('qq', {
              initialValue: this.props.record.qq,
              rules: [
                {
                  required: true,
                  message: 'QQ不能为空'
                }
              ]
            })(
              <Input style={{ width: '100%' }} />
            )
          }
        </FormItem>
      </Form>
    );
  }
}
export default (Form.create({})(EditForm));