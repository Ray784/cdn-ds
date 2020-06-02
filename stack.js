width = 650;
height = 420;
MAX = Infinity;
max = 6;

elementWidth = width * 0.1;
centerOffset = width * 0.02;
yOffset = 0.1 * width;
elementStroke = 0.005 * width;
top_rad_s = {x: width/2, y: yOffset};

stk_code_urls = {
	'create_stack': baseUrl+'/snippets/stack/create', 
	'push': baseUrl+'/snippets/stack/push',
	'pop': baseUrl+'/snippets/stack/pop'
}

stk_codes = ['none', 'create_stack', 'push', 'pop'];

prepare_code('stack', stk_code_urls);

show_code(stk_codes, 'none');

class Stack{
	constructor(data){
		$('.visualizer').append(`<svg id="stk_${data}" width="650" height="420"></svg>`);
		var control_string =
			`<div id="stk_control_${data}"><h5><u><font color="#155724">Stack ${data+1}</font></u></h5>
			<div class="row">
				<button class="btn">Stack Operation 1: </button>
				<input class="form-control row-holder" type="number" id="ins_val_${data}">
				<button class="btn btn-primary row-holder" onclick="push_handler(${data})">Push</button>
			</div>
			<div class="row">
				<button class="btn">Stack Operation 2: </button>
				<button class="btn btn-primary row-holder" onclick="pop_handler(${data})">Pop</button>
			</div></div>`
		$('#operations  .alert').remove();
		$('#operations').append(control_string);
		this.svg = d3.select(`#stk_${data}`);
		this.control = $(`#stk_control_${data}`);
		this.holder = stacks;
		this.id = data;
		this.traverser = null;
		this.stk_top = -1;
		this.top_pointer = null;
		this.arr = []
		this.show = 'none';
	}
}

function getDataStack(stack){
	let top_val = stack.arr[stack.stk_top];
	if(stack.show == 'none')
		return top_val;
	return top_val[stack.show];
}

function getStackElement(stack, data){
	const nodeG = (stack.svg).append('g')
		.attr('transform',`translate(${elementWidth*0.3+centerOffset}, ${elementWidth*0.3+centerOffset})`);
	nodeG.append('rect')
			.attr('fill', '#EFF0F3')
			.attr('width', elementWidth)
			.attr('height', elementWidth *0.6)
			.attr('stroke', 'green')
			.style('stroke-dasharray', `0, ${elementWidth}, ${elementWidth*1.2}`)
			.attr('stroke-width', elementStroke);
	nodeG.append('text')
		.attr('y', elementWidth*0.3)
		.attr('x', elementWidth / 2)
		.append('tspan')
			.attr('text-anchor','middle')
			.text(data);
	return nodeG;
}

function prepareSVGStack(stack){
	$(`stk_${stack.data}`).empty();
	marker = (stack.svg).append('defs').append('marker')
		.attr('id', 'arrow')
		.attr('markerWidth', '5')
		.attr('markerHeight','3.5')
		.attr('refX', 1)
		.attr('refY', 2)
		.attr('fill', '#3F51B5')
		.attr('orient', 'auto');
	marker.append('polygon')
		.attr('points', '0 0, 5 1.75, 0 3.5');
	lineG = (stack.svg).append('g')
	lineG.append('line')
		.attr('x1', -width/4)
		.attr('x2', -elementWidth * 0.3)
		.attr('y1', 0)
		.attr('y2', 0)
		.attr('stroke', '#3F51B5')
		.attr('marker-end', 'url(#arrow)')
		.attr('stroke-width', elementStroke);
	lineG.append('text')
		.attr('x', -width/4)
		.attr('y', elementWidth * 0.2)
		.text('top')
	return lineG;
}

function prepareVisualiserStack(stack){
	$('.visualizer .alert').remove();
	stack.top_pointer = prepareSVGStack(stack);
	text = (stack.svg).append('g').
		append('text')
			.attr('x', 0)
			.attr('y', elementWidth * 0.4)
			.text('-1');
	let y = (max + 1 - stack.stk_top) * elementWidth * 0.6;
	moveElementTo(text, top_rad_s.x, top_rad_s.y +  y);
	moveElementTo(stack.top_pointer, top_rad_s.x, top_rad_s.y + y + elementWidth * 0.3);
}

async function createStack(arr, show){
	if(!(arr instanceof Array))
		throw new Error("InvalidArgumentFoundError: argument 'arr' needs to be a valid Array");
	else if(arr == undefined)
		throw new Error("ArgumentNotFoundError: expected argument 'arr' not found");
	else if(show == undefined)
		show = 'none';
	else if(typeof(show) !== "string")
		throw new Error("InvalidArgumentFoundError: argument 'show' needs to be a valid string");
	show_code(stk_codes, 'create_stack');
	$('button').prop('disabled', true);
	$(window).scrollTop(0);
	let stack = new Stack(stacks.length);
	stack.show = show;
	stack.stk_top = -1;
	$('button').prop('disabled', true);
	prepareVisualiserStack(stack);
	await highlight_lines('stack', 1, 5, 'create_stack');

	for(let i = 0; i < arr.length; i++){
		await highlight_line('stack', 6, 'create_stack');
		await highlight_line('stack', 7, 'create_stack');

		await push(stack, arr[i]);
		show_code(stk_codes, 'create_stack');
	}
	await highlight_lines('stack', 8, 9, 'create_stack');
	
	$('button').prop('disabled', false);
	show_code(stk_codes, 'none');

	stacks.push(stack);
	return stack;
}

async function push(stack, data){
	if(!(stack instanceof Stack))
		throw new Error("InvalidArgumentFoundError: argument 'stack' needs to be a valid stack created using 'CreateStack' method");
	else if(stack == undefined)
		throw new Error("ArgumentNotFoundError: argument 'stack' cannot be undefined. Please pass a valid stack created using 'CreateStack' method");
	else if(data == undefined)
		throw new Error("ArgumentNotFoundError: expected argument 'data' not found");
	$('button').prop('disabled', true);
	show_code(stk_codes, 'push');
	$(window).scrollTop(0);
	await highlight_line('stack', 1, 'push');

	if(stack.stk_top == MAX-1){
		throwError('.visualizer', 'Stack'+stack.id+' is full!', 'danger');
		await highlight_line('stack',2, 'push');

	}
	else{
		await highlight_line('stack',3, 'push');
		
		(stack.stk_top)++;
		(stack.arr).push(data);

		let y = (max + 1 - stack.stk_top) * elementWidth * 0.6;
		moveElementTo(stack.top_pointer, top_rad_s.x, top_rad_s.y + y + elementWidth * 0.3);
		await highlight_line('stack', 4, 'push');
		
		element = getStackElement(stack, getDataStack(stack));
		moveElementTo(element, top_rad_s.x, top_rad_s.y +  y);
		await highlight_line('stack', 5, 'push');
		
		showElement(element, 'rect', '#3F51B5');
	}

	await highlight_line('stack', 6, 'push');
	show_code(stk_codes, 'none');
	$('button').prop('disabled', false);
}

async function pop(stack){
	if(!(stack instanceof Stack))
		throw new Error("InvalidArgumentFoundError: argument 'stack' needs to be a valid stack created using 'CreateStack' method");
	else if(stack == undefined)
		throw new Error("ArgumentNotFoundError: 'stack' cannot be undefined. Please pass a valid stack created using 'CreateStack' method");
	$('button').prop('disabled', true);
	show_code(stk_codes, 'pop');
	$(window).scrollTop(0);
	await highlight_line('stack', 1, 'pop');

	if(stack.stk_top == -1){
		throwError('.visualizer', 'Stack'+stack.id+' is empty!', 'danger');
		await highlight_line('stack', 2, 'pop');

	}
	else{
		await highlight_line('stack', 3, 'pop');
		
		let y = (max + 1 - stack.stk_top) * elementWidth * 0.6;
		element = getExistingElement(`stk_${stack.id}`, top_rad_s.x, top_rad_s.y + y);
		showElement(element, 'rect', 'red');
		val = (stack.arr).pop();
		await highlight_line('stack', 4, 'pop');

		stack.stk_top--;
		moveElementTo(stack.top_pointer, top_rad_s.x, top_rad_s.y + (y + elementWidth * 0.6) + elementWidth * 0.3);
		await highlight_line('stack', 5, 'pop');

		remove(element);
		$('.data').empty();
		throwError('.data', 'Last Popped element from stack-'+(stack.id+1)+': '+val, 'warning');
		await highlight_line('stack', 6, 'pop');
		show_code(stk_codes, 'none');
		$('button').prop('disabled', false);
		return val;
	}
	await highlight_line('stack', 7, 'pop');
	show_code(stk_codes, 'none');
	$('button').prop('disabled', false);
}

