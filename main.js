
var width, height, yOffset, xOffset, elementWidth, elementStroke, top_rad;
var baseUrl = "https://major-app.herokuapp.com/";
var num_inputs = 1;
var timer = {
	'very_fast': 200,
	'fast': 500,
	'medium': 1000,
	'slow': 1500,
	'very_slow': 2000
};

var line_timers = {};
var num_lines = {};

$('#addNewInput').click(function(){
	if(num_inputs < MAX){
		num_inputs += 1;
		let txt1 = "<input type='number' class='form-control row-holder' id='create_val_"+num_inputs+"'>";
		$('#create_form').append(txt1);
	}
	if(num_inputs == MAX)
		$('#addNewInput').css('display','none');
	if(num_inputs > 1)
		$('#removeNewInput').css('display','block');
});

$('#removeNewInput').click(function(){
	if(num_inputs > 1){
		let txt1 = "#create_val_"+num_inputs;
		$(txt1).remove();
		$('#addNewInput').css('display','block');
	}
	num_inputs -= 1;
	if(num_inputs == 1)
		$('#removeNewInput').css('display','none');
});

function readTextFile(file){
    var rawFile = new XMLHttpRequest();
    var allText = '';
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function (){
        if(rawFile.readyState === 4)
        	if(rawFile.status === 200 || rawFile.status == 0)
                allText = rawFile.responseText;
    }
    rawFile.send(null);
    return allText;
}

function prepare_code(ds, codes){
	for(var code_url in codes){
		if(codes.hasOwnProperty(code_url)){
			let preB = `<pre id="${code_url}" class="prettyprint lang-c" >`;
			let spanB = `<span class="` 
			let spanI = `">`;
			let spanE = `</span><br>`;
			let preE = `</pre>`;
			let line = 0;
			code = readTextFile(codes[code_url]).split(/\r?\n/);
			let num_line = parseInt(code[0]);
			let line_timer = new Array(num_line);
			for(let i = 1; i < 6; i++){
				str = code[i].split('=');
				vals = str[1].split(',')
				for(let j = 0; j < vals.length; j++){
					let temp = parseInt(vals[j].trim())
					if(!isNaN(temp))
						line_timer[temp] = str[0].trim();
				}
			}
			$('.code-viewer').append(preB);
			for(let i = 7; i < code.length; i++){
				if(code[i].trim() == '}'){
					$('#'+code_url).append(spanB+ds+"_line0"+spanI+"\t"+code[i]+spanE);
				}else{
					$('#'+code_url).append(spanB+ds+"_line"+line+spanI+"\t"+code[i]+spanE);
					line++;
				}
			}
			$('.code-viewer').append(preE);
			line_timers[code_url] = line_timer;
			num_lines[code_url] = num_line;
		}
	}
}

function show_code(codes, code){
	for(let i in codes)
		if(codes[i] == code)
			$('#'+code).css('display', 'block');
		else
			$('#'+codes[i]).css('display', 'none');
}

function throwError(base, error, class_val){
	d3.select(base)
		.insert('div', ":first-child")
		.attr('class',"alert alert-"+class_val)
		.text(error)
		.transition()
			.remove()
			.duration(timer['very_slow']);
}

function roundTo2(num){
	return Math.round(num*100) / 100;
}

async function highlight_line(ds, line, code){
	for(let i = 1; i <= num_lines[code]; i++){
		if(i == line)
			$('.'+ds+'_line'+i).css('background-color','#0069D9'); 
		else
			$('.'+ds+'_line'+i).css('background-color','#0000');
	}
	await sleep(timer[line_timers[code][line]]);
}

async function highlight_lines(ds, low, high, code){
	for(let i = low; i <=high; i++)
		await highlight_line(ds, i, code);
}

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function moveElementTo(element, x, y){
	element.transition()
			.attr('transform', `translate(${x}, ${y})`)
			.duration(timer['medium']);
}

function showElement(element, type, color){
	element.select(type)
		.transition()
			.attr('stroke', color)
			.duration(timer['slow']);
}

function getExistingElement(id, x, y){
	return d3.select(`#${id} [transform='translate(${x}, ${y})']`);
	//return d3.select(`[transform='translate(${x}, ${y})']`);
}

function remove(element){
	element
		.transition()
			.remove()
			.duration(timer['slow']);
}

window.onscroll = function() {
	if ($(window).scrollTop() > 60)
		$('#scroll').css('display', 'none');
	else
		$('#scroll').css('display', 'block');
}

function makeLine(tree, x1, y1, x2, y2){
	(tree.svg).insert("line",":first-child")
		.attr('stroke', '#EFF0F3')
		.attr('stroke-width', circleStroke)
		.attr('x1', x1)
		.attr('x2', x2)
		.attr('y1', y1)
		.attr('y2', y2);
	return;
}

function removeLine(tree, x, y){
	(tree.svg).select("[x2='"+x+"']"+"[y2='"+y+"']")
		.attr('stroke', 'red')
		.transition()
			.remove()
			.duration(timer['slow']);
	return;
}

function getTraverser(tree){
	const traverserG = (tree.svg).append('g');
	traverserG.append('circle')
			.attr('fill', 'none')
			.attr('r', circleRadius+circleStroke)
			.attr('stroke', 'green')
			.attr('stroke-width', circleStroke * 3);
	return traverserG;
}

function getNode(tree, data){
	const nodeG = (tree.svg).append('g')
		.attr('transform',`translate(${circleRadius+centerOffset}, ${circleRadius+centerOffset})`);
	nodeG.append('circle')
			.attr('fill', '#EFF0F3')
			.attr('r', circleRadius)
			.attr('stroke', 'green')
			.attr('stroke-width', circleStroke);
	nodeG.append('text')
		.attr('y', circleRadius / 4)
		.append('tspan')
			.attr('text-anchor','middle')
			.text(data);
	return nodeG;
}