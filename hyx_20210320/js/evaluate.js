// ======================================================================
// 主程序
$(function() {
  // ----------------------------------------------------------------
  // 从URL读取参数，并设置表单
  setForm();
  // 计算神经网络模型
  var ann_input = getDataFromForm(); //从表单读取数据，并设置URL
  var rs = eval_ann(re_map_some_index(ann_input));
  // console.log(ann_input);
  // console.log($('#form_agrs').serializeArray());

  // 设置输出结果
  setOutput(rs)

  // ----------------------------------------------------------------
  //当表单变更时计算
  $('#form_agrs').change(function() {
    // 计算神经网络模型
    var ann_input = getDataFromForm(); //从表单读取数据，并设置URL
    var rs = eval_ann(re_map_some_index(ann_input));
    // console.log(ann_input);
    // console.log($('#form_agrs').serializeArray());
    // 输出结果
    setOutput(rs)
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
// ----------------------------------------------------------------
function re_map_some_index(ann_input) {
  // 修改2个指标：
  // Location of varices	三分类：1/2/3	1-Esophageal varices only；2-Gastric varices only；3-Esophageal and gastric varices	预处理 3 →1，其它 → 0	Location of varices	曲张位置		lov
  // Size of varices	三分类：1/2/3	1-Small；2-Medium；3-Large	预处理 3 →1，其它 → 0	Size of varices	曲张大小		sov
  ann_input[5][0] = ann_input[5][0]>2?1:0;
  ann_input[6][0] = ann_input[6][0]>2?1:0;
  console.log(ann_input[5]);
  return ann_input;
}

// ----------------------------------------------------------------
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
  ann_input.push(ann_input_dict['gdr']);  // 1  （Gender）
  ann_input.push(ann_input_dict['smk']);  // 2  （smoke）
  ann_input.push(ann_input_dict['drk']);  // 3  （drink）
  ann_input.push(ann_input_dict['dcp']);  // 4  （Decompensation）
  ann_input.push(ann_input_dict['act']);  // 5  （Ascites）
  ann_input.push(ann_input_dict['lov']);  // 6  （Location of varices）
  ann_input.push(ann_input_dict['sov']);  // 7  （Size of varices）
  ann_input.push(ann_input_dict['alt']);  // 8  （ALT）
  ann_input.push(ann_input_dict['ggt']);  // 9  （GGT）
  ann_input.push(ann_input_dict['rbc']);  // 10  （RBC）
  ann_input.push(ann_input_dict['hct']);  // 11  （HCT）
  ann_input.push(ann_input_dict['nlr']);  // 12  （NLR）

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
  if (1 - rs >= 0.8) {
    var rs_text = rs_text_high;
    $('#rs_text').removeClass('text-success').removeClass('text-warning');
    $('#rs_progress').removeClass('bg-success').removeClass('bg-warning');
    $('#rs_text').addClass('text-danger');
    $('#rs_progress').addClass('bg-danger');
  // } else if (1 - rs <= 0.235 && 1 - rs >= 0.048) {
  //   var rs_text = rs_text_medium;
  //   $('#rs_text').removeClass('text-success').removeClass('text-danger');
  //   $('#rs_progress').removeClass('bg-success').removeClass('bg-danger');
  //   $('#rs_text').addClass('text-warning');
  //   $('#rs_progress').addClass('bg-warning');
} else if (1 - rs < 0.8) {
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

// set input value: select options
function setFormSelect(e, v) {
  for (i = 0; i < e.length; i++) {
    if (e[i].value == parseInt(v)) {
      e[i].selected = true;
      break;
    }
  }
}
// set input value: ratio
function setFormRatio(e, v) {
  if(v=='1'){
    $(`input[name=${e}][value=1]`).get(0).checked = true;
  } else {
    $(`input[name=${e}][value=0]`).get(0).checked = true;
  }
}

//根据URL中的参数设置表单
function setForm() {
  // 处理分类指标
  setFormRatio('gdr',getUrlParam('gdr') || '');
  setFormRatio('smk',getUrlParam('smk') || '');
  setFormRatio('drk',getUrlParam('drk') || '');
  setFormRatio('dcp',getUrlParam('dcp') || '');
  setFormRatio('act',getUrlParam('act') || '');
  setFormSelect($('#arg_lov option'), getUrlParam('lov') || '');
  setFormSelect($('#arg_sov option'), getUrlParam('sov') || '');

  // 处理数值指标
  $('#arg_alt').val(getUrlParam('alt') || '');
  $('#arg_ggt').val(getUrlParam('ggt') || '');
  $('#arg_rbc').val(getUrlParam('rbc') || '');
  $('#arg_hct').val(getUrlParam('hct') || '');
  $('#arg_nlr').val(getUrlParam('nlr') || '');
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
