// ======================================================================
// 主程序
$(function() {
  // ----------------------------------------------------------------
  // 设置表单
  setForm();
  // 计算神经网络模型
  var ann_input = getDataFromForm();  //从表单读取数据，并设置URL
  var rs = eval_ann(ann_input);

  // 设置输出结果
  setOutput(rs)

  // ----------------------------------------------------------------
  //当表单变更时计算
  $('#form_agrs').change(function() {
    // 计算神经网络模型
    var ann_input = getDataFromForm();  //从表单读取数据，并设置URL
    var rs = eval_ann(ann_input);
    // 输出结果
    setOutput(rs)
  });
});

// ======================================================================
// 定义函数
function getDataFromForm(){
  // 从表单读取输入数据 ann_input
  form_agrs = $('#form_agrs').serializeArray();

  var ann_input_dict = {};
  for (k in form_agrs){
    // 收集神经网络输入数据
    ann_input_dict[form_agrs[k].name] = [parseFloat(form_agrs[k].value)];
    // 更新URL
    console.log([form_agrs[k].name, form_agrs[k].value]);
    replaceParamVal(form_agrs[k].name, form_agrs[k].value)
  }
  var ann_input = [];
  ann_input.push(ann_input_dict["tn2"]);
  ann_input.push(ann_input_dict["ts5"]);
  ann_input.push(ann_input_dict["pvtt"]);
  ann_input.push(ann_input_dict["wbc"]);
  ann_input.push(ann_input_dict["nlr"]);
  ann_input.push(ann_input_dict["cr"]);
  ann_input.push(ann_input_dict["alb"]);
  ann_input.push(ann_input_dict["ggt"]);
  ann_input.push(ann_input_dict["alp"]);
  ann_input.push(ann_input_dict["afp"]);
  ann_input.push(ann_input_dict["cd4tcc"]);
  return ann_input;
}

// ----------------------------------------------------------------
// 设置输出
function setOutput(rs) {
  //根据语言设置输出结果的变量
  if($('#toggle-lang_cn').hasClass('btn-primary')){
    var rs_text_positive = '进展或死亡';
    var rs_text_negative = '生存';
  }else {
    var rs_text_positive = 'Progression or Death';
    var rs_text_negative = 'Survival';
  }
  //判断结果是阳性还是阴性，并设置文本颜色
  if (rs > 0.5) {
    var rs_text = rs_text_positive;
    $('#rs_progress').addClass('bg-danger');
    $('#rs_text').addClass('text-danger');
  } else if (rs < 0.5) {
    var rs_text = rs_text_negative;
    $('#rs_progress').removeClass('bg-danger');
    $('#rs_text').removeClass('text-danger');
  }else {
    var rs_text = '--';
    $('#rs_progress').removeClass('bg-danger');
    $('#rs_text').removeClass('text-danger');
  }
 //输出结果
  $('#rs_text').html('<b>' + rs_text + '</b>');
  //输出概率
  if (rs_text == '--'){
    //输出概率值
    $('#rs_value').text('--');
    //修改进度条
    $('#rs_progress').attr('aria-valuenow', '0');
    $('#rs_progress').attr('style', 'width: 0%;');
    $('#rs_progress').text('--');
  }else {
    var rs_ratio = math.round(100 - rs * 100)
    //输出概率值
    $('#rs_value').text((1-rs).toFixed(6).toString());
    //修改进度条
    $('#rs_progress').attr('aria-valuenow', rs_ratio);
    $('#rs_progress').attr('style', 'width: ' + rs_ratio + '%;');
    $('#rs_progress').text(rs_ratio.toString() + '%');
  }


}

// 从URL中获取参数
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg); //匹配目标参数
  //返回参数值
  if (r != null) return unescape(r[2]);
  return null;
}


ann_input.push(ann_input_dict["alp"]);
ann_input.push(ann_input_dict["afp"]);
ann_input.push(ann_input_dict["cd4tcc"]);

//根据URL中的参数设置表单
function setForm() {
  $('#arg_tn2').val(getUrlParam('tn2')||'');
  $('#arg_ts5').val(getUrlParam('ts5')||'');
  $('#arg_pvtt').val(getUrlParam('pvtt')||'');
  $('#arg_wbc').val(getUrlParam('wbc')||'');
  $('#arg_nlr').val(getUrlParam('nlr')||'');
  $('#arg_cr').val(getUrlParam('cr')||'');
  $('#arg_alb').val(getUrlParam('alb')||'');
  $('#arg_ggt').val(getUrlParam('ggt')||'');
  $('#arg_alp').val(getUrlParam('alp')||'');
  $('#arg_afp').val(getUrlParam('afp')||'');
  $('#arg_cd4tcc').val(getUrlParam('cd4tcc')||'');
}


//替换URL中指定传入参数的值, paramName为参数名, replaceWith为该参数的新值
function replaceParamVal(paramName, replaceWith) {
  var old_URL = window.location.search;
  var re = eval('/(' + paramName + '=)([^&]*)/gi');
  var param_rs = getUrlParam(paramName);  //判断URL中是否已经包含了该参数
  var has_question_mark = (old_URL.indexOf('?') == -1 && old_URL.indexOf('=') == -1) ? '?' : '';
  if(param_rs != null && replaceWith != ''){
    var new_URL = old_URL.replace(re, paramName + '=' + replaceWith);
  } else if (param_rs == null && replaceWith != '') {
    var new_URL = old_URL+has_question_mark+'&'+paramName+'='+replaceWith;
  }
  history.pushState(null,'', new_URL);
}


// ======================================================================
//切换语言
// 切换为简体中文
function lang_cn(){
  rs_text=$('#rs_text').text();
  console.log(rs_text);
  $('#toggle-lang_cn').removeClass('btn-secondary').addClass('btn-primary');
  $('#toggle-lang_en').removeClass('btn-primary').addClass('btn-secondary');
  $('.multi-lang').each(function(){
    $(this).html($(this).attr('lang_cn'))
  });
  //修改结果的语言
  if (rs_text == '--'){
    $('#rs_text').html('<b>--</b>');
  }else if (rs_text == 'Progression or Death' || rs_text == '进展或死亡'){
    $('#rs_text').html('<b>进展或死亡</b>');
  }else {
    $('#rs_text').html('<b>生存</b>');
  }
}

// ----------------------------------------------------------------
// 切换为英文
function lang_en(){
  rs_text=$('#rs_text').text();
  $('#toggle-lang_cn').removeClass('btn-primary').addClass('btn-secondary');
  $('#toggle-lang_en').removeClass('btn-secondary').addClass('btn-primary');
  $('.multi-lang').each(function(){
    $(this).html($(this).attr('lang_en'))
  });
  //修改结果的语言
  if (rs_text == '--'){
    $('#rs_text').html('<b>--</b>');
  }else if (rs_text == '进展或死亡' || rs_text == 'Progression or Death'){
    $('#rs_text').html('<b>Progression or Death</b>');
  }else {
    $('#rs_text').html('<b>Survival</b>');
  }
}
