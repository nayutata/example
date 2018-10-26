//获取海关报文状态 
const TradeRsStatus = { '0': '无回执报文', '1': '获取中', '2': '待获取' };
//车辆分类
const VeSort = { '1': '运输车辆', '2': '专用车辆', '3': '公务车辆' };
//车辆类型
const VeType = { '1': '集装箱车', '2': '箱式货柜车', '3': '敞棚车', '4': '其他车辆' };
//费目字典业务类型：TZ、TK、SZ：收出口重箱、SCK：收出口空箱、FZ、FK、SDK：收堆存空箱
const BusType = { 'all': '全部', 'TZ': '提重', 'TK': '提空', 'TKFZ': '提空返重', 'FK': '返空', 'FZ': '返重', 'SZ': '收重', 'SCK': '收出口空箱', 'SDK': '收堆存空箱' };
//尺寸
const CntSize = { '20': '20', '40': '40', '45': '45' };
//设置对象类型,系统角色
const FmObjectType = { 'ROLE_SHIP_COMPANY': '船公司', 'ROLE_TRUCK_COMPANY': '拖车行', 'ROLE_YSQY_GT': '司机' };
//付款对象,系统角色类型
const PayObjectType = { 'ROLE_SHIP_COMPANY': '船公司', 'ROLE_TRUCK_COMPANY': '拖车行', 'ROLE_YSQY_GT': '司机' };
//业务属性：内贸/外贸,I=内贸，E=外贸
const TradeType = { 'I': '内贸', 'E': '外贸' };
//状态
const Status = { '0': '停用', '1': '启用' };
//是否收费
const PayType = { '0': '不支付', '1': '支付' };
//核算单位(TK:单车;TN:吨位;CT:单箱)
const HsUnit = { 'TK': '单车', 'TN': '吨位', 'CT': '单箱' };
//计费模式
const JfMode = { 'A': '加收', 'D': '扣除' };
//计费标准(D:定额,R:比率)
const Jfbz = { 'D': '定额', 'R': '比率' };
//结算类型(0:次结,1:月结)
const BalanceType = { '0': '次结', '1': '月结' };
//费目类型
const FmTypeArray = [{ value: '1', label: '闸口类', children: [{ value: '1', label: '闸口费' }, { value: '2', label: '服务费' }] }];
//
const FeeMoreType = { '1': '闸口费', '2': '服务费' };
//// 0 未支付 1支付中 2 已支付 3支付失败
const PayStatus = { 0: '未支付', 1: '支付中', 2: '已支付', 3: '支付失败', 5: '退款失败', 6: '退款中', 7: '退款成功' };
//办单状态
const EirState = { 'P': '预录入', 'R': '登记', 'K': '验箱', 'I': '入闸', 'U': '吊箱完成', 'O': '出闸', 'C': '删除' };


//提箱状态
const deirState = { 'P': '预录入', 'R': '登记', 'K': '验箱', 'I': '入闸', 'U': '吊箱完成', 'O': '出闸', 'C': '删除' }

//提箱空重
const demptyfull = { 'E': '提空', 'F': '提重' }

//提箱箱况（是否残损）
const damage = { 'N': "完好", 'Y': "破损" }

//返箱状态
const reirState = { 'P': '预录入', 'R': '登记', 'K': '验箱', 'I': '入闸', 'U': '吊箱完成', 'O': '进闸', 'C': '删除' }


//提箱空重
const remptyfull = { 'E': '空', 'F': '重' }

//业务类型
const busType = { 'TZ': '提重', 'TK': '提空', 'TKFZ': '提空返重', 'FK': '返空', 'FZ': '返重', 'SZ': '收重', 'SK': '收空', 'SCK': '收出口空箱', 'SDK': '收堆存空箱' }

const refundStatus = { 0: '失败', 1: '创建', 3: '已收妥|等待资金平台退款', 5: '退款失败', 6: '退款中', 7: '退款成功', 8: '支付中', 9: '已成功' }

const busiType = { 'TZ': '提重', 'TK': '提空', 'TZFK': '提重-返空', 'TKFZ': '提空-返重', 'TZFZ': '提重-返重', 'SZ': '收重', 'SK': '收空' }

// 办单状态
const orderStatus = { '0': '未派车', '1': '已派车', '2': '已删除', '3': '支付失败', '支付成功，办单失败': '4', '5': '待结算' }

//业务属性
const tradeId = { "I": "内贸", "E": "外贸" }

const remoteDictKey = {
    shipRecord: 'shipRecord',//获取船名
    shipCompanyCode: 'shipCompanyCode', //船公司
    truckCompAll: 'truckCompAll', //拖车行
    getTruckListAllGroupComp: 'getTruckListAllGroupComp', //所有的车牌
    allMember: 'allMember'//获取所有会员

}

const FmObjectTypeToRemoteDictKey = {
    ROLE_SHIP_COMPANY: 'shipCompanyCode',
    ROLE_TRUCK_COMPANY: 'truckCompAll',
    ROLE_YSQY_GT: 'getTruckListAllGroupComp'
}

export default {
    TradeRsStatus, VeSort, VeType, BusType,
    CntSize, FmObjectType,
    PayObjectType, TradeType,
    Status, PayType, HsUnit,
    BalanceType, Jfbz, FmTypeArray,
    FeeMoreType, PayStatus, EirState,
    JfMode,tradeId,
    deirState, demptyfull, damage, reirState, remptyfull, orderStatus,
    busType, refundStatus, busiType, remoteDictKey, FmObjectTypeToRemoteDictKey
}