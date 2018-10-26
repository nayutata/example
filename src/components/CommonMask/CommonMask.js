import * as React from 'react'
import './CommonMask.less'

export class CommonMask extends React.Component {

    timeId

    mount

    componentWillMount() {
        this.mount = true
        this.setState({ maskShow: !!this.props.loading })
    }

    componentWillReceiveProps(newProps) {
        if (newProps.loading === false && this.state.maskShow === true) {
            if (this.timeId != null) {
                clearTimeout(this.timeId)
                this.timeId = null
            }

            this.timeId = setTimeout(() => {
                this.mount && this.setState({ maskShow: false })
            }, 500)

        }
        if (newProps.loading === true && this.props.loading === false || this.props.loading == undefined) {
            this.mount && this.setState({ maskShow: true })
        }
    }

    componentWillUnmount() {
        this.mount = false
    }

    render() {

        return this.state.maskShow ? <div className='common-mask' style={{ opacity: this.props.loading ? 1 : 0 }}>
            <div className='ant-spin ant-spin-spinning ant-table-with-pagination ant-table-spin-holder'>
                <div><span className='ant-spin-dot'><i /><i /><i /><i /></span></div>
                <div className='common-mask-text'>
                    { this.props.text }
                </div>
            </div>
        </div> : null
    }

}