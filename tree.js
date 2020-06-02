width = 650;
height = 420;
MAX = 10;

MAX_LVLS = 5
circleRadius = width * 0.025;
centerOffset = width * 0.02;
xOffset = 4*MAX_LVLS;
yOffset = 0.1 * width;
circleStroke = 0.005 * width;
root_rad = {x: width/2, y: yOffset};

tree_code_urls = {
	'create_tree': baseUrl+'/snippets/tree/create', 
	'insert_tree': baseUrl+'/snippets/tree/insert',
	'delete_tree': baseUrl+'/snippets/tree/delete',
	'preorder': baseUrl+'/snippets/tree/preorder', 
	'inorder': baseUrl+'/snippets/tree/inorder',
	'postorder': baseUrl+'/snippets/tree/postorder',
	'levelorder': baseUrl+'/snippets/tree/levelorder'
}

tree_codes = ['none', 'create_tree', 'insert_tree', 'delete_tree', 'inorder', 'preorder', 'postorder', 'levelorder'];

prepare_code('tree', tree_code_urls);
show_code(tree_codes, 'none');

class TreeNode{
	constructor(data){
		this.data = data;
		this.right = null;
		this.left = null;
	}
}

class Tree{
	constructor(data){
		$('.visualizer').append(`<svg id="bst_${data}" viewBox = "0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" overflow="visible"></svg>`);
		var control_string = 
			`<div id= "bst_control_${data}"><h5>Tree ${data+1}</h5>
			<div class="row">
				<button class="btn">Tree Operation 1: </button>
				<input class="form-control row-holder" type="number" id="ins_val_${data}">
				<button class="btn btn-primary row-holder" onclick="insert_handler(${data})">Insert</button>
			</div>
			<div class="row">
				<button class="btn">Tree Operation 2: </button>
				<input class="form-control row-holder" type="number" id="del_val_${data}">
				<button class="btn btn-primary row-holder" onclick="delete_handler(${data})">Delete</button>
			</div></div>`
		var traversal_string = 
			`<h5>Tree ${data+1}</h5>
			<div class="row">
				<button class="btn btn-primary" style="margin: 10px;" onclick="preorder_handler(${data})">Pre-Order</button>
				<button class="btn btn-primary" style="margin: 10px;" onclick="inorder_handler(${data})">In-Order</button>
				<button class="btn btn-primary" style="margin: 10px;" onclick="postorder_handler(${data})">Post-Order</button>
				<button class="btn btn-primary" style="margin: 10px;" onclick="levelorder_handler(${data})">Level-Order</button>
			</div>`
		$('#operations').append(control_string);
		$('#traversals').append(traversal_string);
		$('#operations .alert').remove();
		$('#traversals .alert').remove();
		this.svg = d3.select(`#bst_${data}`);
		this.control = $(`#bst_control_${data}`);
		this.holder = trees;
		this.id = data;
		this.root = null;
	}
}

function prepareSVGTree(tree){
	$(`bst_${tree.id}`).empty();
	marker = (tree.svg).append('defs').append('marker')
		.attr('id', 'arrow')
		.attr('markerWidth', '5')
		.attr('markerHeight','3.5')
		.attr('refX', 1)
		.attr('refY', 2)
		.attr('fill', '#3F51B5')
		.attr('orient', 'auto');
	marker.append('polygon')
		.attr('points', '0 0, 5 1.75, 0 3.5');
	(tree.svg).append('line')
		.attr('x1', width / 4)
		.attr('x2', width / 2 - 2*circleRadius)
		.attr('y1', yOffset / 2)
		.attr('y2', yOffset)
		.attr('stroke', '#3F51B5')
		.attr('marker-end', 'url(#arrow)')
		.attr('stroke-width', circleStroke);
	(tree.svg).append('text')
		.attr('x', width / 4)
		.attr('y', yOffset / 3)
		.text('root')
}

async function createBST(arr, show){
	if(!(arr instanceof Array))
		throw new Error("InvalidArgumentFoundError: argument 'arr' needs to be a valid Array");
	else if(arr == undefined)
		throw new Error("ArgumentNotFoundError: expected argument 'arr' not found");
	else if(show == undefined)
		show = 'none';
	else if(typeof(show) !== "string")
		throw new Error("InvalidArgumentFoundError: argument 'show' needs to be a valid string");
	show_code(tree_codes, 'create_tree');

	let tree = new Tree(trees.length);
	prepareSVGTree(tree);
	traverser = getTraverser(tree);
	$('button').prop('disabled', true);
	$(window).scrollTop(0);
	show_code(tree_codes, 'create_tree');

	$('.visualizer .alert').remove();
	show_code(tree_codes, 'create_tree');
	await highlight_lines('tree', 1, 4, 'create_tree'); 

	for(i = 0; i < arr.length; i++){
		show_code(tree_codes, 'create_tree');
		await highlight_lines('tree', 5, 6, 'create_tree');
		tree.root = await addNode(tree, tree.root, arr[i], 0, 0, root_rad.x, root_rad.y, 1);
	}

	show_code(tree_codes, 'create_tree');
	await highlight_lines('tree', 7, 8, 'create_tree');
	$('button').prop('disabled', false);
	show_code(tree_codes, 'none');
	traverser.remove();
	traverser = null;
	show_code(tree_codes, 'none');
	trees.push(tree);
	return tree;
}

async function insertBST(tree, data){
	if(!(tree instanceof Tree))
		throw new Error("InvalidArgumentFoundError: argument 'tree' needs to be a valid queue created using 'CreateBST' method");
	else if(tree == undefined)
		throw new Error("ArgumentNotFoundError: argument 'tree' cannot be undefined. Please pass a valid tree created using 'CreateTree' method");
	else if(data == undefined)
		throw new Error("ArgumentNotFoundError: expected argument 'data' not found");
	$('button').prop('disabled', true);
	traverser = getTraverser(tree);
	$(window).scrollTop(0);
	tree.root = await addNode(tree, tree.root, data, 0, 0, root_rad.x, root_rad.y, 1);
	traverser.remove();
	traverser = null;
	show_code(tree_codes, 'none');
	$('button').prop('disabled', false);
	return tree.root;
}

async function addNode(tree, root, data, prev_x, prev_y, x, y, level){
	moveElementTo(traverser, x, y);
	show_code(tree_codes, 'insert_tree');
	await highlight_lines('tree', 1, 2, 'insert_tree');
	if(root == null){
		await highlight_lines('tree', 3, 6, 'insert_tree');
		let newNode = new TreeNode(data);
		node = getNode(tree, data);
		moveElementTo(node, x, y);
		showElement(node, 'circle', '#3F51B5');
		
		await highlight_line('tree', 7, 'insert_tree');
		if(prev_x != 0 && prev_y != 0)
			makeLine(tree, prev_x, prev_y, x, y);
		return newNode;
	}
	else if(data > root.data){
		await highlight_lines('tree', 8, 9, 'insert_tree');
		root.right = await addNode(tree, root.right, data, x, y, x+(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1);
	}
	else if(data <= root.data){
		await highlight_lines('tree', 10, 11, 'insert_tree');
		root.left = await addNode(tree, root.left, data, x, y, x-(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1);
	}
	moveElementTo(traverser, x, y);
	await highlight_line('tree', 12, 'insert_tree');
	return root;
}

function repair(tree, root, node, data, prev_x, prev_y, x, y, level){
	if(root == null){
		let newNode = new TreeNode(data);
		moveElementTo(node, x, y);
		if(prev_x != 0 && prev_y != 0)
			makeLine(tree, prev_x, prev_y, x, y);
		return newNode;
	}
	else if(data > root.data)
		root.right = repair(tree, root.right, node, data, x, y, x+(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1);
	else
		root.left = repair(tree, root.left, node, data, x, y, x-(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1);
	return root;
}


async function deleteBST(tree, data){
	if(!(tree instanceof Tree))
		throw new Error("InvalidArgumentFoundError: argument 'tree' needs to be a valid queue created using 'CreateBST' method");
	else if(tree == undefined)
		throw new Error("ArgumentNotFoundError: argument 'tree' cannot be undefined. Please pass a valid tree created using 'CreateBST' method");
	else if(data == undefined)
		throw new Error("ArgumentNotFoundError: expected argument 'data' not found");
	$('button').prop('disabled', true);
	traverser = getTraverser(tree);
	$(window).scrollTop(0);
	tree.root = await deleteNode(tree, tree.root, data, root_rad.x, root_rad.y, 1);
	traverser.remove();
	traverser = null;
	$('button').prop('disabled', false);
	return tree.root;
}

async function deleteNode(tree, root, data, x, y, level){
	moveElementTo(traverser, x, y);
	showElement(traverser, 'circle', '#3F51B5');

	show_code(tree_codes, 'delete_tree');
	await highlight_lines('tree', 1, 2, 'delete_tree');

	if(root == null){
		await highlight_lines('tree', 3, 4, 'delete_tree');
		throwError('.visualizer', 'Node Not Found', 'danger');
		return root;
	}
	else if(data > root.data){
		await highlight_lines('tree', 5, 6, 'delete_tree');
		root.right = await deleteNode(tree, root.right, data, x+(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1);
	}
	else if(data < root.data){
		await highlight_lines('tree', 7, 8, 'delete_tree');
		root.left = await deleteNode(tree, root.left, data, x-(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1);
	}
	else{
		await highlight_lines('tree', 9, 10, 'delete_tree');
		curr_node = getExistingElement(`bst_${tree.id}`, x, y);

		showElement(curr_node, 'circle', 'red');
		showElement(traverser, 'circle', 'red');

		if(root.left == null){
			await highlight_lines('tree', 11, 12, 'delete_tree');
			$('.data').empty();
			throwError('.data', 'last removed node: '+curr_node.select('text').text(), 'warning');
			remove(curr_node);
			right_node = getExistingElement(`bst_${tree.id}`,x+(circleRadius*(xOffset/(1<<level))), y+yOffset);
			if(right_node._groups[0][0]){
				moveElementTo(right_node, x, y);
				removeLine(tree, x+(circleRadius*(xOffset/(1<<level))), y+yOffset);
			}
			else
				removeLine(tree, x, y);

			setTimeout(()=>{
				if(root.right != null){
					let temp = new TreeNode(root.right.data);
					(tree.svg).selectAll("g").each(function(d){
						let a = d3.select(this);
						let val = a.attr('transform');
						var num_pattern =  /[+-]?[0-9]+(\.[0-9]+)?/g;
						var result = val.match(num_pattern).map(x => parseFloat(x));
						if(((root_rad.x <= x && result[0] >= root_rad.x) || (root_rad.x >= x && result[0] <= root_rad.x)) && result[1] > y){
							line = d3.select("[x2='"+result[0]+"']"+"[y2='"+result[1]+"']");
							line.remove();
							repair(tree, temp, a, parseFloat(a.select('text').text()), 0, 0, x, y, level);
						}
					});
				}
			}, 3000);
			await highlight_line('tree', 13, 'delete_tree');
			show_code(tree_codes, 'none');
			return root.right;
		}
		else if(root.right == null){
			await highlight_line('tree', 14, 'delete_tree');
			remove(curr_node);
			$('.data').empty();
			await highlight_lines('tree', 15, 16, 'delete_tree');
			throwError('.data', 'last removed node: '+curr_node.select('text').text(), 'warning');
			left_node = getExistingElement(`bst_${tree.id}`, x-(circleRadius*(xOffset/(1<<level))), y+yOffset);
			if(left_node._groups[0][0]){
				moveElementTo(left_node, x, y);
				removeLine(tree, x-(circleRadius*(xOffset/(1<<level))), y+yOffset);
			}
			else
				removeLine(tree, x, y);
			
			setTimeout(()=>{
				if(root.left != null){
					let temp = new TreeNode(root.left.data);
					(tree.svg).selectAll("g").each(function(d){
						let a = d3.select(this);
						let val = a.attr('transform');
						var num_pattern =  /[+-]?[0-9]+(\.[0-9]+)?/g;
						var result = val.match(num_pattern).map(x => parseFloat(x));
						if(((root_rad.x >= x && result[0] <= root_rad.x) || (root_rad.x <= x && result[0] >= root_rad.x)) && result[1] > y){
							line = d3.select("[x2='"+result[0]+"']"+"[y2='"+result[1]+"']");
							line.remove();
							repair(tree, temp, a, parseFloat(a.select('text').text()), 0, 0, x, y, level);
						}
					});
				}
			}, 3000);

			await highlight_line('tree', 17, 'delete_tree');
			show_code(tree_codes, 'none');
			return root.left;
		}
		else{
			await highlight_line('tree', 18, 'delete_tree');
			let temp = root.right;
			temp_x = x+(circleRadius*(xOffset/(1<<level)));
			temp_y = y+yOffset;
			temp_level = level+1;
			await highlight_line('tree', 19, 'delete_tree');
			let temp_traverser = getTraverser(tree);;
			moveElementTo(temp_traverser, temp_x, temp_y);
			await highlight_line('tree', 20, 'delete_tree');
			while(temp != null && temp.left != null){
				await highlight_line('tree', 21, 'delete_tree');
				temp_x -= (circleRadius*(xOffset/(1<<temp_level)));
				temp_y += yOffset;
				moveElementTo(temp_traverser, temp_x, temp_y);
				temp_level += 1;
				temp = temp.left;
				await highlight_line('tree', 20, 'delete_tree');
			}
			temp_traverser.remove();
			await highlight_line('tree', 22, 'delete_tree');
			temp_node = getExistingElement(`bst_${tree.id}`, temp_x, temp_y);
			moveElementTo(curr_node, temp_x, temp_y);
			moveElementTo(temp_node, x, y)	
			root.data = temp.data;
			await highlight_line('tree', 23, 'delete_tree');
			root.right = await deleteNode(tree, root.right, temp.data, x+(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1);
			
		}
	}
	moveElementTo(traverser, x, y);
	await highlight_line('tree', 24, 'delete_tree');
	show_code(tree_codes, 'none');
	return root;
}

async function inorder(tree){
	$('button').prop('disabled', true);
	traverser = getTraverser(tree);
	showElement(traverser, 'circle', '#3F51B5');
	$(window).scrollTop(0);
	let temp = new TreeNode('#');

	var stack = await createStack([temp], 'data');

	$('#output').empty();
	$('#output').append('<div class="alert alert-info">Inorder: </div>');
	await inorder_tree(tree, tree.root, root_rad.x, root_rad.y, 1, stack);
	traverser.remove();
	deleteDS(stack);
	traverser = null;
	$('button').prop('disabled', false);
	return null;
}

async function inorder_tree(tree, root, x, y, level, stack){
	moveElementTo(traverser, x, y);
	show_code(tree_codes, 'inorder');
	await highlight_line('tree', 1, 'inorder');
	if(root == null){
		await highlight_line('tree', 2, 'inorder');
		return;
	}
	await highlight_line('tree', 3, 'inorder');
	
	showElement(traverser, 'circle', '#3F51B5');
	
	await push(stack, root);
	show_code(tree_codes, 'inorder');


	await inorder_tree(tree, root.left, x-(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1, stack);
	let val = await pop(stack);
	show_code(tree_codes, 'inorder');

	moveElementTo(traverser, x, y);

	$('#output .alert').append(root.data+' ');
	await highlight_line('tree', 4, 'inorder');
	
	await highlight_line('tree', 5, 'inorder');
	showElement(traverser, 'circle', '#3F51B5');

	await push(stack, root);
	show_code(tree_codes, 'inorder');
	await inorder_tree(tree, root.right, x+(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1, stack);
	
	val = await pop(stack);
	show_code(tree_codes, 'inorder');

	moveElementTo(traverser, x, y);
}

async function preorder(tree){
	$('button').prop('disabled', true);
	traverser = getTraverser(tree);
	showElement(traverser, 'circle', '#3F51B5');
	$(window).scrollTop(0);
	let temp = new TreeNode('#');
	var stack = await createStack([temp], 'data');
	$('#output').empty();
	$('#output').append('<div class="alert alert-info">Preorder: </div>');
	await preorder_tree(tree, tree.root, root_rad.x, root_rad.y, 1, stack);
	traverser.remove();
	deleteDS(stack);
	traverser = null;
	$('button').prop('disabled', false);
	return null;
}

async function preorder_tree(tree, root, x, y, level, stack){
	moveElementTo(traverser, x, y);
	show_code(tree_codes, 'preorder');

	await highlight_line('tree', 1, 'preorder');
	if(root == null){
		await highlight_line('tree', 2,'preorder');
		return;
	}
	
	showElement(traverser, 'circle', 'green');
	moveElementTo(traverser, x, y);
	$('#output .alert').append(root.data+' ')
	await highlight_lines('tree', 3, 4,'preorder');
	showElement(traverser, 'circle', '#3F51B5');

	await push(stack, root);
	show_code(tree_codes, 'preorder');

	await preorder_tree(tree, root.left, x-(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1, stack);
	let val = await pop(stack);
	show_code(tree_codes, 'preorder');

	moveElementTo(traverser, x, y);
	
	await highlight_line('tree', 5, 'preorder');
	showElement(traverser, 'circle', '#3F51B5');
	await push(stack, root);
	show_code(tree_codes, 'preorder');

	await preorder_tree(tree, root.right, x+(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1, stack);
	val = await pop(stack);
	show_code(tree_codes, 'preorder');

	moveElementTo(traverser, x, y);
	show_code(tree_codes, 'none');
}

async function postorder(tree){
	$('button').prop('disabled', true);
	traverser = getTraverser(tree);
	showElement(traverser, 'circle', '#3F51B5');
	$(window).scrollTop(0);
	let temp = new TreeNode('#');
	var stack = await createStack([temp], 'data');
	$('#output').empty();
	$('#output').append('<div class="alert alert-info">Postorder: </div>');
	await postorder_tree(tree, tree.root, root_rad.x, root_rad.y, 1, stack);
	traverser.remove();
	deleteDS(stack);
	traverser = null;
	$('button').prop('disabled', false);
	show_code(tree_codes, 'none');
	return null;
}

async function postorder_tree(tree, root, x, y, level, stack){
	moveElementTo(traverser, x, y);
	show_code(tree_codes, 'postorder');

	await highlight_line('tree', 1, 'postorder');
	if(root == null){
		await highlight_line('tree', 2, 'postorder');
		return;
	}
	
	await highlight_line('tree', 3, 'postorder');
	showElement(traverser, 'circle', '#3F51B5');
	moveElementTo(traverser, x, y);

	await push(stack, root);
	show_code(tree_codes, 'postorder');

	await postorder_tree(tree, root.left, x-(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1, stack);
	let val = await pop(stack);
	show_code(tree_codes, 'postorder');

	moveElementTo(traverser, x, y);
	
	await highlight_line('tree', 4, 'postorder');
	moveElementTo(traverser, x, y);
	showElement(traverser, 'circle', '#3F51B5');

	await push(stack, root);
	show_code(tree_codes, 'postorder');

	await postorder_tree(tree, root.right, x+(circleRadius*(xOffset/(1<<level))), y+yOffset, level+1, stack);
	val = await pop(stack);
	show_code(tree_codes, 'postorder');

	moveElementTo(traverser, x, y);

	showElement(traverser, 'circle', 'green');
	moveElementTo(traverser, x, y);
	$('#output .alert').append(root.data+' ')
	await highlight_line('tree', 5, 'postorder');
	show_code(tree_codes, 'none');
}

async function levelorder(tree){
	$('button').prop('disabled', true);
	traverser = getTraverser(tree);
	showElement(traverser, 'circle', '#3F51B5');
	$(window).scrollTop(0);
	$('#output').empty();
	await levelorder_tree(tree.root);
	traverser.remove();
	traverser = null;
	$('button').prop('disabled', false);
	show_code(tree_codes, 'none');
	return null;
}

async function levelorder_tree(root){
	show_code(tree_codes, 'levelorder')

	await highlight_line('tree', 1, 'levelorder');
	if(root == null){
		await highlight_line('tree', 2, 'levelorder');
		return;
	}
	let x = root_rad.x;
	let y = root_rad.y;
	moveElementTo(traverser, x, y);

	await highlight_line('tree', 3, 'levelorder');
	let queue = await createQueue([root], 'data');
	$('#output').append('<div class="alert alert-info">Levelorder: </div>');

	show_code(tree_codes, 'levelorder');

	await highlight_line('tree', 4, 'levelorder');
	while(queue.arr.length > 0){
		await highlight_line('tree', 5, 'levelorder');
		val = await dequeue(queue);
		show_code(tree_codes, 'levelorder')

		await highlight_line('tree', 6, 'levelorder');
		if(val.left != null){
			await highlight_line('tree', 7, 'levelorder');
			await enqueue(queue, val.left);
			show_code(tree_codes, 'levelorder')

		}
		await highlight_line('tree', 8, 'levelorder');
		if(val.right != null){
			highlight_line('tree', 9, 'levelorder');
			await enqueue(queue, val.right);
			show_code(tree_codes, 'levelorder')

		}
		$('#output .alert').append(val.data+' ')
		await highlight_line('tree', 10, 'levelorder');
		await highlight_line('tree', 4, 'levelorder');
	}
	deleteDS(queue);
}