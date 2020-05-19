width = 650;
height = 420;
MAX = 6;
max = 6;

elementWidth = width * 0.1;
centerOffset = width * 0.02;
yOffset = 0.1 * width;
elementStroke = 0.005 * width;
top_rad_q = {x: yOffset, y: height/2};

var queues = [];
const queues_limit = 1;

q_code_urls = {
	'create_queue': baseUrl+'/snippets/queue/create.c', 
	'enqueue':  baseUrl+'/snippets/queue/enqueue.c',
	'dequeue':  baseUrl+'/snippets/queue/dequeue.c'
}

q_codes = ['none', 'create_queue', 'enqueue', 'dequeue'];

prepare_code('q', q_code_urls);
show_code(q_codes, 'none');

class Queue{
	constructor(data){
		$('.visualizer').append(`<svg id="q_${data}" width="650" height="300"></svg>`);
		var control_string = 
			`<div id="q_control_${data}"><h5>Queue ${data+1}</h5>
			<div class="row">
				<button class="btn">Queue Operation 1: </button>
				<input class="form-control row-holder" type="number" id="ins_val_${data}">
				<button class="btn btn-primary row-holder" onclick="enq_handler(${data})">Enqueue</button>
			</div>
			<div class="row">
				<button class="btn">Queue Operation 2: </button>
				<button class="btn btn-primary row-holder" onclick="deq_handler(${data})">Dequeue</button>
			</div></div>`
		$('#operations .alert').remove();
		$('#operations').append(control_string);
		this.svg = d3.select(`#q_${data}`);
		this.id = data;
		this.q_front = -1;
		this.q_rear = -1
		this.rear_pointer = null;
		this.front_pointer = null;
		this.arr = []
		this.show = 'none';
	}
}

function getQElement(queue, data){
	const nodeG = (queue.svg).append('g')
		.attr('transform',`translate(${elementWidth*0.3+centerOffset}, ${elementWidth*0.3+centerOffset})`);
	nodeG.append('rect')
			.attr('fill', '#EFF0F3')
			.attr('width', elementWidth)
			.attr('height', elementWidth *0.6)
			.attr('stroke', 'green')
			.style('stroke-dasharray', `${elementWidth*2.6}, ${elementWidth*0.6}`)//width + height
			.attr('stroke-width', elementStroke);
	nodeG.append('text')
		.attr('y', elementWidth*0.3)
		.attr('x', elementWidth / 2)
		.append('tspan')
			.attr('text-anchor','middle')
			.text(data);
	return nodeG;
}

function prepareSVGQ(queue){
	$(`#q_${queue.id}`).empty();
	marker = (queue.svg).append('defs').append('marker')
		.attr('id', 'arrow')
		.attr('markerWidth', '5')
		.attr('markerHeight','3.5')
		.attr('refX', 1)
		.attr('refY', 2)
		.attr('fill', '#3F51B5')
		.attr('orient', 'auto');
	marker.append('polygon')
		.attr('points', '0 0, 5 1.75, 0 3.5');
	lineG1 = (queue.svg).append('g')
	lineG1.append('line')
		.attr('x1', -width/4)
		.attr('x2', -elementWidth * 0.3)
		.attr('y1', elementWidth*0.3)
		.attr('y2', 0)
		.attr('stroke', '#3F51B5')
		.attr('marker-end', 'url(#arrow)')
		.style('transform', 'rotate(90deg)')
		.attr('stroke-width', elementStroke);
	lineG1.append('text')
		.attr('x', -width/8)
		.attr('y', elementWidth * 0.4)
		.style('transform', 'rotate(90deg)')
		.text('front');

	lineG2 = (queue.svg).append('g')
	lineG2.append('line')
		.attr('x1', -width/4)
		.attr('x2', -elementWidth * 0.3)
		.attr('y1', -elementWidth * 0.3)
		.attr('y2', 0)
		.attr('stroke', '#3F51B5')
		.attr('marker-end', 'url(#arrow)')
		.style('transform', 'rotate(90deg)')
		.attr('stroke-width', elementStroke);
	lineG2.append('text')
		.attr('x', -width/8)
		.attr('y', -elementWidth * 0.2)
		.style('transform', 'rotate(90deg)')
		.text('rear')

	return [lineG1, lineG2];
}

function prepareVisualiserQ(queue){
	$('.visualizer .alert').remove();
	pointers = prepareSVGQ(queue);
	queue.front_pointer = pointers[0];
	queue.rear_pointer = pointers[1];
	text = (queue.svg).append('g').
		append('text')
			.attr('x', 0)
			.attr('y', elementWidth * 0.4)
			.text('-1');
	let y = queue.q_rear * (elementWidth);
	moveElementTo(text, top_rad_q.x + y + elementWidth*0.5, top_rad_q.y);
	moveElementTo(queue.rear_pointer, top_rad_q.x + y + elementWidth*0.5, top_rad_q.y);
	moveElementTo(queue.front_pointer, top_rad_q.x + y + elementWidth*0.5, top_rad_q.y);
}

async function create_handler(){
	if(queues.length == queues_limit)
		throwError('.visualizer', 'Queue creation limit reached', 'danger');
	else{
		let arr = [];
		for(let i = 1; i <= num_inputs; i++){
			var text = $('#create_val_'+i).val();
			text = parseFloat(text);
			if(!isNaN(text))	
				arr.push(text);
		}
		if(arr.length > 0)
			await createQueue(arr, 'none');
		else
			throwError('.visualizer', 'Enter atleast one input', 'danger');
	}
}

function getDataQueue(queue){
	let rear_val = queue.arr[queue.q_rear];
	if(queue.show == 'none')
		return rear_val;
	return rear_val[queue.show];
}

async function createQueue(arr, show){
	if(!(arr instanceof Array))
		throw new Error("InvalidArgumentFoundError: argument 'arr' needs to be a valid Array");
	else if(arr == undefined)
		throw new Error("ArgumentNotFoundError: expected argument 'arr' not found");
	else if(typeof(show) !== "string")
		throw new Error("InvalidArgumentFoundError: argument 'show' needs to be a valid string");
	else if(show == undefined)
		show = 'none';
	show_code(q_codes, 'create_queue');
	let queue = await create_Queue(arr, show);
	queues.push(queue);
	show_code(q_codes, 'none');
	return queue;
}

async function create_Queue(arr, show){
	$('button').prop('disabled', true);
	$(window).scrollTop(0);
	let queue = new Queue(queues.length);
	queue.show = show;
	queue.front = -1;
	queue.rear = -1;
	$('button').prop('disabled', true);
	prepareVisualiserQ(queue);
	await highlight_lines('q', 1, 6, 'create_queue');

	for(let i = 0; i < arr.length; i++){
		await highlight_line('q', 7, 'create_queue');
		await highlight_line('q', 8, 'create_queue');

		await enqueue(queue, arr[i]);
		show_code(q_codes, 'create_queue');
	}
	await highlight_lines('q', 9, 10, 'create_queue');

	$('button').prop('disabled', false);
	return queue;
}

async function enq_handler(i){
	if(queues.length > 0){
		let data = parseFloat($('#ins_val_'+i).val());
		if(!isNaN(data))
			await enqueue(queues[i], data);
		else
			throwError('.code-viewer', 'Enter some Input', 'danger');
	}
	else
		throwError('.visualizer', 'Create a queue first!', 'danger');
}

async function enqueue(queue, data){
	if(!(queue instanceof Queue))
		throw new Error("InvalidArgumentFoundError: argument 'queue' needs to be a valid queue created using 'CreateQueue' method");
	else if(queue == undefined)
		throw new Error("ArgumentNotFoundError: argument 'queue' cannot be undefined. Please pass a valid queue created using 'CreateQueue' method");
	else if(data == undefined)
		throw new Error("ArgumentNotFoundError: expected argument 'data' not found");
	show_code(q_codes, 'enqueue');
	$('button').prop('disabled', true);
	$(window).scrollTop(0);
	await highlight_line('q', 1, 'enqueue');
	if(queue.q_rear == MAX-1){
		throwError('.visualizer', 'Queue'+queue.id+'is full!', 'danger');
		await highlight_line('q', 2, 'enqueue');
	}
	else{
		await highlight_line('q', 3, 'enqueue');

		(queue.q_rear)++;
		let y = queue.q_rear * (elementWidth + elementStroke*0.5);
		moveElementTo(queue.rear_pointer, top_rad_q.x + y + (elementWidth*0.5), top_rad_q.y);
		await highlight_line('q', 4, 'enqueue');
		(queue.arr).push(data);
		element = getQElement(queue, getDataQueue(queue));
		moveElementTo(element, top_rad_q.x + y, top_rad_q.y);
		await highlight_line('q', 5, 'enqueue');
		
		showElement(element, 'rect', '#3F51B5');

	}

	await highlight_line('q', 6, 'enqueue');
	if(queue.q_rear == 0){
		let y = queue.q_rear * (elementWidth + elementStroke*0.5);
		queue.q_front = 0;
		moveElementTo(queue.front_pointer, top_rad_q.x + y + (elementWidth * 0.5), top_rad_q.y);
		await highlight_line('q', 7, 'enqueue');
	}
	await highlight_line('q', 8, 'enqueue');
	show_code(q_codes, 'none');
	$('button').prop('disabled', false);
	return null;
}

async function deq_handler(i){
	if(queues.length > 0)
		await dequeue(queues[i]);
	else
		throwError('.visualizer', 'Create a queue first!', 'danger');
}

async function dequeue(queue){
	if(!(queue instanceof Queue))
		throw new Error("InvalidArgumentFoundError: argument 'queue' needs to be a valid queue created using 'CreateQueue' method");
	else if(queue == undefined)
		throw new Error("ArgumentNotFoundError: 'queue' cannot be undefined. Please pass a valid queue created using 'CreateQueue' method");
	$('button').prop('disabled', true);
	$(window).scrollTop(0);
	show_code(q_codes, 'dequeue');
	await highlight_line('q', 1, 'dequeue');

	if(queue.q_front == -1){
		throwError('.visualizer', 'Queue'+queue.id+' is empty!', 'danger');
		await highlight_line('q', 2, 'dequeue');
	}
	else{
		await highlight_line('q', 3, 'dequeue');
		
		let y = queue.q_front * (elementWidth + elementStroke*0.5);
		element = getExistingElement(`q_${queue.id}`, top_rad_q.x + y, top_rad_q.y);
		showElement(element, 'rect', 'red');
		let val = (queue.arr).shift();
		await highlight_line('q', 4, 'dequeue');

		queue.q_front++;
		y = queue.q_front * (elementWidth + elementStroke*0.5);
		moveElementTo(queue.front_pointer, top_rad_q.x + y + (elementWidth * 0.5), top_rad_q.y);
		await highlight_line('q', 5, 'dequeue');

		await highlight_line('q', 6, 'dequeue');
		if(queue.q_front > queue.q_rear){
			queue.q_front = -1; 
			queue.q_rear = -1;
			let y = queue.q_rear * (elementWidth);
			moveElementTo(queue.rear_pointer, top_rad_q.x + y + elementWidth*0.5, top_rad_q.y);
			moveElementTo(queue.front_pointer, top_rad_q.x + y + elementWidth*0.5, top_rad_q.y);
			await highlight_lines('q', 7, 8, 'dequeue');
		}

		remove(element);
		$('.data').empty();
		throwError('.data', 'Last deleted element from queue '+queue.id+': '+val, 'warning');
		await highlight_line('q', 9, 'dequeue');
		$('button').prop('disabled', false);
		show_code(q_codes, 'none');
		return val;
	}
	await highlight_line('q', 10, 'dequeue');
	$('button').prop('disabled', false);
	show_code(q_codes, 'none');

}

function deleteQueue(queue){
	queue.svg.remove();
	$('#q_control_'+queue.id).remove();
	queues.splice(queue.id, 1);
}