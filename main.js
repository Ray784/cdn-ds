var width, height, yOffset, xOffset, elementWidth, elementStroke, top_rad;
var baseUrl = "https://major-app.herokuapp.com";//"http://localhost:4200";
var num_inputs = 1, speed_ids = ['#speed_0_5x', '#speed_0_5x','#speed_1x','#speed_2x', '#speed_3x', '#speed_10x', '#speed_x'];

const speed_0_1x = {
	'very_fast': 1000,
	'fast': 3000,
	'medium': 3000,
	'slow': 3000,
	'very_slow': 3000
};

const speed_0_5x = {
	'very_fast': 1000,
	'fast': 1500,
	'medium': 2000,
	'slow': 2500,
	'very_slow': 3000
};

const speed_1x = {
	'very_fast': 500,
	'fast': 1000,
	'medium': 1500,
	'slow': 2000,
	'very_slow': 2500
};

const speed_2x = {
	'very_fast': 200,
	'fast': 500,
	'medium': 1000,
	'slow': 1500,
	'very_slow': 2000
};

const speed_3x = {
	'very_fast': 100,
	'fast': 300,
	'medium': 500,
	'slow': 1000,
	'very_slow': 1500
};

const speed_10x = {
	'very_fast': 100,
	'fast': 100,
	'medium': 100,
	'slow': 100,
	'very_slow': 100
};

const speed_x = {
	'very_fast': 0,
	'fast': 0,
	'medium': 0,
	'slow': 0,
	'very_slow': 0
};

function setSpeed(speed, curr){
	timer = speed;
	for(var i = 0;i < speed_ids.length; i++)
		$(speed_ids[i]).removeClass("disabled");
	curr.addClass("disabled");
}

$('.disabled').click(function(e){
	e.preventDefault();
});

var stacks=[], trees=[], queues = [], heaps = [];
var timer = speed_2x;
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
            else
    			allText = 'unavailable';
    }
    rawFile.send();
    return allText;
}

/*function readTextFile(url) {
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status); // Rejects the promise
        }
        return response.text().then(function (text) {
		   return text;
		});
    });
}*/

async function prepare_code(ds, codes){
	for(var code_url in codes){
		let divB = `<div id="${code_url}" style="display: none;">`;
		let tabH = `<div class="tab-holder">
						<ul class="nav nav-tabs" id="myTab" role="tablist">
							<li class="nav-item">
								<a class="nav-link active" id="c-tab" data-toggle="tab" href="#${code_url}-tab-c" role="tab" aria-controls="c-cpp" aria-selected="true">C / C++</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" id="java-tab" data-toggle="tab" href="#${code_url}-tab-java" role="tab" aria-controls="java" aria-selected="false">Java</a>
							</li>
							<li class="nav-item">
								<a class="nav-link" id="python-tab" data-toggle="tab" href="#${code_url}-tab-py" role="tab" aria-controls="python" aria-selected="false">Python</a>
							</li>
						</ul>
					</div>`;
		let tabC = `<div class="tab-content" id="${code_url}-content">`
		let preB = `<pre id="${code_url}-c" class="prettyprint lang-c">`;
		let spanB = `<span class="` 
		let spanI = `">`;
		let spanE = `</span><br>`;
		let preE = `</pre>`;
		let divE = `</div>`;
		let line = 0;
		if(codes.hasOwnProperty(code_url)){
			codeS = await readTextFile(codes[code_url]+".c")
			code = codeS.split(/\r?\n/);
			//preparing line timers
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
			$('.code-viewer').append(divB)
			$('#'+code_url).append(tabH);
			$('#'+code_url).append(tabC);

			//c-tab
			$('#'+code_url+'-content').append(`<div class="tab-pane fade show active" id="${code_url}-tab-c" role="tabpanel" aria-labelledby="c-tab">`);
			$('#'+code_url+'-tab-c').append(preB);
			for(let i = 7; i < code.length; i++){
				if(code[i].trim() == '}'){
					$('#'+code_url+'-c').append(spanB+ds+"_line0"+spanI+"\t"+code[i]+spanE);
				}else if(code[i].trim() == ''){
					line++;
				}else{
					$('#'+code_url+'-c').append(spanB+ds+"_line"+line+spanI+"\t"+code[i]+spanE);
					line++;
				}
			}
			$('#'+code_url+'-tab-c').append(preE);
			$('#'+code_url+'-content').append(divE);

			//java tab
			line = 0;
			$('#'+code_url+'-content').append(`<div class="tab-pane fade" id="${code_url}-tab-java" role="tabpanel" aria-labelledby="java-tab">`);
			preB = `<pre id="${code_url}-java" class="prettyprint lang-java">`;
			$('#'+code_url+'-tab-java').append(preB);
			codeS = await readTextFile(codes[code_url]+".java");
			code = codeS.split(/\r?\n/);
			for(let i = 0; i < code.length; i++){
				if(code[i].trim() == '}'){
					$('#'+code_url+'-java').append(spanB+ds+"_line0"+spanI+"\t"+code[i]+spanE);
				}else if(code[i].trim() == ''){
					line++;
				}else{
					$('#'+code_url+'-java').append(spanB+ds+"_line"+line+spanI+"\t"+code[i]+spanE);
					line++;
				}
			}
			$('#'+code_url+'-tab-java').append(preE);
			$('#'+code_url+'-content').append(divE);


			//py-tab
			line = 0;
			$('#'+code_url+'-content').append(`<div class="tab-pane fade" id="${code_url}-tab-py" role="tabpanel" aria-labelledby="py-tab">`);
			preB = `<pre id="${code_url}-py" class="prettyprint lang-py">`;
			$('#'+code_url+'-tab-py').append(preB);
				codeS = await readTextFile(codes[code_url]+".py");
				code = codeS.split(/\r?\n/);
				for(let i = 0; i < code.length; i++){
					if(code[i].trim() == '}'){
						$('#'+code_url+'-py').append(spanB+ds+"_line0"+spanI+"\t"+code[i]+spanE);
					}else if(code[i].trim() == ''){
						line++;
					}else{
						$('#'+code_url+'-py').append(spanB+ds+"_line"+line+spanI+"\t"+code[i]+spanE);
						line++;
					}
				}
			
			$('#'+code_url+'-tab-py').append(preE);
			$('#'+code_url+'-content').append(divE);


			$('.code-viewer').append(divE);
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
			.duration(10000);
}

function roundTo2(num){
	return Math.round(num*100) / 100;
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

function deleteDS(ds){
	ds.svg.remove();
	ds.control.remove();
	ds.holder.splice(ds.id, 1);
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

async function highlight_line(ds, line, code){
	for(let i = 1; i <= num_lines[code]; i++){
		if(i == line)
			$('.'+ds+'_line'+i).css('background-color','#0069D9'); 
		else
			$('.'+ds+'_line'+i).css('background-color','#0000');
	}
	await sleep(timer[line_timers[code][line]]);
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