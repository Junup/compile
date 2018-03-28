# compile
json快速搭建表单

根据ajax，json快速生成表单，bootstrap布局，支持jQueryValidate进行表单验证，依赖jQuery，可搭配layer弹窗进行报错提示。

****
工作时造的轮子之一，一个依赖jQuery的小插件。


 参数  | 值
  ------------- | -------------
ajax | ajax请求地址
titleDom| str类型 内置的模板tab头部 
submit | str类型 内置的提交按钮模板 
text| 函数类型 分别有五个参数（name, data, dom, group ,value）用于拼接html 
checkbox | 函数类型 分别有五个参数（name, data, dom, group ,value）用于拼接html
textarea | 函数类型 分别有五个参数（name, data, dom, group ,value）用于拼接html
include | 函数类型 支持外部引用其他页面的html  分别有五个参数（name, data, dom, group ,value）用于拼接html
start | 函数类型 支持日期控件初始时间   分别有五个参数（name, data, dom, group ,value）用于拼接html 
end | 函数类型 支持日期控件结束时间   分别有五个参数（name, data, dom, group ,value）用于拼接html 
validateFn | 配合jQueryVlidate完成表单验证， 接收json类型数据
edit | 布尔值 是否开启编辑功能 false页面的表单为readonly 
sort | json数据类型 对表单进行排序


简单使用： 

````javascript
$('#form').compile({
   jsoncode: json.form,
   edit: true,
   sort: json.sort,
   validate: json.validate
)}

适用于大型表单构建，上百数量的表单构建，更轻松的构建表单


````
