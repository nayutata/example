const SimpleRule = {
  price: {
    pattern: /(([1-9][0-9]*)\\.([0-9]{2}))|[0]\\.([0-9]{2})/, message: '金额，以不为0开始的数字，小数点后两位'
  },
  string1_30: { pattern: /^[\s\S]{1,30}$/, message: '长度必须为1至30个字符！' },
  stringfzw1_30: {
    pattern: /^[\sa-zA-Z0-9_-]{1,30}$/, message: '长度必须为1至30个字符！'
  },
  //非中文
  string1_10: { pattern: /^[\s\S]{1,10}$/, message: '长度必须为1至10个字符！' },
  string10_200: {
    pattern: /^[\s\S]{10,200}$/, message: '长度必须为10至200个字符！'
  },
  string1_200: { pattern: /^[\s\S]{1,200}$/, message: '长度必须为1至200个字符！' },
  string1_150: { pattern: /^[\s\S]{1,150}$/, message: '长度必须为1至150个字符！' },
  string1_80: { pattern: /^[\s\S]{1,80}$/, message: '长度必须为1至80个字符！' },
  string15_20: { pattern: /^[\s\S]{15,20}$/, message: '长度必须为15至20个字符！' },
  //手机号验证
  mobile: {
    pattern: /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/, message: '格式错误'
  },
  //身份证号
  idCard: {
    pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    message: '必须为正确的十八位身份证号'
  },
  //邮箱验证
  email: {
    pattern: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/, message: '必须为正确的邮箱号码'
  },
  //中文人名
  chineseName: { pattern: /^[\u4e00-\u9fa5]{2,4}$/, message: '必须为2-4位中文' },

  //密码验证
  password: { pattern: /^\w{6,}$/, message: '长度不小于6位' },

  //中文公司名
  chineseCompanyName: { pattern: /^[\u4e00-\u9fa5]{2,}$/, message: '应为中文' },
  /** 电话号码 */
  telCheck: {
    pattern: /^0\d{2,3}-?[1-9]\d{6,7}$|^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/,
    message: '必须为正确的固定电话号码或手机号码'
  },
  /** 开户账号 */
  khzhCheck: { pattern: /^\S{6,30}$/, message: '长度必须在6和30位之间' },

  /** 企业工商注册号*/
  copNoCheck: {
    pattern: /^\d{15}$|^[\w\d]{2}\d{6}[\w\d]{10}$/, message: '为15位数字;三证合一为18位数字字母的组合,前两位和后十位数字或字母，3-8位为数字'
  },
  // 箱号
  cntNoCheck: {
    pattern: /^[a-zA-Z0-9]{11}$/, message: '请输入正确的十一位箱号'
  }
}
const countRange = (min, max) => {
  return {
    pattern: new RegExp(`(?=^[1-9]\.*)^\\d{${min},${max}}$`),
    message: `必须为${Math.pow(10, min - 1)}至${Math.pow(10, max) - 1},第一位数字不能0`
  }
}
const countRangeType1 = (min, max) => {
  return {
    pattern: new RegExp(`(?=^[0-9]\.*)^\\d{${min},${max}}(\\.\\d{1,2})?$`),
    message: `必须为${Math.pow(10, min - 1)}至${Math.pow(10, max) - 1},小数点2位内`
  }
}


const priceRange = (min, max) => {
  if (min < 1) {
    return {
      pattern: new RegExp(`^(0|([1-9](\\d{${min},${max}})?))(\\.\\d{1,5})?$`),
      message: `金额必须为0至${Math.pow(10, max) - 1},小数点五位内`
    }
  } else {
    return {
      pattern: new RegExp(`^[1-9](\\d{${min},${max}})?(\\.\\d{1,5})?$`),
      message: `金额必须为${Math.pow(10, min - 1)}至${Math.pow(10, max) - 1},小数点五位内`
    }
  }
}

const priceRangetype1 = (min, max) => {
  return {
    pattern: new RegExp(`(?=^[0-9]\.*)^\\d{${min},${max}}(\\.\\d{1,2})?$`),
    message: `金额必须为${Math.pow(10, min - 1)}至${Math.pow(10, max) - 1},小数点2位内`
  }
}

const enLen = (min, max) => {
  return {
    pattern: new RegExp(`^[a-zA-Z0-9_-]{${min},${max}}$`), message: `长度必须为${min}至${max}个非中文字符！`
  }
}

const chLen = (min, max) => {
  return {
    pattern: new RegExp(`^[\\s\\S]{${min},${max}}$`),
    message: `长度必须为${min}至${max}个字符！`
  }
}
export default {
  ...SimpleRule,
  chLen, countRange, countRangeType1, priceRange, priceRangetype1, enLen
}
