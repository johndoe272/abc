// 每个字段,每个字段里的值
var fields = loadData(), currentField = {};
// 常量
const TYPE_INPUT = 0;
const TYPE_TEXTAREA = 1;
const TYPE_RADIO = 2;
const TYPE_CHECKBOX = 3;
render();
// 标题和提示
var title = document.getElementById("unnamed");
var hint = document.getElementById("promptArea");

// 存数据
function saveDate(){
	localStorage.setItem("onlinetest", JSON.stringify(fields));
}
// 取数据
function loadData(){
	var collection = localStorage.getItem("onlinetest");
	if(collection != null){
		return JSON.parse(collection);
	}
	else return [];
}

// 添加与编辑的切换
function switchEdit(){
	add.style.display = 'none';
	modify.style.display = 'inline';
	// 传值
  title.value = currentField.name;
  hint.value = currentField.hint;
  
  // radioChecked2();
	renderExtra();
}
// function radioChecked2(item, radio ,items){
		
// 		currentField.items.forEach(function(it) {
// 		 	return it.checked = undefined;
// 		})
// 		radio.checked = item.checked;
// 		render();
// 	}
function addEdit(){
	add.style.display = 'inline';
	modify.style.display = 'none';
}
// 点击字段,向编辑字段插入默认值(选项)和标题
function renderExtra(){
	var extra = document.getElementById('defaul');
	var ind = fields.indexOf(currentField);
	// 清空默认值和类型标题
	extra.innerHTML = '';
	typeTitle.innerHTML = '';
	// 判断类型
  if(currentField.type === TYPE_INPUT) {
  	// 写入类型标题
  	typeTitle.innerHTML = '单行文本';
  	// 创建和写入默认值标题
  	var p = document.createElement('p');
  	p.innerHTML = '默认值';
  	// 创建和写入默认值
  	var input = document.createElement('input');
  	input.value = currentField.default;
  	// oninput：输入事件
  	input.oninput = function() {
  		currentField.default = this.value;
  		render();
  	}
  	// 存放
  	extra.appendChild(p);
  	extra.appendChild(input);
  }

  if(currentField.type === TYPE_TEXTAREA) {
  	typeTitle.innerHTML = '多行文本';
  	var p = document.createElement('p');
  	p.innerHTML = '默认值';
  	var input = document.createElement('textarea');
  	input.value = currentField.default;
  	input.oninput = function() {
  		currentField.default = this.value;
  		render();
  	}
  	extra.appendChild(p);
  	extra.appendChild(input);
  }

  if(currentField.type === TYPE_RADIO) {
  	typeTitle.innerHTML = '单项选择';
  	var p = document.createElement('p');
  	p.innerHTML = '选项';
  	extra.appendChild(p);
  	
  	currentField.items.forEach(function(item) {
  		// 每个选项的外框
  		var optionBox = document.createElement('div');
  		// 选项方框
  		var radio = document.createElement('input');
	  	radio.type = 'radio';
	  	radio.name = 'rad-edit-' + ind;
	  	// 传选项状态 左-右
	  	if(item.checked){
	  		radio.checked = item.checked;
	  	}
	  	// 选项内容
	  	var input = document.createElement('input');
	  	input.value = item.default;
	  	var hideOption = document.createElement('i');

	  	// 显示和隐藏
	  	if (item.display) {
	  		hideOption.setAttribute('class','ion-eye');
	  		hideOption.title = '隐藏选项，此时默认选项会置空';
	  	} 
	  	else{
	  		hideOption.setAttribute('class','ion-eye-disabled');
	  		hideOption.title = '显示选项';
	  		input.setAttribute('readonly',true);
	  		radio.setAttribute('disabled',false);
				input.style.background = '#e6e9ed';
	  	}

	  	// 显示和隐藏
	  	hideOption.addEventListener('click',function(){
		  	item.display = !item.display;
		  	render();
		  	renderExtra();
			});
	  	
	  	var addOption = document.createElement('i');
	  	// 添加按钮
	  	addOption.setAttribute('class','ion-ios-plus-outline');
	  	addOption.onclick = function(){
	  		optionAdd(currentField.items.indexOf(item));
	  	}
	  	// 选项添加
			function optionAdd(index){
				// splice:数组指定位置添加数据
				currentField.items.splice(index + 1,0, {
					default : '选项',
					display : true
				})
				render();
				renderExtra();
			}
	  	var deleteOption = document.createElement('i');
	  	// 删除按钮
	  	deleteOption.setAttribute('class','ion-ios-minus-outline');
	  	// 最后一个选项不可删除
	  	if(currentField.items.length == 1) {
	  		deleteOption.style.display = 'none';
	  	}
	  	deleteOption.onclick = function(){
	  		optionDelete(currentField.items.indexOf(item));
	  	}
	  	// 删除选项
	  	function optionDelete(index){
	  		currentField.items.splice(index, 1);
	  		render();
				renderExtra();
	  	}
	  	// 传选项内容
  		input.oninput = function(){
	  		item.default = this.value;
	  		render();
	  	}
	  	// 传状态 右-左
	  	radio.onclick = function(){
	  		radioChecked(item, this, currentField.items);
	  	}
	  	optionBox.appendChild(hideOption);
	  	optionBox.appendChild(radio);
	  	optionBox.appendChild(input);
	  	optionBox.appendChild(addOption);
	  	optionBox.appendChild(deleteOption);
	  	extra.appendChild(optionBox);
  	})	
  }
  // 传状态
	function radioChecked(item, radio ,items){
		items.forEach(it => it.checked = undefined);
		// items.forEach(function(it) {
		//  	return it.checked = undefined
		// })
		item.checked = radio.checked;
		render();
	}
	
  if(currentField.type === TYPE_CHECKBOX) {
  	typeTitle.innerHTML = '多项选择';
  	var p = document.createElement('p');
  	p.innerHTML = '选项';
  	extra.appendChild(p);

  	currentField.items.forEach(function(item){
  		var optionBox = document.createElement('div');
  		var checkbox = document.createElement('input');
  		checkbox.type = 'checkbox';
  		checkbox.name = 'che-edit-' + ind;
  		if(item.checked){
	  		checkbox.checked = item.checked;
	  	}
  		var input = document.createElement('input');
  		input.value = item.default;
  		// 按钮
  		var hideOption = document.createElement('i');

  		// 显示和隐藏
  		if(item.display) {
	  			hideOption.setAttribute('class','ion-eye');
	  	} 
	  	else{
	  			hideOption.setAttribute('class','ion-eye-disabled');
	  			input.setAttribute('readonly',true);
	  			checkbox.setAttribute('disabled',false);
					input.style.background = '#e6e9ed';
	  	}

  		hideOption.addEventListener('click',function(){
	  		item.display = !item.display;
		  	render();
		  	renderExtra();
			});

  		var addOption = document.createElement('i');
  		// 添加按钮
	  	addOption.setAttribute('class','ion-ios-plus-outline');
	  	addOption.onclick = function(){
	  		optionAdd(currentField.items.indexOf(item));
	  	}
	  	function optionAdd(index){
			currentField.items.splice(index + 1,0, {
				default : '选项',
				display : true
			})
			render();
			renderExtra();
			}

	  	var deleteOption = document.createElement('i');
	  	// 删除按钮
	  	deleteOption.setAttribute('class','ion-ios-minus-outline');
	  	if (currentField.items.length == 1) {
	  		deleteOption.style.display = 'none';
	  	}
	  	deleteOption.onclick = function(){
	  		optionDelete(currentField.items.indexOf(item));
	  	}
	  	function optionDelete(index){
	  		currentField.items.splice(index, 1);
	  		render();
				renderExtra();
	  	}

  		input.oninput = function() {
	  		item.default = this.value;
	  		render();
	  	}	
	  	checkbox.onclick = function(){
	  		checkboxChecked(item, this, currentField.items);
	  	}
	  	optionBox.appendChild(hideOption);
	  	optionBox.appendChild(checkbox);
	  	optionBox.appendChild(input);
	  	optionBox.appendChild(addOption);
	  	optionBox.appendChild(deleteOption);
	  	extra.appendChild(optionBox);
  	})
  }
	function checkboxChecked(item,checkbox,items){
		item.checked = checkbox.checked;
		render();
	}

}

// 标题传值
function inputName() {
	currentField.name = title.value;
	render();
}
// 提示传值
function inputHint(){
	currentField.hint = hint.value;
		render();
}

// 字段数据写入
function addField(item){
	fields.push(item);
}
// 单行文字
function addInput(){
	addField({
		// 类型
		type : TYPE_INPUT,
		// 默认值
		default : '',
		// 提示
		hint : '',
		// 标题
		name : ''
	})
	render();
}
// 多行文字
function addTextarea(){
	addField({
		type : TYPE_TEXTAREA,
		default : '',
		hint : '',
		name : ''
	})
	render();
}
// 单项选择
function addRadio(){

	addField({

		type : TYPE_RADIO,
		items : [
			{
				default : '选项',
				display : true
			},
			{
				default : '选项',
				display : true
			},
			{
				default : '选项',
				display : true
			},
		],
		hint : '',
		name : ''
	})

	render();
}
// 多项选择
function addCheckbox(){
	addField({
		type : TYPE_CHECKBOX,
		items : [
			{
				default : '选项',
				display : true
			},
			{
				default : '选项',
				display : true
			},
			{
				default : '选项',
				display : true
			},
		],
		hint : '',
		name : ''
	})
	render();
}
// 删除字段
function delField(index, e){
	// 阻止默认行为
	// e.preventDefault()
	// 阻止事件冒泡
	e.stopPropagation();
	fields.splice(index, 1);
	addEdit();
	render();
}
// 字段的插入
function render(){
	// 获取content
	var content = document.getElementById('content');
	// 清空
	content.innerHTML = '';
	// forEach:遍历数组
	// for(var i = 0; i < fields.length; i++)
	// {
	//   var field = fields[i]
	//   ......
	// }
	fields.forEach(function(field) {
		var container = document.createElement('div');
		container.onclick = function (){
			currentField = field;
			switchEdit();
		}
		var html = '';
		var index = fields.indexOf(field);
		var name = field.name ? field.name : '未命名';
		html = `<div>${name}</div><p>${field.hint}</p>`;
		// 单行文本
		if (field.type === TYPE_INPUT) {
			html += `<input readonly="true" value="${field.default}" />`;
		}
		// 多行文本
		if (field.type === TYPE_TEXTAREA) {
			html += `<textarea readonly="true">${field.default}</textarea>`;
		}
		// 单选按钮
		if (field.type === TYPE_RADIO) {
			var repeat = '';
			field.items.forEach(function(item) {
				var checked = item.checked ? 'checked="checked"' : '';
				if (item.display) {
					repeat += `<div><input disabled="ture" type="radio" id="check" name="rad-${index}" ${checked}/><span>${item.default}</span></div>`;
				}
			})
			html += repeat;
		}
		// 多选按钮
		if (field.type === TYPE_CHECKBOX) {
			var repeat = '';
			field.items.forEach(function(item){
				var checked = item.checked ? 'checked="checked"' : '';
				if (item.display) {
						repeat += `<div><input disabled="ture" type="checkbox" id="checkbo" name="che-${index}" ${checked} /><span>${item.default}</span></div>`;
				}
			})
			html += repeat;
		}
		html += `<i class="ion-trash-a" onclick="delField(${index}, event)"></i>`;
		container.innerHTML = html;
		content.appendChild(container);
	})
}	
// 回调函数
// function a(arr, cb){
// 	for(var i = 0;i < arr.length ;i++){
// 		//cb(array[i], i)

// 		cb.apply(arr, [arr[i], i])
// 	}
// }

// a([1,2,3], function(item, idx){
// 	console.log(item, idx)

// console.log(this)
// })
// 