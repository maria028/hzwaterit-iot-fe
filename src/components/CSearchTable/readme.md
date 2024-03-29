<!--
 * @Author: pzy 1012839072@qq.com
 * @Date: 2024-03-29 11:41:20
 * @LastEditors: pzy 1012839072@qq.com
 * @LastEditTime: 2024-03-29 11:46:15
 * @Description: 
-->


## 组件说明

### 全局注册

全局注册后可直接使用，无需引用

```
install(Vue: App) {
	Vue.component("CSearchTable", CSearchTable);
	Vue.component("CSearchBar", CSearchBar);
	Vue.component("CSearchBarItem", CSearchBarItem);
},
```

### 使用说明

- @search：搜索查询事件
- @clear：重置事件
- #search：搜索栏插槽
  填写内容请使用`<CSearchBarItem label="xxx">这里填写想要的输入框内容</CSearchBarItem>`
- #tableLeft：表格左上插槽，自定义内容，建议一行显示
- #tableRight：表格左上插槽，自定义内容，建议一行显示
- #columns：表格字段插槽，同 table 的使用方法

其他属性和方法赋予 CSearchTable 后可透传；

### 使用举例

```
    <CSearchTable
      :data="data"
      :pagination="pagination"
      @search="getData"
      @clear="clear"
    >
      <template #search>
        <CSearchBarItem label="xxx">
          <el-input  />
        </CSearchBarItem>
      </template>
      <template #tableLeft>

      </template>
      <template #tableRight>

      </template>
      <template #columns>

      </template>
    </CSearchTable>
```

### 未来可优化的地方

- 监听搜索框的展开和收起，赋予 Table 动态高度，使其能在一页中显示不滚动；
