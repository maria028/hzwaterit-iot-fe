export default {
    events: [
        {
            id: "alarmWater",
            name: "液位告警",
            expands: { level: "ordinary" },
            valueType: { type: "int", unit: "centimeter" }
        },
        {
            id: "alarmBat",
            name: "电量报警",
            expands: { level: "ordinary" },
            valueType: { type: "int", unit: "percent" }
        },
        {
            id: "alarmSensor",
            name: "传感器报警",
            expands: { level: "ordinary" },
            valueType: { type: "string", expands: {} }
        },
        {
            id: "alarmNet",
            name: "网络报警",
            expands: { level: "ordinary" },
            valueType: { type: "string", expands: {} }
        }
    ],
    properties: [
        {
            id: "no",
            name: "设备编号",
            valueType: { type: "string", expands: {} },
            expands: { readOnly: "true", source: "device" }
        },
        {
            id: "batSource",
            name: "供电来源",
            valueType: { type: "string", expands: {} },
            expands: { readOnly: "true", source: "device" },
            description: "0-电池，1-外供电"
        },
        {
            id: "batType",
            name: "供电方式",
            valueType: { type: "string", expands: {} },
            expands: { readOnly: "true", source: "device" },
            description: "00 双供电，01-单电池供电，10-单外供电，"
        },
        {
            id: "batV5per",
            name: "电量百分比",
            valueType: { type: "int", unit: "percent" },
            expands: { readOnly: "true", source: "device" }
        },
        {
            id: "signalDbm",
            name: "信号强度",
            valueType: { type: "int", unit: "" },
            expands: { readOnly: "true", source: "device" }
        },
        {
            id: "recStepSec",
            name: "数据记录间隔秒",
            valueType: { type: "string", expands: {} },
            expands: { readOnly: "true", source: "device" }
        },
        {
            id: "recCnt",
            name: "数据记录条数",
            valueType: { type: "string", expands: {} },
            expands: { readOnly: "true", source: "device" }
        },
        {
            id: "recType",
            name: "设备类型代码",
            valueType: { type: "string", expands: {} },
            expands: { readOnly: "true", source: "device" }
        },
        {
            id: "curCfg1",
            name: "报警液位下限厘米",
            valueType: { type: "int", unit: "centimeter" },
            expands: { readOnly: "false", source: "device" }
        },
        {
            id: "curCfg2",
            name: "报警液位上限厘米",
            valueType: { type: "int", unit: "centimeter" },
            expands: { readOnly: "false", source: "device" }
        },
        {
            id: "curCM",
            name: "当前液位厘米",
            valueType: { type: "int", unit: "centimeter" },
            expands: { readOnly: "true", source: "device" }
        },
        {
            id: "time",
            name: "设备时间",
            valueType: { type: "date", format: "yyyy-MM-dd HH:mm:ss" },
            expands: { readOnly: "true", source: "device" }
        },
        {
            id: "cachData",
            name: "缓存记录",
            valueType: {
                type: "object",
                properties: [
                    { id: "count", name: "数量", valueType: { type: "int" } },
                    { id: "interval", name: "间隔", valueType: { type: "int" } },
                    {
                        id: "startTime",
                        name: "开始时间",
                        valueType: { type: "date", format: "yyyy-MM-dd HH:mm:ss" }
                    },
                    { id: "records", name: "记录数组", valueType: { type: "object" } }
                ]
            },
            expands: { readOnly: "true", source: "device" }
        }
    ],
    functions: [],
    tags: []
}
