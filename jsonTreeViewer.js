/*
 * JSON Tree Viewer
 * http://github.com/summerstyle/jsonTreeViewer
 *
 * Copyright 2014 Vera Lobacheva (summerstyle.ru)
 * Released under the GPL3 (GPL3.txt)
 *
 * Sun 27 2014 20:15:00 GMT+0400
 */

'use strict';

var jsonTreeViewer = (function() {
	/* Utilities */
	var utils = {
		id : function (str) {
			return document.getElementById(str);
		},
		hide : function(node) {
			node.style.display = 'none';
			
			return this;
		},
		show : function(node) {
			node.style.display = 'block';
			
			return this;
		},
		/* JSON data types */
		is_string : function(x) {
			return typeof x === 'string';
		},
		is_number : function(x) {
			return typeof x === 'number';
		},
		is_boolean : function(x) {
			return typeof x === 'boolean';
		},
		is_null : function(x) {
			return x === null;
		},
		is_array : function(x) {
			return Object.prototype.toString.call(x) === "[object Array]";
		},
		is_object : function(x) {
			return Object.prototype.toString.call(x) === "[object Object]";
		},
		get_type : function(x) {
			if (x === null) {
				return 'null';
			};
			
			switch (typeof x) {
				case 'number':
					return 'number';
	
				case 'string':
					return 'string';
	
				case 'boolean':
					return 'boolean';
			};
	
			switch(Object.prototype.toString.call(x)) {
				case '[object Array]':
					return 'array';
	
				case '[object Object]':
					return 'object';
			};
			
			throw new Error('Bad type');
		},
		
		foreach : function(obj, func) {
			var type = utils.get_type(obj),
				is_last = false,
				last;
	
			switch (type) {
				case 'array':
					last = obj.length - 1;
					
					for (var i = 0, c = obj.length; i < c; i++) {						
						if (i === last) {
							is_last = true;
						}
						
						func(obj[i], i, is_last);
					}
	
					break;
	
				case 'object':
					var keys = Object.keys(obj);
					
					last = keys.length - 1;
					
					for (var i = 0, c = keys.length; i < c; i++) {						
						if (i === last) {
							is_last = true;
						}
						
						func(obj[keys[i]], keys[i], is_last);
					}
	
					break;
			}
		},
		add_node_from_html : function(parent, html) {
			var div = document.createElement('div');
	
			parent.appendChild(div);
	
			div.outerHTML = html;
		},
		inherits : (function() {
			var F = function() {};
			
			return function(Child, Parent) {
				F.prototype = Parent.prototype;
				Child.prototype = new F();
				Child.prototype.constructor = Child;
			}
		})()
	};
	
	/* Node's factory */
	function Node(name, node, is_last) {
		var type = utils.get_type(node);
	
		switch (type) {
			case 'boolean':
				return new Node_boolean(name, node, is_last);
	
			case 'number':
				return new Node_number(name, node, is_last);
	
			case 'string':
				return new Node_string(name, node, is_last);
	
			case 'null':
				return new Node_null(name, node, is_last);
	
			case 'object':
				return new Node_object(name, node, is_last);
	
			case 'array':
				return new Node_array(name, node, is_last);
	
			default:
				throw new Error('Bad type');
		}
	}
	
	/* Simple type's constructor (string, number, boolean, null) */
	function Node_simple(name, value, is_last) {
		var self     = this,
			el       = document.createElement('li'),
			template = function(name, value) {
				var str = '<span class="name_wrapper">\
					<span class="name">"' +
						name +
					'"</span> : </span>\
					<span class="value">' +
						value +
					'</span>';
					
				if (!is_last) {
					str += ',';
				}
					
				return str;
			};
	
		el.classList.add('node');
		el.classList.add(this.type);
		el.innerHTML = template(name, value);
		
		self.el = el;
	}
	
	/* Boolean */
	function Node_boolean(name, value, is_last) {
		this.type = "boolean";
		
		Node_simple.call(this, name, value, is_last);
	}
	
	/* Number */
	function Node_number(name, value, is_last) {
		this.type = "number";
		
		Node_simple.call(this, name, value, is_last);
	}
	
	/* String */
	function Node_string(name, value, is_last) {
		this.type = "string";
		
		Node_simple.call(this, name, '"' + value + '"', is_last);
	}
	
	/* Null */
	function Node_null(name, value, is_last) {
		this.type = "null";
		
		Node_simple.call(this, name, value, is_last);
	}
	
	/* Complex node's constructor (object, array) */
	function Node_complex(name, value, is_last) {
		var self     = this,
			el       = document.createElement('li'),
			template = function(name, sym) {
				var comma = (!is_last) ? ',' : '',
					str = '<div class="value">\
						<b>' + sym[0] + '</b>\
						<ul class="children"></ul>\
						<b>' + sym[1] + '</b>'
						+ comma +	
					'</div>';
				
				if (name !== null) {
					str = '<span class="name_wrapper">\
						<span class="name">' +
							'<span class="expand_button"></span>' +
							'"' + name +
						'"</span> : </span>' + str;
				}
				
				return str;
			},
			children_ul,
			name_el,
			children = [];
	
		el.classList.add('node');
		el.classList.add(this.type);
		el.innerHTML = template(name, self.sym);
		
		children_ul = el.querySelector('.children');
		
		if (name !== null) {
			name_el = el.querySelector('.name');
			name_el.addEventListener('click', function() {
				self.toggle();
			}, false);
			self.is_root = false;
		} else {
			self.is_root = true;
			el.classList.add('expanded');
		}
		
		self.el = el;
		self.children = children;
		self.children_ul = children_ul;
	
		utils.foreach(value, function(node, name, is_last) {
			var child = new Node(name, node, is_last);
			self.add_child(child);
		});
		
		self.is_empty = !Boolean(children.length);
		if (self.is_empty) {
			el.classList.add('empty');
		}
	}
	
	Node_complex.prototype = {
		constructor : Node_complex,
		add_child : function(child) {
			this.children.push(child);
			this.children_ul.appendChild(child.el);
		},
		expand : function(is_recursive){
			var children = this.children;
			
			if (!this.is_root) {
				this.el.classList.add('expanded');
			}
			
			if (is_recursive) {
				utils.foreach(children, function(item, i) {
					if (typeof item.expand === 'function') {
						item.expand(is_recursive);
					}
				});
			}
		},
		collapse : function(is_recursive) {
			var children = this.children;
			
			if (!this.is_root) {
				this.el.classList.remove('expanded');
			}
			
			if (is_recursive) {
				utils.foreach(children, function(item, i) {
					if (typeof item.collapse === 'function') {
						item.collapse(is_recursive);
					}
				});
			}
		},
		toggle : function() {
			this.el.classList.toggle('expanded');
		}
	};
	
	/* Object */
	function Node_object(name, value, is_last) {
		this.sym = ['{', '}'];
		this.type = "object";
		
		Node_complex.call(this, name, value, is_last);
	}
	utils.inherits(Node_object, Node_complex);
	
	/* Array */
	function Node_array(name, value, is_last) {
		this.sym = ['[', ']'];
		this.type = "array";
		
		Node_complex.call(this, name, value, is_last);
	}
	utils.inherits(Node_array, Node_complex);
	
	
	/* Tree */
	var tree = (function() {
		var el = document.getElementById("tree"),
			root = null;

		return {
			set_root : function(child) {
				root = child;
				el.innerHTML = '';

				el.appendChild(child.el);
			},
			expand : function() {
				if (root) {
					root.expand('recursive');
				}
			},
			collapse : function(){
				if (root) {
					root.collapse('recursive');
				}
			}
		};
	})();
	
	/* Buttons and actions */
	var buttons = (function() {
		var all = document.getElementById('nav').getElementsByTagName('li'),
			load = document.getElementById('load_button'),
			expand = document.getElementById('expand_button'),
			collapse = document.getElementById('collapse_button'),
			show_help = document.getElementById('help_button');
		
		function deselectAll() {
			utils.foreach(all, function(x) {
				x.classList.remove('selected');
			});
		}
		
		function selectOne(button) {
			deselectAll();
			button.classList.add('selected');
		}
		
		/* Load button */
		function onLoadButtonClick(e) {
			load_json_form.show();
			
			e.preventDefault();
		}
		
		/* Expand button */
		function onExpandButtonClick(e) {
			tree.expand();
			
			e.preventDefault();
		}
		
		/* Collapse button */
		function onCollapseButtonClick(e) {
			tree.collapse();
			
			e.preventDefault();
		}
		
		/* Help button */
		function onShowHelpButtonClick(e) {
			help.show();
			
			e.preventDefault();
		}
		
		load.addEventListener('click', onLoadButtonClick, false);
		expand.addEventListener('click', onExpandButtonClick, false);
		collapse.addEventListener('click', onCollapseButtonClick, false);
		show_help.addEventListener('click', onShowHelpButtonClick, false);
	})();
	
	/* Load json form */
	var load_json_form = (function() {
		var form = document.getElementById('load_json_wrapper'),
			code_input = document.getElementById('code_input'),
			load_button = document.getElementById('load_code_button'),
			close_button = form.querySelector('.close_button'),
			overlay = document.getElementById('overlay');
		
		function load(e) {
			jsonTreeViewer.parse(code_input.value);
			hide();
			
			e.preventDefault();
		};
		
		function hide() {
			utils.hide(form);
			utils.hide(overlay);
		}
		
		load_button.addEventListener('click', load, false);
		
		close_button.addEventListener('click', hide, false);
		
		overlay.addEventListener('click', hide, false);
		
		return {
			show : function() {
				code_input.value = '';
				utils.show(form);
				utils.show(overlay);
			},
			hide : hide
		};
	})();

	
	/* Help block */
	var help = (function() {
		var block = document.getElementById('help'),
			overlay = document.getElementById('overlay'),
			close_button = block.querySelector('.close_button');
			
		function hide() {
			utils.hide(block);
			utils.hide(overlay);
		}
		
		function show() {
			utils.show(block);
			utils.show(overlay);
		}
			
		overlay.addEventListener('click', hide, false);
			
		close_button.addEventListener('click', hide, false);
			
		return {
			show : show,
			hide : hide
		};	
	})();

		
	return {
		parse : function(json_str) {
			var temp;

			try {
				temp = JSON.parse(json_str);
			} catch(e) {
				alert(e);
			}
			
			tree.set_root(new Node(null, temp, 'last'));
		}
	};	
})();

var example = '{"firstName": "John","lastName": "Smith","isAlive": true,"age": 25,"company": null,"height_cm": 167.64,"address": {"streetAddress": "21 2nd Street","city": "New York","state": "NY","postalCode": "10021-3100"},"phoneNumbers": [{ "type": "home", "number": "212 555-1234" },{ "type": "fax",  "number": "646 555-4567" }]}';

jsonTreeViewer.parse(example);
