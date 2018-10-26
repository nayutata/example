import * as React from 'react'
import { notification, Icon } from 'antd'

export const success = (info => {
    notification.success({
        message: '成功',
        description: <pre>{info}</pre>,
        icon: <Icon type='check-circle' style={{ color: 'green' }} />
    })
})

export const warning = (info => {
    notification.warning({
        message: '警告',
        description: <pre>{info}</pre>,
        icon: <Icon type='exclamation-circle' style={{ color: 'orange' }} />
    })
})

export const error = (info => {
    notification.error({
        message: '失败',
        description: <pre>{info}</pre>,
        icon: <Icon type='close-circle' style={{ color: 'red' }} />
    })
})
