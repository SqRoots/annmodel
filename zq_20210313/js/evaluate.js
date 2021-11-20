// ======================================================================
// 主程序
$(function() {
  lang_en();
  // ----------------------------------------------------------------
  // 从URL读取参数，并设置表单
  setForm();
  // 计算神经网络模型
  var ann_input = getDataFromForm(); //从表单读取数据，并设置URL
  var rs = eval_ann(ann_input);
  // console.log(ann_input);
  // console.log($('#form_agrs').serializeArray());

  // 设置输出结果
  setOutput(rs)

  // ----------------------------------------------------------------
  //当表单变更时计算
  $('#form_agrs').change(function() {
    // 计算神经网络模型
    var ann_input = getDataFromForm(); //从表单读取数据，并设置URL
    var rs = eval_ann(ann_input);
    // console.log(ann_input);
    // console.log($('#form_agrs').serializeArray());
    // 输出结果
    setOutput(rs);
  });
});

// ======================================================================
// 定义常量
const RS_CN_LOW_RISK = '低风险';
const RS_CN_MEDIUM_RISK = '中风险';
const RS_CN_HIGH_RISK = '高风险';

const RS_EN_LOW_RISK = 'Low Risk';
const RS_EN_MEDIUM_RISK = 'Medium Risk';
const RS_EN_HIGH_RISK = 'High Risk';

// ======================================================================
// 定义函数
function getDataFromForm() {
  // 从表单读取输入数据 ann_input
  form_agrs = $('#form_agrs').serializeArray();

  var ann_input_dict = {};
  for (k in form_agrs) {
    // console.log(form_agrs[k]);
    // 收集神经网络输入数据
    ann_input_dict[form_agrs[k].name] = [parseFloat(form_agrs[k].value)];
    // 更新URL
    // console.log([form_agrs[k].name, form_agrs[k].value]);
    replaceParamVal(form_agrs[k].name, form_agrs[k].value)
  }
  var ann_input = [];
  ann_input.push(ann_input_dict['oxa']);  // Oxalic acid  （草酸）
  ann_input.push(ann_input_dict['sua']);  // Succinic acid  （琥珀酸）
  ann_input.push(ann_input_dict['thm']);  // Thymine  （胸腺嘧啶）
  ann_input.push(ann_input_dict['gaa']);  // GABA  （γ-氨基丁酸）
  ann_input.push(ann_input_dict['qua']);  // Quinolinic acid  （喹啉酸）
  ann_input.push(ann_input_dict['caa']);  // Caffeic acid  （咖啡酸）
  ann_input.push(ann_input_dict['sgs']);  // Sphingosine  （鞘氨醇）
  ann_input.push(ann_input_dict['era']);  // Erucic acid  （芥酸）
  ann_input.push(ann_input_dict['lts']);  // Lathosterol  （烯胆甾烷醇）
  ann_input.push(ann_input_dict['lca']);  // LCA  （石胆酸）
  ann_input.push(ann_input_dict['dca']);  // DCA  （脱氧胆酸）

  return ann_input;
}

// ----------------------------------------------------------------
// 设置输出
function setOutput(rs) {
  console.log({'阳性概率准确值':1-rs});
  //根据语言设置输出结果的变量
  if ($('#toggle-lang_cn').hasClass('btn-primary')) {
    var rs_text_low = RS_CN_LOW_RISK;
    var rs_text_medium = RS_CN_MEDIUM_RISK;
    var rs_text_high = RS_CN_HIGH_RISK;
  } else {
    var rs_text_low = RS_EN_LOW_RISK;
    var rs_text_medium = RS_EN_MEDIUM_RISK;
    var rs_text_high = RS_EN_HIGH_RISK;
  }
  //判断结果是阳性还是阴性，并设置文本颜色
  if (1 - rs > 0.235) {
    var rs_text = rs_text_high;
    $('#rs_text').removeClass('text-success').removeClass('text-warning');
    $('#rs_progress').removeClass('bg-success').removeClass('bg-warning');
    $('#rs_text').addClass('text-danger');
    $('#rs_progress').addClass('bg-danger');
  } else if (1 - rs <= 0.235 && 1 - rs >= 0.048) {
    var rs_text = rs_text_medium;
    $('#rs_text').removeClass('text-success').removeClass('text-danger');
    $('#rs_progress').removeClass('bg-success').removeClass('bg-danger');
    $('#rs_text').addClass('text-warning');
    $('#rs_progress').addClass('bg-warning');
  } else if (1 - rs < 0.048) {
    var rs_text = rs_text_low;
    $('#rs_text').removeClass('text-danger').removeClass('text-warning');
    $('#rs_progress').removeClass('bg-danger').removeClass('bg-warning');
    $('#rs_text').addClass('text-success');
    $('#rs_progress').addClass('bg-success');
  } else {
    var rs_text = '--';
    $('#rs_text').removeClass('text-danger').removeClass('text-warning').removeClass('text-success');
    $('#rs_progress').removeClass('bg-danger').removeClass('bg-warning').removeClass('bg-success');
  }
  //输出结果
  $('#rs_text').html('<b>' + rs_text + '</b>');
  //输出概率
  if (rs_text == '--') {
    //输出概率值
    $('#rs_value').text('--');
    //修改进度条
    $('#rs_progress').attr('aria-valuenow', '0');
    $('#rs_progress').attr('style', 'width: 0%;');
    $('#rs_progress').text('--');
  } else {
    var rs_ratio = math.round(10000 - rs * 10000)/100.0;
    //输出概率值
    $('#rs_value').text((100*(1 - rs)).toFixed(4).toString()+'%');
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


// ann_input.push(ann_input_dict["alp"]);
// ann_input.push(ann_input_dict["afp"]);
// ann_input.push(ann_input_dict["cd4tcc"]);

// input select options
function setFormSelect(e, v) {
  for (i = 0; i < e.length; i++) {
    if (e[i].value == parseInt(v)) {
      e[i].selected = true;
      break;
    }
  }
}

//根据URL中的参数设置表单
function setForm() {
  $('#arg_oxa').val(getUrlParam('oxa') || '');
  $('#arg_caa').val(getUrlParam('caa') || '');
  $('#arg_gaa').val(getUrlParam('gaa') || '');
  $('#arg_sua').val(getUrlParam('sua') || '');
  $('#arg_era').val(getUrlParam('era') || '');
  $('#arg_qua').val(getUrlParam('qua') || '');
  $('#arg_lca').val(getUrlParam('lca') || '');
  $('#arg_dca').val(getUrlParam('dca') || '');
  $('#arg_sgs').val(getUrlParam('sgs') || '');
  $('#arg_lts').val(getUrlParam('lts') || '');
  $('#arg_thm').val(getUrlParam('thm') || '');


  // setFormSelect($('#arg_asc option'), getUrlParam('asc') || ''); // 处理4个选项
  // setFormSelect($('#arg_enc option'), getUrlParam('enc') || ''); // 处理4个选项
  // setFormSelect($('#arg_gvb option'), getUrlParam('gvb') || ''); // 处理4个选项
  // setFormSelect($('#arg_cpc option'), getUrlParam('cpc') || ''); // 处理4个选项
}


//替换URL中指定传入参数的值, paramName为参数名, replaceWith为该参数的新值
function replaceParamVal(paramName, replaceWith) {
  var old_URL = window.location.search;
  var re = eval('/(' + paramName + '=)([^&]*)/gi');
  var param_rs = getUrlParam(paramName); //判断URL中是否已经包含了该参数
  var has_question_mark = (old_URL.indexOf('?') == -1 && old_URL.indexOf('=') == -1) ? '?' : '';
  if (param_rs != null && replaceWith != '') {
    var new_URL = old_URL.replace(re, paramName + '=' + replaceWith);
  } else if (param_rs == null && replaceWith != '') {
    var new_URL = old_URL + has_question_mark + '&' + paramName + '=' + replaceWith;
  }
  history.pushState(null, '', new_URL);
}


// ======================================================================
//切换语言
// 切换为简体中文
function lang_cn() {
  rs_text = $('#rs_text').text();
  // console.log(rs_text);
  $('#toggle-lang_cn').removeClass('btn-secondary').addClass('btn-primary');
  $('#toggle-lang_en').removeClass('btn-primary').addClass('btn-secondary');
  $('.multi-lang').each(function() {
    $(this).html($(this).attr('lang_cn'))
  });
  //修改结果的语言
  if (rs_text == RS_EN_HIGH_RISK) {
    $('#rs_text').html(`<b>${RS_CN_HIGH_RISK}</b>`);
  } else if (rs_text == RS_EN_MEDIUM_RISK) {
    $('#rs_text').html(`<b>${RS_CN_MEDIUM_RISK}</b>`);
  } else if (rs_text == RS_EN_LOW_RISK) {
    $('#rs_text').html(`<b>${RS_CN_LOW_RISK}</b>`);
  } else {
    $('#rs_text').html('<b>--</b>');
  }

}

// ----------------------------------------------------------------
// 切换为英文
function lang_en() {
  rs_text = $('#rs_text').text();
  $('#toggle-lang_cn').removeClass('btn-primary').addClass('btn-secondary');
  $('#toggle-lang_en').removeClass('btn-secondary').addClass('btn-primary');
  $('.multi-lang').each(function() {
    $(this).html($(this).attr('lang_en'))
  });
  //修改结果的语言
  if (rs_text == RS_CN_HIGH_RISK) {
    $('#rs_text').html(`<b>${RS_EN_HIGH_RISK}</b>`);
  } else if (rs_text == RS_CN_MEDIUM_RISK) {
    $('#rs_text').html(`<b>${RS_EN_MEDIUM_RISK}</b>`);
  } else if (rs_text == RS_CN_LOW_RISK) {
    $('#rs_text').html(`<b>${RS_EN_LOW_RISK}</b>`);
  } else {
    $('#rs_text').html('<b>--</b>');
  }
}
