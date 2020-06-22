// ===========================================================================
// 定义计算神经网络的函数
// evaluate ann
function eval_ann(ann_input){
  // 从表单读取输入数据 ann_input
  // form_agrs = $('#form_agrs').serializeArray();
  // var ann_input = [];
  // for (k in form_agrs){
  //   ann_input.push([parseFloat(form_agrs[k].value)])
  // }
  for (var i=0,len=ann_input.length; i<len; i++){
    if (ann_input[i]==''){
      return null
    }
  }

  // 计算神经网络，输入数据标准化
  console.log(ann_input);
  var standard_input = math.dotDivide(math.subtract(ann_input,data_mean),data_std);
  // standard_input = LogisticSigmoid(standard_input);
  standard_input.push([1]);

  // 输入不做标准化，也不使用 LogisticSigmoid 处理
  // standard_input = ann_input;	// 向量
  // standard_input.push([1]);		// 增补末尾的 1

  // 计算神经网络，隐藏层1
  ann_layer_1_out = math.multiply(ann_layer_1,standard_input);	// 输入→输出
  ann_layer_1_out.pop();										// 去掉末尾的 1
  ann_layer_1_out = Ramp(ann_layer_1_out);						// 使用激活函数
  ann_layer_1_out.push([1]);									// 增补末尾的 1，得到最终输出

  // 计算神经网络，隐藏层2
  ann_layer_2_out = math.multiply(ann_layer_2,ann_layer_1_out);	// 输入→输出
  ann_layer_2_out.pop();										// 去掉末尾的 1
  ann_layer_2_out = Ramp(ann_layer_2_out);						// 使用激活函数
  ann_layer_2_out.push([1]);									// 增补末尾的 1，得到最终输出

  // 计算神经网络，隐藏层3
  ann_layer_3_out = math.multiply(ann_layer_3,ann_layer_2_out);
  ann_layer_3_out.pop();

  // 计算神经网络，输出层
  sm = SoftMax(ann_layer_3_out);

  // 返回结果
  return sm[0]  // [阳性概率，阴性概率]
}


// ===========================================================================
// 定义常用的激活函数（有些可能未被使用）
// 激活函数（Activation Function）LogisticSigmoid
function LogisticSigmoid(x_matrix){
  return math.dotDivide(1,math.add(1,math.exp(math.unaryMinus(x_matrix))))
}
// console.log(LogisticSigmoid([1,2,3]));

// 激活函数（Activation Function）Ramp
function Ramp(x_matrix){
  const a = math.matrix(x_matrix);
  const b = a.map(function (value, index, matrix) {
    return Math.max(0,value)
  });
  return b["_data"];
}

// 激活函数（Activation Function）SoftMax
function SoftMax(x_matrix){
  x = math.flatten(x_matrix);
  return math.divide(math.exp(x),math.multiply(math.ones(math.size(x)),math.exp(x)))
}
// console.log(SoftMax([1,2,3]));


// ===========================================================================
// const parser = math.parser()
// // 激活函数（Activation Function）
// parser.eval('LogisticSigmoid(x) = 1./(1.+e.^(-x))')
// console.log(parser.eval('LogisticSigmoid([1,2,3])'));
//
//
// // SoftMax
// parser.eval('SoftMax(x) = e.^(x)./(ones(size(x)[1])*(e.^(x)))')
// console.log(parser.eval('SoftMax([1,2,3])'));
// ===========================================================================


// 均值
var data_mean = [
[ 49.2715855572998400],
[ 0.0000000000000000],
[ 0.0000000000000000],
[ 0.0000000000000000],
[ 123.2510204081632000],
[ 34.5106750392464600],
[ 2.6245211930926220],
[ 1.2478021978021980],
[ 2.4842906526023660],
[ 96.8811616954474000],
[ 5.7226373626373630],
[ 0.0000000000000000]
];

//标准差
var data_std = [
[ 11.7042979593416400],
[ 1.0000000000000000],
[ 1.0000000000000000],
[ 1.0000000000000000],
[ 197.4019484804905000],
[ 6.9849284525327660],
[ 1.7166992328979870],
[ 0.6376276824618760],
[ 1.9329163172658560],
[ 45.5944722792349700],
[ 2.6504848759060800],
[ 1.0000000000000000]
];

//输入→隐藏层1，Weight+Biases
var ann_layer_1 = [
[-0.2715591788291931, 0.1343124210834503, 0.0246877577155829, 0.0742756724357605,-0.0695034861564636, 0.1467964798212051,-0.1917356997728348,-0.2871264517307281,-0.1550749242305756,-0.1384634226560593, 0.1547880321741104,-0.0113724246621132, 0.1691011339426041],
[-0.1639017611742020,-0.2265865802764893, 0.1934452950954437, 0.1759217530488968, 0.1087497249245644, 0.0905600264668465,-0.1313795894384384,-0.1256235241889954, 0.1317098140716553, 0.1341015547513962, 0.2563010752201080,-0.1540015339851379, 0.1233159229159355],
[ 0.0906846225261688, 0.1723653972148895,-0.0119589455425739,-0.0742070004343987,-0.0818483680486679, 0.1450380980968475, 0.0032566308509558, 0.1355751305818558,-0.2546521127223969,-0.0393314957618713,-0.0515816546976566, 0.0474630221724510, 0.1446515470743179],
[-0.2574965655803680,-0.1082306355237961,-0.0118818022310734, 0.2165864706039429, 0.0672298148274422,-0.2195451110601425,-0.2754858732223511, 0.0604262650012970,-0.0114457495510578, 0.1834796816110611, 0.0727678537368774,-0.0901346579194069, 0.0210157725960016],
[ 0.1800784170627594,-0.2489996403455734,-0.1351132243871689,-0.1868377774953842, 0.2089511007070541, 0.0555979833006859, 0.1015549823641777,-0.3201693594455719, 0.1597877442836761,-0.7242628335952759, 0.0258215460926294, 0.0467506796121597,-0.0120720872655511],
[-0.0000000000000000,-0.0000000000000000,-0.0000000000000000,-0.0000000000000000,-0.0000000000000000,-0.0000000000000000,-0.0000000000000000, 0.0000000000000000,-0.0000000000000000, 0.0000000000000000, 0.0000000000000000,-0.0000000000000000,-0.0000000000000000],
[ 0.0000000441506067,-0.0000000780044687,-0.0000000676742644,-0.0000000374742442, 0.0000000299690477,-0.0000000753357980, 0.0000000597303540, 0.0000001194642465,-0.0000000596242700,-0.0000000845325019,-0.0000000170713346,-0.0000000337752972, 0.0000000144461616],
[-0.1883405894041061,-0.1120738685131073,-0.1181011945009232, 0.0762612968683243,-0.0677231922745705, 0.2710494101047516, 0.1617655307054520,-0.0658836960792542, 0.0855293571949005,-0.1331551223993301,-0.0190687365829945,-0.0265236999839544, 0.1144709661602974],
[ 0.0067220670171082, 0.0605955943465233, 0.1757005751132965, 0.1684272289276123,-0.0226434636861086, 0.1147897914052010, 0.1806726902723312, 0.1540592610836029, 0.1283716112375259, 0.0556854680180550, 0.0384580828249455, 0.0616214945912361, 0.0430424846708775],
[-0.1696005314588547,-0.3790806531906128,-0.2408824712038040,-0.1319508701562881, 0.3114556074142456, 0.0681785494089127, 0.1200255975127220,-0.0168917514383793, 0.1617601513862610, 0.0715540871024132,-0.2434473782777786, 0.3490534722805023, 0.1793359965085983],
[-0.0299908779561520, 0.0677407979965210,-0.0401831194758415,-0.0376787260174751,-0.1139866858720779,-0.0695202723145485, 0.0155597552657127, 0.0842123553156853, 0.2050332129001617,-0.1811718493700027,-0.2275550514459610,-0.0315678901970387,-0.0392277315258980],
[ 0.1590171605348587,-0.1629103869199753,-0.1267407089471817, 0.0911908224225044,-0.0272101014852524,-0.1850402504205704, 0.2095938622951508, 0.0364294797182083, 0.1871898472309113, 0.0094961244612932, 0.2495453655719757, 0.1132095456123352, 0.1403305679559708],
[-0.1284124404191971, 0.1743842065334320, 0.1675467044115067, 0.0925454422831535,-0.1382025182247162,-0.2043884843587875,-0.1528538316488266,-0.1146987006068230, 0.0158606246113777,-0.0467625670135021,-0.0235331915318966, 0.0321531854569912,-0.1180194020271301],
[-0.0000000018840023, 0.0000000055786060, 0.0000000014190341, 0.0000000011133285, 0.0000000014271306, 0.0000000009251853,-0.0000000009729885,-0.0000000022836533, 0.0000000053138760,-0.0000000001511107, 0.0000000001369261, 0.0000000127281421, 0.0000000100286739],
[ 0.1215139701962471, 0.0691313073039055, 0.0467758178710938, 0.2826557159423828, 0.2333245426416397, 0.2128671705722809, 0.0177848562598229,-0.1974627822637558, 0.2407399266958237,-0.0192109532654285, 0.2661637365818024,-0.0269500836730003,-0.2195012122392654],
[ 0.0000018984910639, 0.0000108933882075,-0.0000068079184530,-0.0000040913946577,-0.0000007049857231, 0.0000086903683041, 0.0000093524758995, 0.0000071903377830,-0.0000094946281024,-0.0000005462950412,-0.0000100947227111, 0.0000028994168133,-0.0000026341983812],
[ 0.0613011643290520,-0.0280654970556498, 0.0260486286133528, 0.0071937497705221,-0.0059266258031130, 0.1630510240793228,-0.0586922056972981, 0.1048650667071342,-0.1383118629455566, 0.0287994537502527, 0.0482623204588890,-0.0212730448693037, 0.0926302820444107],
[-0.0166897214949131, 0.1424669474363327,-0.0574839897453785,-0.1572752147912979, 0.0089865569025278, 0.1017614677548409,-0.0229231808334589,-0.1034267619252205,-0.0765826478600502, 0.1663836240768433,-0.0913132876157761,-0.0163280870765448,-0.1159130707383156],
[ 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 1.0000000000000000]
];

//输入→隐藏层2，Weight+Biases
var ann_layer_2 = [
[-0.1834374070167542,-0.2884168624877930,-0.1478544473648071,-0.2279648333787918, 0.6841126084327698, 0.0000000000000000,-0.0000001174374376, 0.3319205939769745, 0.2998889684677124,-0.2280215322971344, 0.2872345447540283,-0.1557200849056244, 0.3276258707046509, 0.0000000149655239, 0.4549024999141693,-0.0000103808979475,-0.1054820045828819,-0.1603228002786636, 0.2142277210950851],
[ 0.5046209692955017, 0.5000584125518799, 0.3720571100711823, 0.4967890083789825,-0.5798020362854004,-0.0000000000000000, 0.0000001888596017,-0.3171674609184265,-0.2354765832424164, 0.7140816450119019,-0.2614450454711914, 0.4775472283363342,-0.2644230723381042, 0.0000000125246329,-0.4311238825321198, 0.0000204672523978, 0.2500313818454742, 0.2990332543849945, 0.4383519887924194],
[ 0.0212998017668724, 0.0211072266101837, 0.0157043393701315, 0.0209692288190126,-0.0244731623679400,-0.0000000000000000, 0.0000000079716669,-0.0133874947205186,-0.0099393501877785, 0.0301410388201475,-0.0110354656353593, 0.0201570671051741,-0.0111611643806100, 0.0000000005286584,-0.0181975048035383, 0.0000008639122484, 0.0105537064373493, 0.0126220425590873, 0.0185026191174984],
[-0.0000000000000000,-0.0000000000000000,-0.0000000000000000,-0.0000000000000000,-0.0000000000000000,-0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000,-0.0000000000000000,-0.0000000000000000, 0.0000000000000000,-0.0000000000000000,-0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000,-0.0000000000000000],
[ 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 1.0000000000000000]
];

//输入→隐藏层3，Weight+Biases
var ann_layer_3 = [
[-0.8376979231834410, 1.1761022806167600, 0.0496427081525326,-0.0000000000000000, 0.0531658008694649],
[ 0.8376984000205990,-1.1761008501052860,-0.0496426448225975,-0.0000000000000000,-0.0531644821166992],
[ 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 1.0000000000000000]
];
