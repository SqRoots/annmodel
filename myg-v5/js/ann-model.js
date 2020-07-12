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
  // console.log(ann_input);
  var standard_input = math.dotDivide(math.subtract(ann_input,data_mean),data_std);
  // standard_input = LogisticSigmoid(standard_input);
  standard_input.push([1]);
  // console.log(standard_input);

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
[ 2.4842906526023660],
[ 96.8811616954474000],
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
[ 1.9329163172658560],
[ 45.5944722792349700],
[ 1.0000000000000000]
];

//输入→隐藏层1，Weight+Biases
var ann_layer_1 = [
[-0.0366039872169495, 0.1326695680618286,-0.0576981157064438,-0.0952513515949249,-0.0284086987376213, 0.0034142010845244,-0.0993998050689697,-0.0267682205885649, 0.0206575337797403, 0.0497328080236912],
[-0.0028859255835414, 0.0041259066201746,-0.0035852836444974,-0.0160930398851633,-0.0040499097667634, 0.0209995340555906, 0.0324675515294075, 0.0281864069402218, 0.0105618210509419, 0.0166261419653893],
[ 0.0566413328051567,-0.2464712709188461,-0.1256128698587418, 0.0381088815629482, 0.2205367982387543,-0.0938843563199043, 0.1241915449500084, 0.1568461507558823, 0.0516356602311134, 0.1456096172332764],
[ 0.1229460611939430, 0.1740225553512573,-0.1183148473501205, 0.2753467559814453, 0.1297536492347717,-0.2340849190950394,-0.0778139904141426,-0.0379893593490124,-0.0282420851290226,-0.1708002537488937],
[-0.1752660870552063,-0.0671985074877739, 0.0207152366638184, 0.2543332874774933, 0.0598441101610661,-0.1003092750906944,-0.2412614375352860, 0.0755468532443047,-0.0867168009281158,-0.0006581570487469],
[ 0.1357407569885254, 0.2268664985895157,-0.3010080456733704,-0.0706567615270615,-0.1350200921297073, 0.2304555475711823,-0.4326333105564117, 0.0011341266799718, 0.0569831356406212, 0.2040941864252090],
[-0.1624710410833359,-0.2764364778995514,-0.1163841485977173, 0.0395845212042332, 0.1448964327573776,-0.1970069557428360, 0.1084330976009369,-0.1042330637574196, 0.1815453916788101,-0.0171510186046362],
[-0.0000000000003002,-0.0000000000005817,-0.0000000000000597, 0.0000000000000363, 0.0000000000001135,-0.0000000000006700, 0.0000000000000500, 0.0000000000000633,-0.0000000000002561, 0.0000000000003487],
[ 0.1126455143094063,-0.0921060666441917,-0.1431357115507126, 0.2427222728729248, 0.2315051406621933,-0.2673944532871246, 0.0831752941012383,-0.0763841420412064,-0.2231232821941376, 0.5828836560249329],
[ 0.1537657231092453,-0.2311691790819168,-0.1031174659729004,-0.1405430883169174, 0.2069238275289536, 0.0217547826468945, 0.2886035144329071,-0.7873439788818359, 0.0508467480540276,-0.0250981766730547],
[-0.1359480768442154,-0.2277545630931854, 0.0507314465939999,-0.4150150418281555, 0.2432865202426910, 0.2068916112184525, 0.1147890165448189, 0.2056321352720261, 0.3591831624507904, 0.0165818165987730],
[ 0.2064027041196823, 0.0380741432309151, 0.1767432242631912, 0.3652233481407166, 0.3360089957714081, 0.2820275425910950, 0.2842343747615814,-0.0674978494644165,-0.0139468144625425,-0.1416322439908981],
[-0.0000000000000417,-0.0000000000000858,-0.0000000000000000,-0.0000000000000112, 0.0000000000001168, 0.0000000000000248, 0.0000000000000179, 0.0000000000000310,-0.0000000000000055,-0.0000000000000613],
[-0.1687010526657104,-0.1052874475717545, 0.0675291344523430, 0.2606905698776245,-0.0199651941657066, 0.0173791609704495,-0.0986103564500809,-0.2204634100198746,-0.0105714984238148, 0.1409633606672287],
[ 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 1.0000000000000000]
];

//输入→隐藏层2，Weight+Biases
var ann_layer_2 = [
[ 0.0134915793314576, 0.0034171815495938, 0.0303052589297295,-0.0315443724393845, 0.0291351638734341, 0.0430615358054638, 0.0315376669168472, 0.0000000000000706, 0.0515942275524139,-0.0608961805701256, 0.0475154854357243,-0.0471495576202869,-0.0000000000000115, 0.0284191947430372, 0.0325000397861004],
[ 0.0958311855792999, 0.0242723859846592, 0.2152593284845352,-0.2240608483552933, 0.2069481909275055, 0.3058680593967438, 0.2240133583545685, 0.0000000000005013, 0.3664760589599609,-0.4325479865074158, 0.3375047445297241,-0.3349049985408783,-0.0000000000000817, 0.2018625736236572, 0.2308489680290222],
[ 0.1543639749288559, 0.0390972010791302, 0.3467336893081665,-0.3609121739864349, 0.3333455920219421, 0.4926897287368774, 0.3608307540416718, 0.0000000000008075, 0.5903043746948242,-0.6967334747314453, 0.5436459183692932,-0.5394528508186340,-0.0000000000001316, 0.3251505196094513, 0.3718382418155670],
[ 0.0768781527876854, 0.0194718986749649, 0.1726862490177155,-0.1797470301389694, 0.1660187989473343, 0.2453744113445282, 0.1797088533639908, 0.0000000000004021, 0.2939956784248352,-0.3470005989074707, 0.2707544863224030,-0.2686690688133240,-0.0000000000000656, 0.1619390547275543, 0.1851926594972610],
[ 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 1.0000000000000000]
];

//输入→隐藏层3，Weight+Biases
var ann_layer_3 = [
[ 0.0958287492394447, 0.6806750893592834, 1.0964096784591670, 0.5460541248321533,-0.6922147274017334],
[-0.0958286076784134,-0.6806740164756775,-1.0964080095291140,-0.5460532903671265, 0.6922165155410767],
[ 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 0.0000000000000000, 1.0000000000000000]
];
