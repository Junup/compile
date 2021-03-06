(function($) {
    $.fn.extend({
        "compile": function(options, template, valiconfig) {
            //合并配置项
            jQuery.extend(valifig,valiconfig)
            jQuery.extend(opts, options);
            jQuery.extend(temps, template);
            var data = opts.jsoncode;
            var validateData = opts.validate;
            var $this = this;
            //遍历数据

            //this.append(temps.layer);
            $this.append('<div></div>')
            $.each(opts.sort,function(index, el) {
                $this.find('div').eq(0).append($(opts.titleDom).text(opts.sort[index].name));
                $this.append('<div data-tag="'+opts.sort[index].name+'"></div>')
                var dataVal = data[opts.sort[index].name]
                var sorts = opts.sort[index]
                $.each(sorts.value,function(key, val) {
                    var sortVal = opts.sort[key],
                        dataVals = dataVal[val]
                    if (!opts[dataVals.type]) {
                        console.error('无可用方法' + dataVals.type)
                        return ;
                    }
                    opts[dataVals.type](val, dataVals, $this, sorts.name, opts.edit, temps);                
                });
            });

            this.append(opts.submit);
            opts.tabFn(this)
            opts.validateFn(validateData,opts.edit,this,valifig,opts)

          }
    });
    var opts = {
        ajax: false,
        edit: false,
        titleDom: '<button type="button" class="btn btn-default tabclick"></button> &nbsp; ',
        submit: '<div class="button-box"><button class="btn btn-primary " type="submit"><i class="fa fa-check"></i>&nbsp;提交</button>&nbsp;' +
            '<button class="btn btn-success pull-right" type="button"><i class="fa fa-reply"></i>&nbsp;&nbsp;<span class="bold">返回</span></button></div>',

        text: function(name, data, dom, group, value) {
            var htmls = $(temps.text).find('input').attr({
                name: name,
                placeholder: data.attr,
                group: '',
                value: data.default_value
            }).siblings('label').text(data.label).parent()[0].outerHTML;
            var url = window.location.href;
            if (data.other.not_edit == '1' && url.indexOf("edit") != '-1') {
                htmls = $(htmls).find('input').attr('disabled', 'disabled').parent()[0].outerHTML;
            }
            if (value == undefined) {
                dom.find('[data-tag="'+group+'"]').append(htmls);
            }else{
                dom.find('[data-tag="'+group+'"]').append(htmls).find('input:last').val(value[name]);
            }
        },
        select: function(name, data, dom, group ,value) {
            var option = '';
            $.each(data.default_value, function(index, el) {
                if (value[name] == data.default_value[index].show) { 
                    option = option + '<option selected="selected" value=' + data.default_value[index].value + '>' + data.default_value[index].show + '</option>'
                }else{
                    option = option + '<option value=' + data.default_value[index].value + '>' + data.default_value[index].show + '</option>'
                }
            });
            var htmls = $(temps.select).find('select').attr({ 'name': name })
                .append(option).siblings('label').text(data.label).parent()[0].outerHTML;
            var url = window.location.href;
            if (data.other.not_edit == '1' && url.indexOf("edit") != '-1') {
                htmls = $(htmls).find('select').attr('disabled', 'disabled').parent()[0].outerHTML;
            }
            if (value == undefined) {
                dom.find('[data-tag="'+group+'"]').append(htmls);
            }else{
                dom.find('[data-tag="'+group+'"]').append(htmls).find('select:last').val(value[name]);
            }
        },

        checkbox: function(name, data, dom, group) {
            var htmls = $(temps.checkbox).attr('data-key', group).find('input').attr({
                    name: name,
                    placeholder: data.attr
                })
                .siblings('label').text(data.label).parent()[0].outerHTML;
            if (data.other.not_edit == '1') {
                htmls = $(htmls).find('input').attr('disabled', 'disabled').parent()[0].outerHTML;
            }
            dom.find('[data-tag="'+group+'"]').append(htmls);
        },

        textarea: function(name, data, dom, group ,value) {
            var htmls = $(temps.textarea).attr('data-key', group).find('textarea').attr({
                    name: name,
                    placeholder: data.attr
                })
                .text(data.default_value).siblings('label').text(data.label).parent()[0].outerHTML;
            if (data.other.not_edit == '1') {
                htmls = $(htmls).find('textarea').attr('disabled', 'disabled').parent()[0].outerHTML;
            }
            dom.find('[data-tag="'+group+'"]').append(htmls);
            if (value[name]) {
                $('[name="'+name+'"]').val(value[name])
            }
        },
        include: function(name, data, dom, group, values) {
            $.get(data.default_value).done(function (data){
                dom.find('[data-tag="'+ group +'"]').html(data);
            });
        },
        title: function(name, data, dom, group) {
            var htmls = $(temps.title).text(data.label).attr('data-key', group);
            [0].outerHTML;
            dom.find('[data-tag="'+group+'"]').append(htmls);
        },

        start: function(name, data, dom, group, value) {
            var htmls = $(temps.start).find('input').eq(0).attr({
                    name: name,
                    placeholder: data.attr
                })
                .text(data.default_value).parent().siblings('label').text(data.label).parent()[0].outerHTML;
            if (data.other.not_edit == '1') {
                htmls = $(htmls).find('input').attr('disabled', 'disabled').parent()[0].outerHTML;
            }
            dom.find('[data-tag="'+group+'"]').append(htmls);
            if (value[name]) {
                $('[name="'+name+'"]').val(value[name])
            }
        },

        end: function(name, data, dom, group, value) {
            $('.datepicker:last input:last').attr({
                name: name,
                placeholder: data.attr,
                disabled:'disabled'
            }).text(data.default_value);
            if (value[name]) {
                $('[name="'+name+'"]').val(value[name])
            }        
        },

        layer: function(name, data, dom, group) {
            var checkboxDom = $(temps.layer).find('.checkbox-dom');
            var checkeds = false;
            (data.default_value.length != '0') ? checkeds = true: '';
            var checked = '',
                htmls = checkboxDom.find('input').attr({ 'name': name, checked: checkeds }).siblings('label').text(data.label).parent().html();
            $('.checkbox-dom').append('<div>' + htmls + '</div>').find('div').eq(0).prev().remove().prev().remove();
            $('[name="' + opts.layerName + '"]').focus(function(event) {
                $('.immigrant').fadeIn(200)
            });
        },

        validateFn:function(validateData,editType,dom,valifig, opts){
            editType = editType ? 1 : 0;
            var validate = {};
            for (var val in validateData) {
                for (var k in validateData[val][editType]) {
                    var obj = {};
                    for (var n in validateData[val][editType][k]) {
                        var str = validateData[val][editType][k][n];
                        if (str == 'required') {
                            $('[name="'+k+'"]').prev('label').append('<i>*</i>');
                        }
                        str = str.split(":",3);
                        (str[1] == undefined) ? str[1] = true : '' ;
                        $.each(valifig,function(index, el) {
                            (str[0] == index) ? str[0] = el : '' ;
                        });
                        obj[str[0]] = str[1];
                    }
                    validate[k] = obj
                }
            }
            // FIXME TODO
            dom.validate({
              rules: validate,
              submitHandler: function (form) {
                  if (opts.ajax) {
                    console.log(opts.ajaxConfig)
                      $(form).ajaxSubmit(opts.ajaxConfig);
                      return false;
                  }
              }
            });
        },
      
        tabFn: function(dom){
            $('.tabclick').click(function(event) {
                $(this).css({'box-shadow': '0 2px 5px rgba(0, 0, 0, 0.15) inset',backgroundColor:'#d4d4d4'}).siblings('.tabclick').removeAttr('style');
                dom.find('[data-tag]').fadeOut();
                $('[data-tag="'+$(this).text()+'"]').fadeIn();
            });
            $('.tabclick').eq(0).click();
        }
    }
    var temps = {
        text: '<div class="form-group"><label></label><input type="text" class="form-control"></div>',
        checkbox: '<div class="form-group"><label></label><input type="checkbox"></div>',
        textarea: '<div class="form-group"><label></label><textarea class="form-control" rows="3"></textarea></div>',
        title: '<h3 class="form-group"></h3>',
        layer: '<div class="immigrant"><h5>移民项目（可多选）<span>X</span><h5><button type="button">确定</button><button type="button">清空</button><button type="button">全选/反选</button>' +
            '<button type="button">反选</button><div class="checkbox-dom"><input type="checkbox"><label>测试看看label</label></div></div>',
        select: '<div class="form-group"><label></label><select class="form-control"></select></div>',
        start: '<div class="form-group">' +
            '<label class="font-noraml">Range select</label>' +
            '<div class="input-daterange datepicker input-group" style="width: 100%;padding:0">' +
            '<input type="text" class="input-sm form-control" name="start"/>' +
            '<span class="input-group-addon">至</span>' +
            '<input type="text" class="input-sm form-control" name="end" />' +
            '</div>' +
            '</div>',
    }
    var valifig = {
            max:"maxlength",
            min:"minlength"    
        };


})(window.jQuery);
