/*
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-04-24 11:10:57
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-05-06 12:01:26
 * @Description:
 */
export default {
    properties: [
        {
            valueType: {
                type: "object",
                expands: {},
                properties: [
                    { valueType: { expands: {}, type: "int" }, id: "q", name: "QQQQ" },
                    { valueType: { expands: { maxLength: 9 }, type: "string" }, id: "w", name: "WWWW" }
                ]
            },
            expands: { source: "device", type: ["report"], metrics: [] },
            name: "object",
            id: "object",
            sortsIndex: 9
        },
        {
            valueType: {
                type: "array",
                expands: {},
                elementType: "int"
            },
            expands: { source: "device", type: ["report"], metrics: [] },
            id: "array",
            name: "array",
            sortsIndex: 8
        },
        {
            valueType: {
                type: "enum",
                expands: {},
                elements: [
                    { value: "a", text: "AAAA" },
                    { value: "b", text: "BBB" }
                ]
            },
            expands: { source: "device", type: ["report"], metrics: [] },
            name: "enum",
            id: "enum",
            sortsIndex: 7
        },
        {
            valueType: { type: "timestamp", expands: {} },
            expands: { source: "device", type: ["report"], metrics: [] },
            id: "date",
            name: "date",
            sortsIndex: 6
        },
        {
            valueType: {
                type: "bool",
                expands: {},
                elements: [
                    { value: "true", text: "是" },
                    { value: "false", text: "否" }
                ]
            },
            expands: { source: "device", type: ["report"], metrics: [] },
            name: "bool",
            id: "bool",
            sortsIndex: 5
        },
        {
            valueType: { type: "string", expands: { maxLength: 12 } },
            expands: { source: "device", type: ["report"], metrics: [] },
            id: "text",
            name: "text",
            sortsIndex: 4
        },
        {
            valueType: { type: "double", expands: {}, scale: 2, unit: "micron" },
            expands: { source: "device", type: ["report"], metrics: [] },
            id: "double",
            name: "double",
            sortsIndex: 3
        },
        {
            valueType: { type: "float", expands: {}, scale: 2, unit: "nanometer" },
            expands: { source: "device", type: ["report"], metrics: [] },
            id: "float",
            name: "float",
            sortsIndex: 2
        },
        {
            valueType: { type: "long", expands: {}, unit: "nanometer" },
            expands: { source: "device", type: ["report"], metrics: [] },
            name: "long",
            id: "long",
            sortsIndex: 1
        },
        {
            valueType: { type: "int", expands: {}, unit: "count" },
            expands: { source: "device", type: ["report"], metrics: [] },
            id: "int",
            name: "int",
            sortsIndex: 0
        }
    ],
    functions: [
        {
            inputs: [{ valueType: { expands: {}, type: "string" }, id: "id2", name: "ID2" }],
            output: {
                type: "object",
                expands: {},
                properties: [{ valueType: { expands: {}, type: "int" }, id: "id1", name: "ID1" }]
            },
            id: "read",
            name: "读取",
            async: true,
            description: "说明说明说明说明",
            sortsIndex: 0
        },
        {
            inputs: [],
            output: { type: null, expands: {} },
            id: "write",
            name: "写",
            async: false,
            sortsIndex: 1
        }
    ],
    tags: [
        {
            id: "longitude",
            name: "经度",
            valueType: {
                type: "string",
                expands: {}
            },
            expands: {
                readOnly: "false"
            }
        },
        {
            id: "latitude",
            name: "纬度",
            valueType: {
                type: "string",
                expands: {}
            },
            expands: {
                readOnly: "false"
            }
        }
    ]
}
