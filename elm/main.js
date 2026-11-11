(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.am.V === region.at.V)
	{
		return 'on line ' + region.am.V;
	}
	return 'on lines ' + region.am.V + ' through ' + region.at.V;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a6,
		impl.bp,
		impl.bm,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		A: func(record.A),
		an: record.an,
		aj: record.aj
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.A;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.an;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.aj) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a6,
		impl.bp,
		impl.bm,
		function(sendToApp, initialModel) {
			var view = impl.bs;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.a6,
		impl.bp,
		impl.bm,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.ak && impl.ak(sendToApp)
			var view = impl.bs;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.aY);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.bo) && (_VirtualDom_doc.title = title = doc.bo);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.bc;
	var onUrlRequest = impl.bd;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		ak: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.aH === next.aH
							&& curr.ay === next.ay
							&& curr.aE.a === next.aE.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		a6: function(flags)
		{
			return A3(impl.a6, flags, _Browser_getUrl(), key);
		},
		bs: impl.bs,
		bp: impl.bp,
		bm: impl.bm
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { a3: 'hidden', a_: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { a3: 'mozHidden', a_: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { a3: 'msHidden', a_: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { a3: 'webkitHidden', a_: 'webkitvisibilitychange' }
		: { a3: 'hidden', a_: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		aM: _Browser_getScene(),
		aR: {
			aT: _Browser_window.pageXOffset,
			aU: _Browser_window.pageYOffset,
			aS: _Browser_doc.documentElement.clientWidth,
			ax: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		aS: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		ax: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			aM: {
				aS: node.scrollWidth,
				ax: node.scrollHeight
			},
			aR: {
				aT: node.scrollLeft,
				aU: node.scrollTop,
				aS: node.clientWidth,
				ax: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			aM: _Browser_getScene(),
			aR: {
				aT: x,
				aU: y,
				aS: _Browser_doc.documentElement.clientWidth,
				ax: _Browser_doc.documentElement.clientHeight
			},
			a0: {
				aT: x + rect.left,
				aU: y + rect.top,
				aS: rect.width,
				ax: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.a9) { flags += 'm'; }
	if (options.aZ) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.a1.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.a1.b, xhr)); });
		$elm$core$Maybe$isJust(request.aQ) && _Http_track(router, xhr, request.aQ.a);

		try {
			xhr.open(request.a8, request.bq, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.bq));
		}

		_Http_configureRequest(xhr, request);

		request.aY.a && xhr.setRequestHeader('Content-Type', request.aY.a);
		xhr.send(request.aY.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.aw; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.bn.a || 0;
	xhr.responseType = request.a1.d;
	xhr.withCredentials = request.aW;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		bq: xhr.responseURL,
		bj: xhr.status,
		bk: xhr.statusText,
		aw: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			bi: event.loaded,
			aN: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			bg: event.loaded,
			aN: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $author$project$Main$ClipboardResult = function (a) {
	return {$: 16, a: a};
};
var $author$project$Main$Navigate = function (a) {
	return {$: 22, a: a};
};
var $author$project$Main$NoOp = {$: 23};
var $author$project$Main$SaveIssue = function (a) {
	return {$: 18, a: a};
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.a) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.d),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.d);
		} else {
			var treeLen = builder.a * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.e) : builder.e;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.a);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.d) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.d);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{e: nodeList, a: (len / $elm$core$Array$branchFactor) | 0, d: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {av: fragment, ay: host, aC: path, aE: port_, aH: protocol, bf: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Main$clipboardResult = _Platform_incomingPort('clipboardResult', $elm$json$Json$Decode$bool);
var $author$project$Main$Auto = 0;
var $author$project$Main$CatalogLoading = {$: 0};
var $author$project$Main$GotZone = function (a) {
	return {$: 21, a: a};
};
var $author$project$Main$InvalidLink = {$: 0};
var $author$project$Main$MissingCopy = {$: 1};
var $author$project$Main$NewerFormat = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$OwnSession = 0;
var $author$project$Main$SeedGenerated = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$SessionCopy = 1;
var $author$project$Main$SharedSession = 2;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $truqu$elm_base64$Base64$Decode$pad = function (input) {
	var _v0 = $elm$core$String$length(input) % 4;
	switch (_v0) {
		case 3:
			return input + '=';
		case 2:
			return input + '==';
		default:
			return input;
	}
};
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $truqu$elm_base64$Base64$Decode$charToInt = function (_char) {
	switch (_char) {
		case 'A':
			return 0;
		case 'B':
			return 1;
		case 'C':
			return 2;
		case 'D':
			return 3;
		case 'E':
			return 4;
		case 'F':
			return 5;
		case 'G':
			return 6;
		case 'H':
			return 7;
		case 'I':
			return 8;
		case 'J':
			return 9;
		case 'K':
			return 10;
		case 'L':
			return 11;
		case 'M':
			return 12;
		case 'N':
			return 13;
		case 'O':
			return 14;
		case 'P':
			return 15;
		case 'Q':
			return 16;
		case 'R':
			return 17;
		case 'S':
			return 18;
		case 'T':
			return 19;
		case 'U':
			return 20;
		case 'V':
			return 21;
		case 'W':
			return 22;
		case 'X':
			return 23;
		case 'Y':
			return 24;
		case 'Z':
			return 25;
		case 'a':
			return 26;
		case 'b':
			return 27;
		case 'c':
			return 28;
		case 'd':
			return 29;
		case 'e':
			return 30;
		case 'f':
			return 31;
		case 'g':
			return 32;
		case 'h':
			return 33;
		case 'i':
			return 34;
		case 'j':
			return 35;
		case 'k':
			return 36;
		case 'l':
			return 37;
		case 'm':
			return 38;
		case 'n':
			return 39;
		case 'o':
			return 40;
		case 'p':
			return 41;
		case 'q':
			return 42;
		case 'r':
			return 43;
		case 's':
			return 44;
		case 't':
			return 45;
		case 'u':
			return 46;
		case 'v':
			return 47;
		case 'w':
			return 48;
		case 'x':
			return 49;
		case 'y':
			return 50;
		case 'z':
			return 51;
		case '0':
			return 52;
		case '1':
			return 53;
		case '2':
			return 54;
		case '3':
			return 55;
		case '4':
			return 56;
		case '5':
			return 57;
		case '6':
			return 58;
		case '7':
			return 59;
		case '8':
			return 60;
		case '9':
			return 61;
		case '+':
			return 62;
		case '/':
			return 63;
		default:
			return 0;
	}
};
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Char$fromCode = _Char_fromCode;
var $truqu$elm_base64$Base64$Decode$intToString = A2($elm$core$Basics$composeR, $elm$core$Char$fromCode, $elm$core$String$fromChar);
var $truqu$elm_base64$Base64$Decode$add = F2(
	function (_char, _v0) {
		var curr = _v0.a;
		var need = _v0.b;
		var res = _v0.c;
		var shiftAndAdd = function (_int) {
			return (63 & _int) | (curr << 6);
		};
		return (!need) ? ((!(128 & _char)) ? _Utils_Tuple3(
			0,
			0,
			_Utils_ap(
				res,
				$truqu$elm_base64$Base64$Decode$intToString(_char))) : (((224 & _char) === 192) ? _Utils_Tuple3(31 & _char, 1, res) : (((240 & _char) === 224) ? _Utils_Tuple3(15 & _char, 2, res) : _Utils_Tuple3(7 & _char, 3, res)))) : ((need === 1) ? _Utils_Tuple3(
			0,
			0,
			_Utils_ap(
				res,
				$truqu$elm_base64$Base64$Decode$intToString(
					shiftAndAdd(_char)))) : _Utils_Tuple3(
			shiftAndAdd(_char),
			need - 1,
			res));
	});
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $truqu$elm_base64$Base64$Decode$toUTF16 = F2(
	function (_char, acc) {
		return _Utils_Tuple3(
			0,
			0,
			A2(
				$truqu$elm_base64$Base64$Decode$add,
				255 & (_char >>> 0),
				A2(
					$truqu$elm_base64$Base64$Decode$add,
					255 & (_char >>> 8),
					A2($truqu$elm_base64$Base64$Decode$add, 255 & (_char >>> 16), acc))));
	});
var $truqu$elm_base64$Base64$Decode$chomp = F2(
	function (char_, _v0) {
		var curr = _v0.a;
		var cnt = _v0.b;
		var utf8ToUtf16 = _v0.c;
		var _char = $truqu$elm_base64$Base64$Decode$charToInt(char_);
		if (cnt === 3) {
			return A2($truqu$elm_base64$Base64$Decode$toUTF16, curr | _char, utf8ToUtf16);
		} else {
			return _Utils_Tuple3((_char << ((3 - cnt) * 6)) | curr, cnt + 1, utf8ToUtf16);
		}
	});
var $elm$core$String$foldl = _String_foldl;
var $truqu$elm_base64$Base64$Decode$initial = _Utils_Tuple3(
	0,
	0,
	_Utils_Tuple3(0, 0, ''));
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$endsWith = _String_endsWith;
var $truqu$elm_base64$Base64$Decode$stripNulls = F2(
	function (input, output) {
		return A2($elm$core$String$endsWith, '==', input) ? A2($elm$core$String$dropRight, 2, output) : (A2($elm$core$String$endsWith, '=', input) ? A2($elm$core$String$dropRight, 1, output) : output);
	});
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {a5: index, a7: match, bb: number, bl: submatches};
	});
var $elm$regex$Regex$contains = _Regex_contains;
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{aZ: false, a9: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $truqu$elm_base64$Base64$Decode$validBase64Regex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^([A-Za-z0-9\\/+]{4})*([A-Za-z0-9\\/+]{2}[A-Za-z0-9\\/+=]{2})?$'));
var $truqu$elm_base64$Base64$Decode$validate = function (input) {
	return A2($elm$regex$Regex$contains, $truqu$elm_base64$Base64$Decode$validBase64Regex, input) ? $elm$core$Result$Ok(input) : $elm$core$Result$Err('Invalid base64');
};
var $truqu$elm_base64$Base64$Decode$wrapUp = function (_v0) {
	var _v1 = _v0.c;
	var need = _v1.b;
	var res = _v1.c;
	return (need > 0) ? $elm$core$Result$Err('Invalid UTF-16') : $elm$core$Result$Ok(res);
};
var $truqu$elm_base64$Base64$Decode$validateAndDecode = function (input) {
	return A2(
		$elm$core$Result$map,
		$truqu$elm_base64$Base64$Decode$stripNulls(input),
		A2(
			$elm$core$Result$andThen,
			A2(
				$elm$core$Basics$composeR,
				A2($elm$core$String$foldl, $truqu$elm_base64$Base64$Decode$chomp, $truqu$elm_base64$Base64$Decode$initial),
				$truqu$elm_base64$Base64$Decode$wrapUp),
			$truqu$elm_base64$Base64$Decode$validate(input)));
};
var $truqu$elm_base64$Base64$Decode$decode = A2($elm$core$Basics$composeR, $truqu$elm_base64$Base64$Decode$pad, $truqu$elm_base64$Base64$Decode$validateAndDecode);
var $truqu$elm_base64$Base64$decode = $truqu$elm_base64$Base64$Decode$decode;
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $author$project$Main$NewerVersion = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$SupportedState = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $author$project$Main$PersistedState = F4(
	function (version, seed, actions, theme) {
		return {h: actions, D: seed, s: theme, br: version};
	});
var $author$project$Main$AskAction = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$ClearAction = {$: 3};
var $author$project$Main$ResetSeed = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$RollAction = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $author$project$Main$ShowAction = function (a) {
	return {$: 2, a: a};
};
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $author$project$Main$AllDice = 0;
var $elm_community$list_extra$List$Extra$find = F2(
	function (predicate, list) {
		find:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = list.a;
				var rest = list.b;
				if (predicate(first)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$predicate = predicate,
						$temp$list = rest;
					predicate = $temp$predicate;
					list = $temp$list;
					continue find;
				}
			}
		}
	});
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $author$project$Main$Highest = 1;
var $author$project$Main$Lowest = 2;
var $author$project$Main$Sum = 3;
var $author$project$Main$resultModes = _List_fromArray(
	[
		_Utils_Tuple2(0, 'All'),
		_Utils_Tuple2(1, 'Max'),
		_Utils_Tuple2(2, 'Min'),
		_Utils_Tuple2(3, 'Sum')
	]);
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$core$String$toLower = _String_toLower;
var $author$project$Main$resultModeDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (stored) {
		if (stored.$ === 1) {
			return $elm$json$Json$Decode$succeed(0);
		} else {
			var name = stored.a;
			var _v1 = A2(
				$elm_community$list_extra$List$Extra$find,
				function (_v2) {
					var label_ = _v2.b;
					return _Utils_eq(
						$elm$core$String$toLower(label_),
						name);
				},
				$author$project$Main$resultModes);
			if (!_v1.$) {
				var _v3 = _v1.a;
				var mode = _v3.a;
				return $elm$json$Json$Decode$succeed(mode);
			} else {
				return $elm$json$Json$Decode$fail('Unknown dice result mode');
			}
		}
	},
	$elm$json$Json$Decode$maybe(
		A2($elm$json$Json$Decode$field, 'resultMode', $elm$json$Json$Decode$string)));
var $author$project$Main$actionDecoder = function () {
	var tsDecoder = $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$map,
				$elm$time$Time$millisToPosix,
				A2($elm$json$Json$Decode$field, 'ts', $elm$json$Json$Decode$int)),
				$elm$json$Json$Decode$succeed(
				$elm$time$Time$millisToPosix(0))
			]));
	return A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (timestamp, action) {
				return {g: action, k: timestamp};
			}),
		tsDecoder,
		A2(
			$elm$json$Json$Decode$andThen,
			function (tag) {
				switch (tag) {
					case 'roll':
						return A5(
							$elm$json$Json$Decode$map4,
							$author$project$Main$RollAction,
							A2($elm$json$Json$Decode$field, 'sides', $elm$json$Json$Decode$int),
							A2($elm$json$Json$Decode$field, 'amount', $elm$json$Json$Decode$int),
							A2($elm$json$Json$Decode$field, 'explode', $elm$json$Json$Decode$bool),
							$author$project$Main$resultModeDecoder);
					case 'ask':
						return A2(
							$elm$json$Json$Decode$map,
							$author$project$Main$AskAction,
							A2($elm$json$Json$Decode$field, 'table', $elm$json$Json$Decode$string));
					case 'show':
						return A2(
							$elm$json$Json$Decode$map,
							$author$project$Main$ShowAction,
							A2($elm$json$Json$Decode$field, 'iconAmount', $elm$json$Json$Decode$int));
					case 'clear':
						return $elm$json$Json$Decode$succeed($author$project$Main$ClearAction);
					case 'resetSeed':
						return A2(
							$elm$json$Json$Decode$map,
							$author$project$Main$ResetSeed,
							A2($elm$json$Json$Decode$field, 'value', $elm$json$Json$Decode$int));
					default:
						return $elm$json$Json$Decode$fail('Unknown action tag');
				}
			},
			A2($elm$json$Json$Decode$field, 'tag', $elm$json$Json$Decode$string)));
}();
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Main$Dark = 2;
var $author$project$Main$Light = 1;
var $author$project$Main$themeFromString = function (value) {
	var _v0 = $elm$core$String$toLower(value);
	switch (_v0) {
		case 'light':
			return 1;
		case 'dark':
			return 2;
		default:
			return 0;
	}
};
var $author$project$Main$decoder = A5(
	$elm$json$Json$Decode$map4,
	$author$project$Main$PersistedState,
	A2(
		$elm$json$Json$Decode$map,
		function (v) {
			return (v <= 0) ? 1 : v;
		},
		A2($elm$json$Json$Decode$field, 'version', $elm$json$Json$Decode$int)),
	A2($elm$json$Json$Decode$field, 'seed', $elm$json$Json$Decode$int),
	A2(
		$elm$json$Json$Decode$field,
		'actions',
		$elm$json$Json$Decode$list($author$project$Main$actionDecoder)),
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$json$Json$Decode$field,
				'theme',
				A2($elm$json$Json$Decode$map, $author$project$Main$themeFromString, $elm$json$Json$Decode$string)),
				$elm$json$Json$Decode$succeed(0)
			])));
var $author$project$Main$schemaVersion = 2;
var $author$project$Main$savedStateDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (storedVersion) {
		return (_Utils_cmp(storedVersion, $author$project$Main$schemaVersion) > 0) ? $elm$json$Json$Decode$succeed(
			$author$project$Main$NewerVersion(storedVersion)) : A2($elm$json$Json$Decode$map, $author$project$Main$SupportedState, $author$project$Main$decoder);
	},
	A2($elm$json$Json$Decode$field, 'version', $elm$json$Json$Decode$int));
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Main$decodeStateFromString = function (encoded) {
	return A2(
		$elm$core$Maybe$andThen,
		A2(
			$elm$core$Basics$composeR,
			$elm$json$Json$Decode$decodeString($author$project$Main$savedStateDecoder),
			$elm$core$Result$toMaybe),
		A2(
			$elm$core$Maybe$andThen,
			A2($elm$core$Basics$composeR, $truqu$elm_base64$Base64$decode, $elm$core$Result$toMaybe),
			$elm$url$Url$percentDecode(encoded)));
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$Main$DiceTool = 0;
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$random$Random$Generator = $elm$core$Basics$identity;
var $elm$random$Random$Seed = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$random$Random$next = function (_v0) {
	var state0 = _v0.a;
	var incr = _v0.b;
	return A2($elm$random$Random$Seed, ((state0 * 1664525) + incr) >>> 0, incr);
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $elm$random$Random$peel = function (_v0) {
	var state = _v0.a;
	var word = (state ^ (state >>> ((state >>> 28) + 4))) * 277803737;
	return ((word >>> 22) ^ word) >>> 0;
};
var $elm$random$Random$int = F2(
	function (a, b) {
		return function (seed0) {
			var _v0 = (_Utils_cmp(a, b) < 0) ? _Utils_Tuple2(a, b) : _Utils_Tuple2(b, a);
			var lo = _v0.a;
			var hi = _v0.b;
			var range = (hi - lo) + 1;
			if (!((range - 1) & range)) {
				return _Utils_Tuple2(
					(((range - 1) & $elm$random$Random$peel(seed0)) >>> 0) + lo,
					$elm$random$Random$next(seed0));
			} else {
				var threshhold = (((-range) >>> 0) % range) >>> 0;
				var accountForBias = function (seed) {
					accountForBias:
					while (true) {
						var x = $elm$random$Random$peel(seed);
						var seedN = $elm$random$Random$next(seed);
						if (_Utils_cmp(x, threshhold) < 0) {
							var $temp$seed = seedN;
							seed = $temp$seed;
							continue accountForBias;
						} else {
							return _Utils_Tuple2((x % range) + lo, seedN);
						}
					}
				};
				return accountForBias(seed0);
			}
		};
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$random$Random$map = F2(
	function (func, _v0) {
		var genA = _v0;
		return function (seed0) {
			var _v1 = genA(seed0);
			var a = _v1.a;
			var seed1 = _v1.b;
			return _Utils_Tuple2(
				func(a),
				seed1);
		};
	});
var $elm$random$Random$map2 = F3(
	function (func, _v0, _v1) {
		var genA = _v0;
		var genB = _v1;
		return function (seed0) {
			var _v2 = genA(seed0);
			var a = _v2.a;
			var seed1 = _v2.b;
			var _v3 = genB(seed1);
			var b = _v3.a;
			var seed2 = _v3.b;
			return _Utils_Tuple2(
				A2(func, a, b),
				seed2);
		};
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{e: nodeList, a: nodeListSize, d: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $author$project$Tables$mythicAction1 = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandon', 'Accompany', 'Activate', 'Agree', 'Ambush', 'Arrive', 'Assist', 'Attack', 'Attain', 'Bargain', 'Befriend', 'Bestow', 'Betray', 'Block', 'Break', 'Carry', 'Celebrate', 'Change', 'Close', 'Combine', 'Communicate', 'Conceal', 'Continue', 'Control', 'Create', 'Deceive', 'Decrease', 'Defend', 'Delay', 'Deny', 'Depart', 'Deposit', 'Destroy', 'Dispute', 'Disrupt', 'Distrust', 'Divide', 'Drop', 'Easy', 'Energize', 'Escape', 'Expose', 'Fail', 'Fight', 'Flee', 'Free', 'Guide', 'Harm', 'Heal', 'Hinder', 'Imitate', 'Imprison', 'Increase', 'Indulge', 'Inform', 'Inquire', 'Inspect', 'Invade', 'Leave', 'Lure', 'Misuse', 'Move', 'Neglect', 'Observe', 'Open', 'Oppose', 'Overthrow', 'Praise', 'Proceed', 'Protect', 'Punish', 'Pursue', 'Recruit', 'Refuse', 'Release', 'Relinquish', 'Repair', 'Repulse', 'Return', 'Reward', 'Ruin', 'Separate', 'Start', 'Stop', 'Strange', 'Struggle', 'Succeed', 'Support', 'Suppress', 'Take', 'Threaten', 'Transform', 'Trap', 'Travel', 'Triumph', 'Truce', 'Trust', 'Use', 'Usurp', 'Waste']));
var $author$project$Tables$mythicAction2 = $elm$core$Array$fromList(
	_List_fromArray(
		['Advantage', 'Adversity', 'Agreement', 'Animal', 'Attention', 'Balance', 'Battle', 'Benefits', 'Building', 'Burden', 'Bureaucracy', 'Business', 'Chaos', 'Comfort', 'Completion', 'Conflict', 'Cooperation', 'Danger', 'Defense', 'Depletion', 'Disadvantage', 'Distraction', 'Elements', 'Emotion', 'Enemy', 'Energy', 'Environment', 'Expectation', 'Exterior', 'Extravagance', 'Failure', 'Fame', 'Fear', 'Freedom', 'Friend', 'Goal', 'Group', 'Health', 'Hindrance', 'Home', 'Hope', 'Idea', 'Illness', 'Illusion', 'Individual', 'Information', 'Innocent', 'Intellect', 'Interior', 'Investment', 'Leadership', 'Legal', 'Location', 'Military', 'Misfortune', 'Mundane', 'Nature', 'Needs', 'News', 'Normal', 'Object', 'Obscurity', 'Official', 'Opposition', 'Outside', 'Pain', 'Path', 'Peace', 'People', 'Personal', 'Physical', 'Plot', 'Portal', 'Possessions', 'Poverty', 'Power', 'Prison', 'Project', 'Protection', 'Reassurance', 'Representative', 'Riches', 'Safety', 'Strength', 'Success', 'Suffering', 'Surprise', 'Tactic', 'Technology', 'Tension', 'Time', 'Trial', 'Value', 'Vehicle', 'Victory', 'Vulnerability', 'Weapon', 'Weather', 'Work', 'Wound']));
var $author$project$Tables$askMythicActions = function () {
	var action2 = A2(
		$elm$random$Random$map,
		function (i) {
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Array$get, i, $author$project$Tables$mythicAction2));
		},
		A2(
			$elm$random$Random$int,
			0,
			$elm$core$Array$length($author$project$Tables$mythicAction2) - 1));
	var action1 = A2(
		$elm$random$Random$map,
		function (i) {
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Array$get, i, $author$project$Tables$mythicAction1));
		},
		A2(
			$elm$random$Random$int,
			0,
			$elm$core$Array$length($author$project$Tables$mythicAction1) - 1));
	return A3(
		$elm$random$Random$map2,
		F2(
			function (a1, a2) {
				return a1 + (' ' + a2);
			}),
		action1,
		action2);
}();
var $author$project$Tables$mythicDescriptor1 = $elm$core$Array$fromList(
	_List_fromArray(
		['Adventurously', 'Aggressively', 'Anxiously', 'Awkwardly', 'Beautifully', 'Bleakly', 'Boldly', 'Bravely', 'Busily', 'Calmly', 'Carefully', 'Carelessly', 'Cautiously', 'Ceaselessly', 'Cheerfully', 'Combatively', 'Coolly', 'Crazily', 'Curiously', 'Dangerously', 'Defiantly', 'Deliberately', 'Delicately', 'Delightfully', 'Dimly', 'Efficiently', 'Emotionally', 'Energetically', 'Enormously', 'Enthusiastically', 'Excitedly', 'Fearfully', 'Ferociously', 'Fiercely', 'Foolishly', 'Fortunately', 'Frantically', 'Freely', 'Frighteningly', 'Fully', 'Generously', 'Gently', 'Gladly', 'Gracefully', 'Gratefully', 'Happily', 'Hastily', 'Healthily', 'Helpfully', 'Helplessly', 'Hopelessly', 'Innocently', 'Intensely', 'Interestingly', 'Irritatingly', 'Joyfully', 'Kindly', 'Lazily', 'Lightly', 'Loosely', 'Loudly', 'Lovingly', 'Loyally', 'Majestically', 'Meaningfully', 'Mechanically', 'Mildly', 'Miserably', 'Mockingly', 'Mysteriously', 'Naturally', 'Neatly', 'Nicely', 'Oddly', 'Offensively', 'Officially', 'Partially', 'Passively', 'Peacefully', 'Perfectly', 'Playfully', 'Politely', 'Positively', 'Powerfully', 'Quaintly', 'Quarrelsomely', 'Quietly', 'Roughly', 'Rudely', 'Ruthlessly', 'Slowly', 'Softly', 'Strangely', 'Swiftly', 'Threateningly', 'Timidly', 'Very', 'Violently', 'Wildly', 'Yieldingly']));
var $author$project$Tables$mythicDescriptor2 = $elm$core$Array$fromList(
	_List_fromArray(
		['Abnormal', 'Amusing', 'Artificial', 'Average', 'Beautiful', 'Bizarre', 'Boring', 'Bright', 'Broken', 'Clean', 'Cold', 'Colorful', 'Colorless', 'Comforting', 'Creepy', 'Cute', 'Damaged', 'Dark', 'Defeated', 'Dirty', 'Disagreeable', 'Dry', 'Dull', 'Empty', 'Enormous', 'Extraordinary', 'Extravagant', 'Faded', 'Familiar', 'Fancy', 'Feeble', 'Festive', 'Flawless', 'Forlorn', 'Fragile', 'Fragrant', 'Fresh', 'Full', 'Glorious', 'Graceful', 'Hard', 'Harsh', 'Healthy', 'Heavy', 'Historical', 'Horrible', 'Important', 'Interesting', 'Juvenile', 'Lacking', 'Large', 'Lavish', 'Lean', 'Less', 'Lethal', 'Lively', 'Lonely', 'Lovely', 'Magnificent', 'Mature', 'Messy', 'Mighty', 'Military', 'Modern', 'Mundane', 'Mysterious', 'Natural', 'Normal', 'Odd', 'Old', 'Pale', 'Peaceful', 'Petite', 'Plain', 'Poor', 'Powerful', 'Protective', 'Quaint', 'Rare', 'Reassuring', 'Remarkable', 'Rotten', 'Rough', 'Ruined', 'Rustic', 'Scary', 'Shocking', 'Simple', 'Small', 'Smooth', 'Soft', 'Strong', 'Stylish', 'Unpleasant', 'Valuable', 'Vibrant', 'Warm', 'Watery', 'Weak', 'Young']));
var $author$project$Tables$askMythicDescriptions = function () {
	var desc2 = A2(
		$elm$random$Random$map,
		function (i) {
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Array$get, i, $author$project$Tables$mythicDescriptor2));
		},
		A2(
			$elm$random$Random$int,
			0,
			$elm$core$Array$length($author$project$Tables$mythicDescriptor2) - 1));
	var desc1 = A2(
		$elm$random$Random$map,
		function (i) {
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Array$get, i, $author$project$Tables$mythicDescriptor1));
		},
		A2(
			$elm$random$Random$int,
			0,
			$elm$core$Array$length($author$project$Tables$mythicDescriptor1) - 1));
	return A3(
		$elm$random$Random$map2,
		F2(
			function (d1, d2) {
				return d1 + (' ' + d2);
			}),
		desc1,
		desc2);
}();
var $author$project$Tables$mythicElementsAdventureTone = $elm$core$Array$fromList(
	_List_fromArray(
		['Action', 'Activity', 'Adventurous', 'Adversity', 'Aggressive', 'Amusing', 'Anxious', 'Attainment', 'Average', 'Bizarre', 'Bleak', 'Bold', 'Busy', 'Calm', 'Cheerful', 'Colorful', 'Combative', 'Competitive', 'Conflict', 'Crazy', 'Creepy', 'Dangerous', 'Dark', 'Emotional', 'Energetic', 'Epic', 'Evil', 'Exterior', 'Failure', 'Fame', 'Familiar', 'Fearful', 'Festive', 'Fierce', 'Fortunate', 'Frantic', 'Fresh', 'Frightening', 'Glorious', 'Goals', 'Hard', 'Harsh', 'Heavy', 'Historical', 'Hopeful', 'Horrible', 'Horror', 'Important', 'Inquire', 'Inspect', 'Intellect', 'Intense', 'Interesting', 'Intrigue', 'Lavish', 'Legal', 'Lethal', 'Light', 'Macabre', 'Magnificent', 'Majestic', 'Mature', 'Meaningful', 'Mechanical', 'Messy', 'Military', 'Misfortune', 'Mistrust', 'Modern', 'Mundane', 'Mystery', 'Natural', 'Normal', 'Odd', 'Personal', 'Physical', 'Power', 'Pursuit', 'Quaint', 'Random', 'Rare', 'Reassuring', 'Remarkable', 'Rough', 'Rustic', 'Scary', 'Simple', 'Slow', 'Social', 'Strange', 'Strong', 'Struggle', 'Tension', 'Travel', 'Trials', 'Vengeance', 'Very', 'Violent', 'Warlike', 'Wild']));
var $author$project$Tables$askMythicElementsAdventureTone = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsAdventureTone));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsAdventureTone) - 1));
var $author$project$Tables$mythicElementsAlienSpeciesDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Advanced', 'Aggressive', 'Agile', 'Amphibious', 'Ancient', 'Anxious', 'Aquatic', 'Arrogant', 'Artistic', 'Avian', 'Beautiful', 'Bizarre', 'Carapace', 'Clawed', 'Colorful', 'Combative', 'Conquering', 'Dangerous', 'Declining', 'Defensive', 'Desperate', 'Destructive', 'Dominating', 'Emotionless', 'Enormous', 'Exploitive', 'Explorers', 'Familiar', 'Fast', 'Feeble', 'Feral', 'Ferocious', 'Friendly', 'Frightening', 'Fungal', 'Furry', 'Generous', 'Gentle', 'Glowing', 'Graceful', 'Harsh', 'Helpful', 'Humanoid', 'Hungry', 'Immortal', 'Insectlike', 'Insubstantial', 'Intelligent', 'Intimidating', 'Large', 'Lethal', 'Levitating', 'Liquid', 'Mammalian', 'Many-eyed', 'Militaristic', 'Mysterious', 'Nightmarish', 'Odd', 'Oppressive', 'Passive', 'Peaceful', 'Perfect', 'Plant', 'Powered', 'Powerful', 'Powers', 'Primitive', 'Prosperous', 'Psychic', 'Reptilian', 'Robotic', 'Scary', 'Scientific', 'Secretive', 'Servitor', 'Simple', 'Skilled', 'Slender', 'Slow', 'Small', 'Smelly', 'Strange', 'Strong', 'Suffering', 'Tail', 'Tall', 'Technological', 'Tentacled', 'Threatening', 'Toothy', 'Travelers', 'Treacherous', 'Violent', 'Warlike', 'Wary', 'Watery', 'Weak', 'Wings', 'Wormish']));
var $author$project$Tables$askMythicElementsAlienSpeciesDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsAlienSpeciesDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsAlienSpeciesDescriptors) - 1));
var $author$project$Tables$mythicElementsAnimalActions = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandon', 'Abnormal', 'Aggressive', 'Angry', 'Anxious', 'Assist', 'Attack', 'Befriend', 'Bestow', 'Bizarre', 'Bold', 'Break', 'Busy', 'Calm', 'Careful', 'Careless', 'Cautious', 'Ceaseless', 'Change', 'Combative', 'Curious', 'Dangerous', 'Deliberate', 'Disinterested', 'Disrupt', 'Distracted', 'Dominate', 'Energetic', 'Excited', 'Exotic', 'Familiar', 'Fearful', 'Feeble', 'Ferocious', 'Fierce', 'Fight', 'Flee', 'Follow', 'Food', 'Frantic', 'Friendship', 'Frightening', 'Generous', 'Gentle', 'Graceful', 'Harm', 'Hasty', 'Helpful', 'Helpless', 'Hungry', 'Hunt', 'Ignore', 'Imitate', 'Implore', 'Imprison', 'Inspect', 'Intense', 'Irritating', 'Juvenile', 'Lazy', 'Leave', 'Lethal', 'Loud', 'Loyal', 'Messy', 'Mistrust', 'Move', 'Mundane', 'Mysterious', 'Natural', 'Neglect', 'Normal', 'Observe', 'Odd', 'Oppose', 'Playful', 'Protect', 'Pursue', 'Quiet', 'Reassuring', 'Release', 'Return', 'Scary', 'Simple', 'Slow', 'Strange', 'Struggle', 'Swift', 'Tactics', 'Take', 'Threatening', 'Tranquil', 'Transform', 'Trick', 'Trust', 'Violent', 'Warn', 'Waste', 'Wild', 'Yield']));
var $author$project$Tables$askMythicElementsAnimalActions = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsAnimalActions));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsAnimalActions) - 1));
var $author$project$Tables$mythicElementsArmyDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Active', 'Aggressive', 'Allies', 'Ambush', 'Animals', 'Arrive', 'Assist', 'Average', 'Betray', 'Bizarre', 'Block', 'Bold', 'Calm', 'Careless', 'Cautious', 'Ceaseless', 'Celebrate', 'Colorful', 'Communicate', 'Creepy', 'Deceive', 'Defensive', 'Defiant', 'Delay', 'Disorganized', 'Divide', 'Efficient', 'Enemies', 'Energy', 'Failure', 'Ferocious', 'Fight', 'Food', 'Foolish', 'Fortunate', 'Frantic', 'Fresh', 'Frightening', 'Helpful', 'Helpless', 'Illness', 'Lacking', 'Large', 'Lavish', 'Lazy', 'Leadership', 'Lethal', 'Loud', 'Loyal', 'Mighty', 'Mysterious', 'Normal', 'Path', 'Persecute', 'Power', 'Problems', 'Punish', 'Pursue', 'Quiet', 'Ready', 'Reassuring', 'Recruit', 'Release', 'Riches', 'Rough', 'Ruin', 'Ruthless', 'Simple', 'Skilled', 'Slow', 'Small', 'Stalemate', 'Start', 'Stop', 'Strange', 'Strong', 'Struggle', 'Success', 'Suffering', 'Supplies', 'Swift', 'Tactics', 'Take', 'Technology', 'Tension', 'Testing', 'Threatening', 'Tired', 'Travel', 'Triumph', 'Truce', 'Trust', 'Unequipped', 'Unexpected', 'Untrained', 'Victory', 'Violate', 'Waste', 'Weak', 'Weapons']));
var $author$project$Tables$askMythicElementsArmyDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsArmyDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsArmyDescriptors) - 1));
var $author$project$Tables$mythicElementsCavernDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Activity', 'Ancient', 'Animals', 'Aromatic', 'Art', 'Beautiful', 'Bizarre', 'Bleak', 'Blocked', 'Boulder', 'Bright', 'Cliff', 'Climb', 'Closed', 'Cold', 'Collapsed', 'Colorful', 'Cracked', 'Cramped', 'Crawl', 'Creature', 'Creepy', 'Crumbling', 'Curious', 'Damaged', 'Dangerous', 'Dark', 'Difficult', 'Dirty', 'Discouraging', 'Dripping', 'Dry', 'Echo', 'Elements', 'Empty', 'Enormous', 'Exit', 'Exotic', 'Fall', 'Flora', 'Frightening', 'Full', 'Fungus', 'Good', 'Hard', 'Harm', 'Harsh', 'Hole', 'Huge', 'Icy', 'Interesting', 'Large', 'Ledge', 'Lethal', 'Light', 'Loud', 'Magnificent', 'Message', 'Messy', 'Minerals', 'Misfortune', 'Mist', 'Mysterious', 'Natural', 'Nature', 'Normal', 'Occupied', 'Odd', 'Open', 'Path', 'Plants', 'Pool', 'Quiet', 'Reassuring', 'Remarkable', 'Riches', 'River', 'Rock', 'Rough', 'Scary', 'Simple', 'Slippery', 'Slope', 'Small', 'Smelly', 'Smooth', 'Sounds', 'Stalactites', 'Strange', 'Threatening', 'Tight', 'Tranquil', 'Treasure', 'Unnatural', 'Unstable', 'Untouched', 'Warm', 'Waste', 'Water', 'Windy']));
var $author$project$Tables$askMythicElementsCavernDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCavernDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCavernDescriptors) - 1));
var $author$project$Tables$mythicElementsCharacterActionsCombat = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandon', 'Abuse', 'Aggressive', 'Agree', 'Ally', 'Ambush', 'Amuse', 'Anger', 'Antagonize', 'Anxious', 'Assist', 'Attack', 'Betray', 'Block', 'Bold', 'Brave', 'Break', 'Calm', 'Careless', 'Carry', 'Cautious', 'Celebrate', 'Change', 'Charge', 'Communicate', 'Compete', 'Control', 'Crazy', 'Cruel', 'Damage', 'Deceive', 'Defend', 'Defiant', 'Delay', 'Disrupt', 'Divide', 'Dominate', 'Energetic', 'Enthusiastic', 'Expectation', 'Fearful', 'Ferocious', 'Fierce', 'Fight', 'Flee', 'Frantic', 'Free', 'Frightening', 'Harm', 'Harsh', 'Hasty', 'Hide', 'Imitate', 'Imprison', 'Kill', 'Lead', 'Lethal', 'Liberty', 'Lie', 'Loud', 'Loyal', 'Magic', 'Mechanical', 'Mighty', 'Military', 'Mock', 'Move', 'Mysterious', 'Normal', 'Odd', 'Open', 'Oppose', 'Pain', 'Path', 'Prepare', 'Punish', 'Pursue', 'Rough', 'Rude', 'Ruin', 'Ruthless', 'Simple', 'Slow', 'Spy', 'Stop', 'Strange', 'Struggle', 'Suppress', 'Swift', 'Take', 'Technology', 'Threaten', 'Trick', 'Truce', 'Usurp', 'Vehicle', 'Vengeance', 'Waste', 'Weapon', 'Withdraw']));
var $author$project$Tables$askMythicElementsCharacterActionsCombat = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacterActionsCombat));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacterActionsCombat) - 1));
var $author$project$Tables$mythicElementsCharacterActionsGeneral = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandon', 'Aggressive', 'Amusing', 'Anger', 'Antagonize', 'Anxious', 'Assist', 'Bestow', 'Betray', 'Bizarre', 'Block', 'Bold', 'Break', 'Calm', 'Care', 'Careful', 'Careless', 'Celebrate', 'Change', 'Combative', 'Communicate', 'Control', 'Crazy', 'Creepy', 'Dangerous', 'Deceive', 'Decrease', 'Defiant', 'Delay', 'Disrupt', 'Dominate', 'Efficient', 'Energetic', 'Excited', 'Expose', 'Fearful', 'Feeble', 'Fierce', 'Fight', 'Foolish', 'Frantic', 'Frightening', 'Generous', 'Gentle', 'Harm', 'Harsh', 'Hasty', 'Helpful', 'Imitate', 'Important', 'Imprison', 'Increase', 'Inspect', 'Intense', 'Juvenile', 'Kind', 'Lazy', 'Leadership', 'Lethal', 'Loud', 'Loyal', 'Mature', 'Meaningful', 'Messy', 'Move', 'Mundane', 'Mysterious', 'Nice', 'Normal', 'Odd', 'Official', 'Open', 'Oppose', 'Passion', 'Peace', 'Playful', 'Pleasures', 'Possessions', 'Punish', 'Pursue', 'Release', 'Return', 'Simple', 'Slow', 'Start', 'Stop', 'Strange', 'Struggle', 'Swift', 'Tactics', 'Take', 'Technology', 'Threatening', 'Trust', 'Violent', 'Waste', 'Weapons', 'Wild', 'Work', 'Yield']));
var $author$project$Tables$askMythicElementsCharacterActionsGeneral = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacterActionsGeneral));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacterActionsGeneral) - 1));
var $author$project$Tables$mythicElementsCharacterAppearance = $elm$core$Array$fromList(
	_List_fromArray(
		['Abnormal', 'Armed', 'Aromatic', 'Athletic', 'Attractive', 'Average', 'Bald', 'Beautiful', 'Bizarre', 'Brutish', 'Casual', 'Classy', 'Clean', 'Clothing', 'Colorful', 'Common', 'Cool', 'Creepy', 'Cute', 'Dainty', 'Delicate', 'Desperate', 'Different', 'Dirty', 'Drab', 'Elegant', 'Equipment', 'Exotic', 'Expensive', 'Extravagant', 'Eyewear', 'Familiar', 'Fancy', 'Features', 'Feminine', 'Festive', 'Frail', 'Hair', 'Hairy', 'Headwear', 'Heavy', 'Hurt', 'Innocent', 'Insignia', 'Intense', 'Interesting', 'Intimidating', 'Jewelry', 'Large', 'Lavish', 'Lean', 'Limbs', 'Lithe', 'Masculine', 'Mature', 'Messy', 'Mighty', 'Modern', 'Mundane', 'Muscular', 'Mysterious', 'Natural', 'Neat', 'Normal', 'Odd', 'Official', 'Old', 'Petite', 'Piercing', 'Powerful', 'Professional', 'Reassuring', 'Regal', 'Remarkable', 'Rough', 'Rustic', 'Scar', 'Scary', 'Scented', 'Scholarly', 'Short', 'Simple', 'Sinister', 'Small', 'Smelly', 'Stocky', 'Strange', 'Striking', 'Strong', 'Stylish', 'Tall', 'Tattoo', 'Tools', 'Trendy', 'Unusual', 'Very', 'Weak', 'Weapon', 'Wounded', 'Young']));
var $author$project$Tables$askMythicElementsCharacterAppearance = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacterAppearance));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacterAppearance) - 1));
var $author$project$Tables$mythicElementsCharacterBackground = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandoned', 'Abuse', 'Academic', 'Activity', 'Adventurous', 'Adversity', 'Art', 'Assist', 'Average', 'Bad', 'Bizarre', 'Bleak', 'Bold', 'Burden', 'Business', 'Care', 'Career', 'Chaotic', 'Cheat', 'Combat', 'Commitment', 'Community', 'Competition', 'Conflict', 'Control', 'Crime', 'Damaged', 'Danger', 'Death', 'Deceive', 'Decrease', 'Defeated', 'Disaster', 'Dispute', 'Emotion', 'Environment', 'Escape', 'Exile', 'Experience', 'Failure', 'Faith', 'Fame', 'Family', 'Fortunate', 'Free', 'Freedom', 'Friend', 'Gifts', 'Good', 'Guided', 'Hard', 'Harm', 'Harsh', 'Heal', 'Helped', 'Heroic', 'Humble', 'Humiliation', 'Imprisonment', 'Independent', 'Inherit', 'Injury', 'Injustice', 'Legal', 'Loss', 'Military', 'Mistake', 'Mundane', 'Nature', 'Outsider', 'Person', 'Place', 'Poor', 'Power', 'Prestige', 'Privilege', 'Pursued', 'Recruited', 'Religion', 'Rural', 'Saved', 'Search', 'Seclusion', 'Service', 'Sheltered', 'Skill', 'Strange', 'Successful', 'Survival', 'Tradition', 'Training', 'Trauma', 'Travel', 'Urban', 'War', 'Wealth', 'Wild', 'Work', 'Wounded', 'Youth']));
var $author$project$Tables$askMythicElementsCharacterBackground = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacterBackground));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacterBackground) - 1));
var $author$project$Tables$mythicElementsCharacterConversations = $elm$core$Array$fromList(
	_List_fromArray(
		['Abuse', 'Advice', 'Aggressive', 'Agree', 'Amusing', 'Angry', 'Anxious', 'Assist', 'Awkward', 'Betray', 'Bizarre', 'Bleak', 'Bold', 'Business', 'Calm', 'Careful', 'Careless', 'Cautious', 'Cheerful', 'Classy', 'Cold', 'Colorful', 'Combative', 'Crazy', 'Creepy', 'Curious', 'Defiant', 'Delightful', 'Disagreeable', 'Dispute', 'Efficient', 'Energetic', 'Enthusiastic', 'Excited', 'Fearful', 'Fierce', 'Foolish', 'Frantic', 'Frightening', 'Generous', 'Gentle', 'Glad', 'Grateful', 'Haggle', 'Happy', 'Harsh', 'Hasty', 'Helpful', 'Helpless', 'Hopeless', 'Ideas', 'Inform', 'Innocent', 'Inquire', 'Intense', 'Interesting', 'Intolerance', 'Irritating', 'Joyful', 'Judgmental', 'Juvenile', 'Kind', 'Leadership', 'Lie', 'Loud', 'Loving', 'Loyal', 'Macabre', 'Mature', 'Meaningful', 'Miserable', 'Mistrust', 'Mocking', 'Mundane', 'Mysterious', 'News', 'Nice', 'Normal', 'Odd', 'Offensive', 'Official', 'Oppose', 'Peace', 'Plans', 'Playful', 'Polite', 'Positive', 'Praise', 'Quarrelsome', 'Quiet', 'Reassuring', 'Refuse', 'Rude', 'Rumor', 'Simple', 'Threatening', 'Truce', 'Trust', 'Warm', 'Wild']));
var $author$project$Tables$askMythicElementsCharacterConversations = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacterConversations));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacterConversations) - 1));
var $author$project$Tables$mythicElementsCharacterDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Abnormal', 'Active', 'Adventurous', 'Aggressive', 'Agreeable', 'Ally', 'Ancient', 'Angry', 'Anxious', 'Armed', 'Aromatic', 'Arrogant', 'Attractive', 'Awkward', 'Beautiful', 'Bizarre', 'Bleak', 'Bold', 'Brave', 'Busy', 'Calm', 'Capable', 'Careful', 'Careless', 'Caring', 'Cautious', 'Cheerful', 'Classy', 'Clean', 'Clumsy', 'Colorful', 'Combative', 'Commanding', 'Common', 'Competitive', 'Confident', 'Crazy', 'Curious', 'Dangerous', 'Different', 'Difficult', 'Dirty', 'Disagreeable', 'Disciplined', 'Educated', 'Elegant', 'Erratic', 'Exotic', 'Fancy', 'Fast', 'Foul', 'Frightened', 'Gentle', 'Harmful', 'Helpful', 'Heroic', 'Humorous', 'Hurt', 'Ignorant', 'Impulsive', 'Inept', 'Informative', 'Intelligent', 'Interesting', 'Intimidating', 'Intrusive', 'Large', 'Loud', 'Meek', 'Naive', 'Old', 'Passive', 'Polite', 'Poor', 'Powerful', 'Powerless', 'Primitive', 'Principled', 'Quiet', 'Respectful', 'Rough', 'Rude', 'Simple', 'Skilled', 'Slow', 'Small', 'Sneaky', 'Sophisticated', 'Strange', 'Strong', 'Supportive', 'Surprising', 'Sweet', 'Trained', 'Uniformed', 'Unusual', 'Weak', 'Wealthy', 'Wild', 'Young']));
var $author$project$Tables$askMythicElementsCharacterDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacterDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacterDescriptors) - 1));
var $author$project$Tables$mythicElementsCharacterIdentity = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandoned', 'Administrator', 'Adventurous', 'Adversary', 'Advisor', 'Ally', 'Art', 'Artist', 'Assistant', 'Athlete', 'Authority', 'Bureaucrat', 'Business', 'Combatant', 'Competitor', 'Controller', 'Crafter', 'Creator', 'Criminal', 'Deceiver', 'Deliverer', 'Dependent', 'Driver/Pilot', 'Elite', 'Enemy', 'Enforcer', 'Engineer', 'Entertainer', 'Executive', 'Expert', 'Explorer', 'Family', 'Farmer', 'Fighter', 'Fixer', 'Foreigner', 'Friend', 'Gambler', 'Gatherer', 'Guardian', 'Healer', 'Helpless', 'Hero', 'Hunter', 'Information', 'Innocent', 'Inspector', 'Intellectual', 'Investigator', 'Judge', 'Killer', 'Laborer', 'Lackey', 'Law', 'Leader', 'Legal', 'Lost', 'Mechanical', 'Mediator', 'Merchant', 'Messenger', 'Military', 'Mundane', 'Mystery', 'Official', 'Organizer', 'Outsider', 'Performer', 'Persecutor', 'Planner', 'Pleaser', 'Power', 'Prisoner', 'Professional', 'Protector', 'Public', 'Punish', 'Radical', 'Religious', 'Represent', 'Rogue', 'Ruffian', 'Ruler', 'Scholar', 'Scientist', 'Scout', 'Servant', 'Socialite', 'Soldier', 'Student', 'Subverter', 'Supporter', 'Survivor', 'Teacher', 'Thief', 'Trader', 'Victim', 'Villain', 'Wanderer', 'Warrior']));
var $author$project$Tables$askMythicElementsCharacterIdentity = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacterIdentity));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacterIdentity) - 1));
var $author$project$Tables$mythicElementsCharacterMotivations = $elm$core$Array$fromList(
	_List_fromArray(
		['Adventure', 'Adversity', 'Ambition', 'Anger', 'Approval', 'Art', 'Attain', 'Business', 'Change', 'Character', 'Conflict', 'Control', 'Create', 'Danger', 'Death', 'Deceive', 'Destroy', 'Diminish', 'Disrupt', 'Emotion', 'Enemy', 'Environment', 'Escape', 'Failure', 'Fame', 'Family', 'Fear', 'Fight', 'Find', 'Free', 'Friend', 'Goal', 'Gratify', 'Group', 'Guide', 'Guilt', 'Hate', 'Heal', 'Help', 'Hide', 'Home', 'Hope', 'Idea', 'Illness', 'Important', 'Imprison', 'Increase', 'Information', 'Innocent', 'Intellect', 'Intolerance', 'Investment', 'Jealousy', 'Joy', 'Justice', 'Leader', 'Legal', 'Loss', 'Love', 'Loyalty', 'Malice', 'Misfortune', 'Mistrust', 'Mundane', 'Mysterious', 'Nature', 'Object', 'Obligation', 'Official', 'Oppose', 'Pain', 'Passion', 'Path', 'Peace', 'Physical', 'Place', 'Plan', 'Pleasure', 'Power', 'Pride', 'Protect', 'Pursue', 'Rare', 'Recover', 'Reveal', 'Revenge', 'Riches', 'Safety', 'Search', 'Serve', 'Start', 'Stop', 'Strange', 'Struggle', 'Success', 'Suffering', 'Support', 'Take', 'Transform', 'Travel']));
var $author$project$Tables$askMythicElementsCharacterMotivations = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacterMotivations));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacterMotivations) - 1));
var $author$project$Tables$mythicElementsCharacterPersonality = $elm$core$Array$fromList(
	_List_fromArray(
		['Active', 'Adventurous', 'Aggressive', 'Agreeable', 'Ambitious', 'Amusing', 'Angry', 'Annoying', 'Anxious', 'Arrogant', 'Average', 'Awkward', 'Bad', 'Bitter', 'Bold', 'Brave', 'Calm', 'Careful', 'Careless', 'Classy', 'Cold', 'Collector', 'Committed', 'Competitive', 'Confident', 'Control', 'Crazy', 'Creative', 'Crude', 'Curious', 'Deceptive', 'Determined', 'Devoted', 'Disagreeable', 'Dull', 'Emotion', 'Empathetic', 'Fair', 'Fastidious', 'Follower', 'Foolish', 'Friendly', 'Good', 'Gourmet', 'Greed', 'Haunted', 'Helpful', 'Honest', 'Honor', 'Humble', 'Humorous', 'Inconsistent', 'Independent', 'Interesting', 'Intolerant', 'Irresponsible', 'Knowledgeable', 'Larcenous', 'Leader', 'Likable', 'Loyal', 'Manipulative', 'Mercurial', 'Naive', 'Nervous', 'Oblivious', 'Obstinate', 'Optimistic', 'Perceptive', 'Perfectionist', 'Practical', 'Prepared', 'Principled', 'Protect', 'Quiet', 'Quirky', 'Rash', 'Rational', 'Respectful', 'Responsible', 'Restless', 'Risk', 'Rude', 'Savvy', 'Searching', 'Selfish', 'Selfless', 'Shallow', 'Social', 'Strange', 'Strong', 'Studious', 'Superstitious', 'Tolerant', 'Vindictive', 'Vocal', 'Wary', 'Weak', 'Wild', 'Wise']));
var $author$project$Tables$askMythicElementsCharacterPersonality = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacterPersonality));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacterPersonality) - 1));
var $author$project$Tables$mythicElementsCharacterSkills = $elm$core$Array$fromList(
	_List_fromArray(
		['Activity', 'Adversity', 'Agility', 'Animals', 'Art', 'Assist', 'Athletic', 'Attack', 'Attain', 'Average', 'Balance', 'Beginner', 'Bestow', 'Block', 'Business', 'Change', 'Combat', 'Communicate', 'Conflict', 'Control', 'Create', 'Criminal', 'Damage', 'Danger', 'Deceit', 'Decrease', 'Defense', 'Develop', 'Dispute', 'Disrupt', 'Domestic', 'Dominate', 'Driving', 'Elements', 'Energy', 'Environment', 'Experienced', 'Expert', 'Fight', 'Free', 'Guide', 'Harm', 'Heal', 'Health', 'Increase', 'Inform', 'Information', 'Inquire', 'Inspect', 'Intellect', 'Invade', 'Investigative', 'Knowledge', 'Leadership', 'Legal', 'Lethal', 'Lie', 'Master', 'Mechanical', 'Medical', 'Mental', 'Military', 'Motion', 'Move', 'Mundane', 'Mysterious', 'Nature', 'Normal', 'Obstacles', 'Official', 'Open', 'Oppose', 'Perception', 'Practical', 'Professional', 'Ranged', 'Release', 'Rogue', 'Ruin', 'Simple', 'Social', 'Specialist', 'Start', 'Stop', 'Strange', 'Strength', 'Struggle', 'Suppress', 'Take', 'Technology', 'Transform', 'Travel', 'Trick', 'Usurp', 'Vehicle', 'Violence', 'Water', 'Weapon', 'Weather', 'Wounds']));
var $author$project$Tables$askMythicElementsCharacterSkills = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacterSkills));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacterSkills) - 1));
var $author$project$Tables$mythicElementsCharacterTraitsAndFlaws = $elm$core$Array$fromList(
	_List_fromArray(
		['Academic', 'Adversity', 'Animal', 'Assist', 'Attract', 'Beautiful', 'Benefits', 'Bestow', 'Bizarre', 'Block', 'Burden', 'Combat', 'Communicate', 'Connection', 'Control', 'Create', 'Criminal', 'Damaged', 'Dangerous', 'Decrease', 'Defense', 'Delicate', 'Different', 'Dominate', 'Driven', 'Emotion', 'Enemy', 'Energy', 'Environment', 'Failure', 'Fame', 'Familiar', 'Fast', 'Feeble', 'Flawless', 'Focused', 'Fortunate', 'Friends', 'Good', 'Healthy', 'Illness', 'Impaired', 'Increase', 'Information', 'Inspect', 'Intellect', 'Intense', 'Interesting', 'Lacking', 'Large', 'Leadership', 'Legal', 'Less', 'Lethal', 'Limited', 'Loyal', 'Mental', 'Military', 'Misfortune', 'Missing', 'Move', 'Multi', 'Nature', 'Object', 'Odd', 'Old', 'Partial', 'Passion', 'Perception', 'Physical', 'Poor', 'Possessions', 'Power', 'Principles', 'Public', 'Rare', 'Remarkable', 'Resistant', 'Resource', 'Rich', 'Sense', 'Skill', 'Small', 'Social', 'Specialized', 'Spirit', 'Strange', 'Strong', 'Suffering', 'Technical', 'Technology', 'Tough', 'Travel', 'Trouble', 'Trustworthy', 'Unusual', 'Very', 'Weak', 'Weapon', 'Young']));
var $author$project$Tables$askMythicElementsCharacterTraitsAndFlaws = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacterTraitsAndFlaws));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacterTraitsAndFlaws) - 1));
var $author$project$Tables$mythicElementsCharacters = $elm$core$Array$fromList(
	_List_fromArray(
		['Accompanied', 'Active', 'Aggressive', 'Ambush', 'Animal', 'Anxious', 'Armed', 'Beautiful', 'Bold', 'Busy', 'Calm', 'Careless', 'Casual', 'Cautious', 'Classy', 'Colorful', 'Combative', 'Crazy', 'Creepy', 'Curious', 'Dangerous', 'Deceitful', 'Defeated', 'Defiant', 'Delightful', 'Emotional', 'Energetic', 'Equipped', 'Excited', 'Expected', 'Familiar', 'Fast', 'Feeble', 'Feminine', 'Ferocious', 'Foe', 'Foolish', 'Fortunate', 'Fragrant', 'Frantic', 'Friend', 'Frightened', 'Frightening', 'Generous', 'Glad', 'Happy', 'Harmful', 'Helpful', 'Helpless', 'Hurt', 'Important', 'Inactive', 'Influential', 'Innocent', 'Intense', 'Knowledgeable', 'Large', 'Lonely', 'Loud', 'Loyal', 'Masculine', 'Mighty', 'Miserable', 'Multiple', 'Mundane', 'Mysterious', 'Natural', 'Odd', 'Official', 'Old', 'Passive', 'Peaceful', 'Playful', 'Powerful', 'Professional', 'Protected', 'Protecting', 'Questioning', 'Quiet', 'Reassuring', 'Resourceful', 'Seeking', 'Skilled', 'Slow', 'Small', 'Stealthy', 'Strange', 'Strong', 'Tall', 'Thieving', 'Threatening', 'Triumphant', 'Unexpected', 'Unnatural', 'Unusual', 'Violent', 'Vocal', 'Weak', 'Wild', 'Young']));
var $author$project$Tables$askMythicElementsCharacters = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCharacters));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCharacters) - 1));
var $author$project$Tables$mythicElementsCityDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Activity', 'Aggressive', 'Aromatic', 'Average', 'Beautiful', 'Bleak', 'Block', 'Bridge', 'Bustling', 'Calm', 'Chaotic', 'Clean', 'Cold', 'Colorful', 'Commerce', 'Conflict', 'Control', 'Crime', 'Dangerous', 'Dense', 'Developed', 'Dirty', 'Efficient', 'Energy', 'Enormous', 'Environment', 'Extravagant', 'Festive', 'Flawless', 'Frightening', 'Government', 'Happy', 'Harsh', 'Healthy', 'Helpful', 'Hills', 'History', 'Illness', 'Important', 'Impressive', 'Industry', 'Interesting', 'Intrigues', 'Isolated', 'Lacking', 'Lake', 'Large', 'Lavish', 'Leadership', 'Liberty', 'Loud', 'Magnificent', 'Masses', 'Meaningful', 'Mechanical', 'Messy', 'Mighty', 'Military', 'Miserable', 'Misfortune', 'Modern', 'Mountain', 'Mundane', 'Mysterious', 'Nature', 'Odd', 'Old', 'Oppress', 'Opulence', 'Peace', 'Poor', 'Powerful', 'Protected', 'Public', 'Quiet', 'Rare', 'Reassuring', 'Remarkable', 'River', 'Rough', 'Ruined', 'Rustic', 'Simple', 'Small', 'Sparse', 'Structures', 'Struggle', 'Success', 'Suffering', 'Technology', 'Tension', 'Travel', 'Troubled', 'Valuable', 'Warm', 'Water', 'Weak', 'Weather', 'Wild', 'Work']));
var $author$project$Tables$askMythicElementsCityDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCityDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCityDescriptors) - 1));
var $author$project$Tables$mythicElementsCivilizationDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Active', 'Advanced', 'Adventurous', 'Aggressive', 'Agricultural', 'Ancient', 'Angry', 'Anxious', 'Artistic', 'Average', 'Beautiful', 'Bizarre', 'Bleak', 'Bold', 'Bureaucratic', 'Carefree', 'Careful', 'Careless', 'Cautious', 'Classy', 'Clean', 'Colorful', 'Combative', 'Commercial', 'Competitive', 'Constructive', 'Controlling', 'Crazy', 'Creative', 'Creepy', 'Cruel', 'Curious', 'Dangerous', 'Declining', 'Defiant', 'Delightful', 'Developed', 'Disagreeable', 'Distrustful', 'Dominant', 'Dull', 'Efficient', 'Expanding', 'Failed', 'Famous', 'Fearful', 'Festive', 'Free', 'Generous', 'Greedy', 'Happy', 'Healthy', 'Helpful', 'Helpless', 'Historical', 'Important', 'Industrial', 'Influential', 'Intolerant', 'Large', 'Lawful', 'Lawless', 'Magnificent', 'Mighty', 'Militaristic', 'Miserable', 'Modern', 'Mundane', 'Mysterious', 'Old', 'Open', 'Oppressive', 'Peaceful', 'Polite', 'Poor', 'Powerful', 'Primitive', 'Punitive', 'Quaint', 'Religious', 'Ruined', 'Rustic', 'Ruthless', 'Scary', 'Simple', 'Small', 'Strange', 'Strong', 'Struggling', 'Successful', 'Suffering', 'Suppressed', 'Suspicious', 'Treacherous', 'Warlike', 'Weak', 'Wealthy', 'Welcoming', 'Wild', 'Young']));
var $author$project$Tables$askMythicElementsCivilizationDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCivilizationDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCivilizationDescriptors) - 1));
var $author$project$Tables$mythicElementsCreatureAbilities = $elm$core$Array$fromList(
	_List_fromArray(
		['Ambush', 'Animate', 'Armor', 'Arrive', 'Attach', 'Attack', 'Attract', 'Bite', 'Block', 'Blunt', 'Break', 'Breath', 'Carry', 'Change', 'Climb', 'Cold', 'Common', 'Communicate', 'Conceal', 'Contact', 'Control', 'Create', 'Damage', 'Dark', 'Death', 'Deceive', 'Decrease', 'Defense', 'Depower', 'Detect', 'Disrupt', 'Distract', 'Dominate', 'Drain', 'Element', 'Energy', 'Enhanced', 'Entangle', 'Environment', 'Extra', 'Fear', 'Fight', 'Fire', 'Flight', 'Harm', 'Heal', 'Illness', 'Illusion', 'Imitate', 'Immune', 'Imprison', 'Increase', 'Intelligent', 'Itself', 'Lethal', 'Light', 'Limited', 'Mind', 'Move', 'Multiple', 'Natural', 'Normal', 'Open', 'Others', 'Paralyze', 'Physical', 'Pierce', 'Poison', 'Power', 'Protection', 'Proximity', 'Pursue', 'Ranged', 'Rechargeable', 'Resistance', 'Self-Sufficient', 'Senses', 'Skill', 'Sleep', 'Speed', 'Spy', 'Stealth', 'Stop', 'Strange', 'Stun', 'Substance', 'Summon', 'Suppress', 'Swim', 'Take', 'Telepathy', 'Touch', 'Transform', 'Travel', 'Trick', 'Uncommon', 'Vision', 'Vulnerable', 'Weak', 'Weapon']));
var $author$project$Tables$askMythicElementsCreatureAbilities = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCreatureAbilities));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCreatureAbilities) - 1));
var $author$project$Tables$mythicElementsCreatureDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Aggressive', 'Agile', 'Air', 'Alien', 'Amorphous', 'Animal', 'Aquatic', 'Armored', 'Avian', 'Beast', 'Beautiful', 'Body', 'Bony', 'Carapace', 'Clawed', 'Clothed', 'Cold', 'Color', 'Composite', 'Constructed', 'Decayed', 'Defensive', 'Dripping', 'Elements', 'Exotic', 'Extra Limbs', 'Fangs', 'Feminine', 'Feral', 'Filthy', 'Fire', 'Fungal', 'Furry', 'Gaunt', 'Glowing', 'Group', 'Growling', 'Healthy', 'Horns', 'Humanoid', 'Inscribed', 'Insect-like', 'Insubstantial', 'Intelligent', 'Intimidating', 'Large', 'Levitating', 'Limited', 'Liquid', 'Loud', 'Mammalian', 'Mandibles', 'Masculine', 'Mechanical', 'Metallic', 'Movement', 'Multiple', 'Mutant', 'Natural', 'Nature', 'Nightmarish', 'Object', 'Odorous', 'Passive', 'Plant', 'Reptilian', 'Robotic', 'Rooted', 'Rough', 'Shape', 'Shifting', 'Silent', 'Simple', 'Slender', 'Small', 'Solitary', 'Spider-like', 'Spiked', 'Steaming', 'Sticky', 'Stinger', 'Strange', 'Strong', 'Supernatural', 'Tail', 'Tentacled', 'Tongue', 'Toothy', 'Transparent', 'Tree-like', 'Twisted', 'Undead', 'Unnatural', 'Verbal', 'Warm', 'Weak', 'Weapon', 'Wings', 'Wooden', 'Wormish']));
var $author$project$Tables$askMythicElementsCreatureDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCreatureDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCreatureDescriptors) - 1));
var $author$project$Tables$mythicElementsCrypticMessage = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandoned', 'Activity', 'Adventure', 'Adversity', 'Advice', 'Allies', 'Anger', 'Bestow', 'Betray', 'Bizarre', 'Bleak', 'Business', 'Care', 'Colorful', 'Communicate', 'Conflict', 'Creepy', 'Damaged', 'Danger', 'Death', 'Deceive', 'Defiant', 'Dispute', 'Divide', 'Emotions', 'Enemies', 'Environment', 'Evil', 'Expose', 'Failure', 'Fame', 'Fear', 'Fight', 'Frantic', 'Free', 'Friendship', 'Goals', 'Good', 'Guide', 'Harm', 'Help', 'Helpful', 'Hidden', 'Hope', 'Horrible', 'Important', 'Information', 'Innocent', 'Instruction', 'Intrigues', 'Language', 'Leadership', 'Legal', 'Legend', 'Liberty', 'Lies', 'Lost', 'Love', 'Malice', 'Messy', 'Misfortune', 'Mistrust', 'Move', 'Mundane', 'Mysterious', 'Neglect', 'Normal', 'Obscured', 'Official', 'Old', 'Oppose', 'Partial', 'Passion', 'Plans', 'Possessions', 'Power', 'Propose', 'Punish', 'Pursue', 'Rare', 'Reassuring', 'Recipient', 'Reveal', 'Riches', 'Riddle', 'Rumor', 'Secret', 'Start', 'Stop', 'Strange', 'Struggle', 'Success', 'Tension', 'Threaten', 'Truce', 'Trust', 'Unknown', 'Vengeance', 'Violence', 'Warning']));
var $author$project$Tables$askMythicElementsCrypticMessage = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCrypticMessage));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCrypticMessage) - 1));
var $author$project$Tables$mythicElementsCurses = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandon', 'Age', 'Attract', 'Bad', 'Beauty', 'Betray', 'Bizarre', 'Block', 'Body', 'Break', 'Burden', 'Business', 'Change', 'Compel', 'Condemn', 'Conflict', 'Create', 'Creepy', 'Cruel', 'Danger', 'Death', 'Decrease', 'Delay', 'Disrupt', 'Divide', 'Dominate', 'Dreams', 'Elements', 'Emotions', 'Enemies', 'Energy', 'Environment', 'Evil', 'Failure', 'Fame', 'Family', 'Fate', 'Fear', 'Feeble', 'Fight', 'Friends', 'Frightening', 'Goals', 'Good', 'Gratify', 'Guide', 'Happiness', 'Harm', 'Health', 'Helpless', 'Home', 'Illness', 'Illusions', 'Imprison', 'Incapacity', 'Information', 'Intellect', 'Ironic', 'Jealously', 'Joy', 'Legal', 'Lethal', 'Liberty', 'Limit', 'Lonely', 'Love', 'Luck', 'Malice', 'Meaningful', 'Miserable', 'Misfortune', 'Mistrust', 'Mock', 'Move', 'Mundane', 'Mysterious', 'Nature', 'Neglect', 'Old', 'Oppress', 'Pain', 'Passion', 'Peace', 'Permanent', 'Possessions', 'Punish', 'Pursue', 'Riches', 'Ruin', 'Senses', 'Separate', 'Start', 'Stop', 'Strange', 'Struggle', 'Success', 'Temporary', 'Vengeance', 'Violence', 'Weapon']));
var $author$project$Tables$askMythicElementsCurses = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsCurses));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsCurses) - 1));
var $author$project$Tables$mythicElementsDomicileDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandoned', 'Activity', 'Animal', 'Aromatic', 'Art', 'Average', 'Beautiful', 'Bizarre', 'Bleak', 'Busy', 'Classy', 'Clean', 'Cluttered', 'Cold', 'Colorful', 'Comfort', 'Common', 'Cramped', 'Creepy', 'Crowded', 'Customized', 'Cute', 'Damaged', 'Dangerous', 'Dark', 'Desolate', 'Different', 'Dirty', 'Disagreeable', 'Drab', 'Dull', 'Empty', 'Enormous', 'Expected', 'Extravagant', 'Faded', 'Fancy', 'Festive', 'Food', 'Frightening', 'Full', 'Home', 'Investment', 'Inviting', 'Lacking', 'Large', 'Lavish', 'Less', 'Light', 'Loud', 'Magnificent', 'Mechanical', 'Messy', 'Modern', 'Mundane', 'Mysterious', 'Natural', 'Neat', 'Neglected', 'Nondescript', 'Normal', 'Occupied', 'Odd', 'Open', 'Oppressive', 'Opulent', 'Organized', 'Plants', 'Poor', 'Portal', 'Possessions', 'Private', 'Protection', 'Quaint', 'Reassuring', 'Roomy', 'Rough', 'Ruined', 'Rustic', 'Scary', 'Secure', 'Security', 'Simple', 'Sleep', 'Small', 'Smelly', 'Sparse', 'Storage', 'Strange', 'Temporary', 'Thoughtful', 'Tidy', 'Tools', 'Tranquil', 'Upgrade', 'Utilitarian', 'Valuables', 'View', 'Warm', 'Water']));
var $author$project$Tables$askMythicElementsDomicileDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsDomicileDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsDomicileDescriptors) - 1));
var $author$project$Tables$mythicElementsDungeonDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandoned', 'Activity', 'Adversity', 'Ambush', 'Ancient', 'Animal', 'Aromatic', 'Art', 'Beautiful', 'Bizarre', 'Bleak', 'Chamber', 'Clean', 'Closed', 'Cold', 'Collapsed', 'Colorful', 'Creature', 'Creepy', 'Damaged', 'Danger', 'Dark', 'Desolate', 'Dirty', 'Door', 'Dry', 'Elements', 'Empty', 'Encounter', 'Enemies', 'Enormous', 'Evil', 'Exit', 'Extravagant', 'Faded', 'Familiar', 'Fancy', 'Fears', 'Foreboding', 'Full', 'Furnishings', 'Gate', 'Good', 'Harm', 'Heavy', 'Helpful', 'Hole', 'Important', 'Information', 'Interesting', 'Large', 'Lavish', 'Lethal', 'Light', 'Magnificent', 'Malice', 'Meaningful', 'Mechanical', 'Messages', 'Messy', 'Mighty', 'Military', 'Misfortune', 'Modern', 'Mundane', 'Mysterious', 'Natural', 'Neglect', 'Normal', 'Object', 'Occupied', 'Odd', 'Open', 'Passage', 'Path', 'Portal', 'Possessions', 'Quiet', 'Rare', 'Reassuring', 'Remarkable', 'Riches', 'Room', 'Rough', 'Ruined', 'Rustic', 'Scary', 'Simple', 'Small', 'Smelly', 'Sound', 'Stairs', 'Stonework', 'Technology', 'Trap', 'Treasure', 'Unnatural', 'Valuable', 'Warm', 'Watery']));
var $author$project$Tables$askMythicElementsDungeonDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsDungeonDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsDungeonDescriptors) - 1));
var $author$project$Tables$mythicElementsDungeonTraps = $elm$core$Array$fromList(
	_List_fromArray(
		['Aggressive', 'Allies', 'Ambush', 'Animals', 'Animate', 'Antagonize', 'Aromatic', 'Art', 'Attach', 'Attention', 'Attract', 'Balance', 'Beautiful', 'Bestow', 'Betray', 'Bizarre', 'Blades', 'Break', 'Ceiling', 'Change', 'Choice', 'Climb', 'Cloud', 'Cold', 'Colorful', 'Combative', 'Communicate', 'Confuse', 'Constrain', 'Control', 'Create', 'Creepy', 'Crush', 'Damaged', 'Danger', 'Dark', 'Deceive', 'Delay', 'Deprive', 'Disrupt', 'Divide', 'Door', 'Drop', 'Duplicate', 'Elaborate', 'Enemies', 'Energy', 'Fall', 'Fear', 'Fight', 'Fire', 'Floor', 'Frightening', 'Harm', 'Heat', 'Heavy', 'Helpless', 'Horrible', 'Illusion', 'Imprison', 'Lethal', 'Loud', 'Lure', 'Magic', 'Mechanical', 'Mental', 'Messy', 'Monster', 'Natural', 'Object', 'Odd', 'Old', 'Pain', 'Plants', 'Portal', 'Possessions', 'Prison', 'Projectile', 'Riddle', 'Scary', 'Simple', 'Sounds', 'Stab', 'Stop', 'Strange', 'Strangle', 'Suppress', 'Take', 'Toxin', 'Transform', 'Transport', 'Treasure', 'Trials', 'Trigger', 'Unleash', 'Wall', 'Warning', 'Water', 'Weapon', 'Wound']));
var $author$project$Tables$askMythicElementsDungeonTraps = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsDungeonTraps));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsDungeonTraps) - 1));
var $author$project$Tables$mythicElementsForestDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Adversity', 'Aggressive', 'Ambush', 'Ancient', 'Animal', 'Aromatic', 'Art', 'Assist', 'Average', 'Beautiful', 'Bizarre', 'Bleak', 'Block', 'Boulder', 'Cave', 'Chaotic', 'Cliff', 'Cold', 'Colorful', 'Combative', 'Communicate', 'Creepy', 'Damaged', 'Danger', 'Dark', 'Death', 'Delicate', 'Dry', 'Elements', 'Encounter', 'Enormous', 'Environment', 'Fearful', 'Feeble', 'Fierce', 'Food', 'Fortunate', 'Fresh', 'Harsh', 'Healthy', 'Helpful', 'Important', 'Information', 'Intense', 'Interesting', 'Lacking', 'Lake', 'Large', 'Lean', 'Ledge', 'Lethal', 'Loud', 'Magnificent', 'Majestic', 'Masses', 'Mature', 'Message', 'Mighty', 'Mundane', 'Mysterious', 'Natural', 'Nature', 'Nondescript', 'Normal', 'Odd', 'Old', 'Path', 'Peaceful', 'Plants', 'Pond', 'Possessions', 'Powerful', 'Pursue', 'Quiet', 'Rare', 'Reassuring', 'Remarkable', 'River', 'Rocks', 'Rough', 'Ruined', 'Scary', 'Simple', 'Slope', 'Small', 'Sounds', 'Strange', 'Strong', 'Threatening', 'Tranquil', 'Tree', 'Unusual', 'Valuable', 'Violent', 'Warm', 'Watery', 'Weak', 'Weather', 'Wild', 'Young']));
var $author$project$Tables$askMythicElementsForestDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsForestDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsForestDescriptors) - 1));
var $author$project$Tables$mythicElementsGods = $elm$core$Array$fromList(
	_List_fromArray(
		['Active', 'Alien', 'Ancient', 'Angelic', 'Angry', 'Animal', 'Art', 'Assist', 'Attract', 'Beautiful', 'Bestow', 'Betray', 'Bizarre', 'Capricious', 'Colorful', 'Combat', 'Communicate', 'Conflict', 'Control', 'Corruption', 'Cosmic', 'Create', 'Creepy', 'Cruel', 'Cult', 'Dangerous', 'Dark', 'Death', 'Deceit', 'Destroyer', 'Disgusting', 'Dominate', 'Dreams', 'Elements', 'Emotions', 'Enemies', 'Energy', 'Enormous', 'Evil', 'Feminine', 'Fallen', 'Fear', 'Fertility', 'Festive', 'Fire', 'Frightening', 'Generous', 'Gentle', 'Gifts', 'Glorious', 'Good', 'Guide', 'Harm', 'Harsh', 'Heal', 'Humanoid', 'Illness', 'Imprison', 'Increase', 'Jealous', 'Justice', 'Knowledge', 'Liberty', 'Life', 'Light', 'Love', 'Magic', 'Majestic', 'Major', 'Malice', 'Masculine', 'Mighty', 'Military', 'Minor', 'Monstrous', 'Mundane', 'Mysterious', 'Nature', 'Night', 'Oppress', 'Pleasures', 'Power', 'Protector', 'Punish', 'Ruler', 'Sacrifice', 'Strange', 'Strong', 'Suppress', 'Threatening', 'Transform', 'Underworld', 'Violent', 'War', 'Warm', 'Water', 'Weak', 'Weapon', 'Weather', 'Worshiped']));
var $author$project$Tables$askMythicElementsGods = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsGods));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsGods) - 1));
var $author$project$Tables$mythicElementsLegends = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandon', 'Allies', 'Anger', 'Assist', 'Attainment', 'Befriend', 'Bestow', 'Betray', 'Bizarre', 'Block', 'Brave', 'Break', 'Burden', 'Carelessness', 'Cataclysm', 'Caution', 'Change', 'Conflict', 'Control', 'Create', 'Crisis', 'Damage', 'Danger', 'Deceive', 'Decrease', 'Defeated', 'Defiant', 'Delay', 'Disrupt', 'Divide', 'Elements', 'End', 'Enemies', 'Energy', 'Evil', 'Expose', 'Failure', 'Fame', 'Fear', 'Fight', 'Find', 'Free', 'Friendship', 'Frightening', 'Good', 'Guide', 'Harm', 'Heal', 'Help', 'Helpless', 'Hero', 'Hidden', 'Historical', 'Illness', 'Important', 'Imprison', 'Increase', 'Inform', 'Innocent', 'Intrigue', 'Jealousy', 'Judge', 'Leadership', 'Legal', 'Lethal', 'Liberty', 'Loss', 'Love', 'Loyalty', 'Masses', 'Mighty', 'Military', 'Misfortune', 'Monster', 'Move', 'Mundane', 'Mysterious', 'Natural', 'Old', 'Oppose', 'Oppress', 'Peace', 'Plot', 'Possessions', 'Power', 'Punish', 'Pursue', 'Release', 'Return', 'Riches', 'Ruin', 'Savior', 'Stop', 'Strange', 'Struggle', 'Theft', 'Trust', 'Usurp', 'Vengeance', 'Villain']));
var $author$project$Tables$askMythicElementsLegends = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsLegends));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsLegends) - 1));
var $author$project$Tables$mythicElementsLocations = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandoned', 'Active', 'Artistic', 'Atmosphere', 'Beautiful', 'Bleak', 'Bright', 'Business', 'Calm', 'Charming', 'Clean', 'Cluttered', 'Cold', 'Colorful', 'Colorless', 'Confusing', 'Cramped', 'Creepy', 'Crude', 'Cute', 'Damaged', 'Dangerous', 'Dark', 'Delightful', 'Dirty', 'Domestic', 'Empty', 'Enclosed', 'Enormous', 'Entrance', 'Exclusive', 'Exposed', 'Extravagant', 'Familiar', 'Fancy', 'Festive', 'Foreboding', 'Fortunate', 'Fragrant', 'Frantic', 'Frightening', 'Full', 'Harmful', 'Helpful', 'Horrible', 'Important', 'Impressive', 'Inactive', 'Intense', 'Intriguing', 'Lively', 'Lonely', 'Long', 'Loud', 'Meaningful', 'Messy', 'Mobile', 'Modern', 'Mundane', 'Mysterious', 'Natural', 'New', 'Occupied', 'Odd', 'Official', 'Old', 'Open', 'Peaceful', 'Personal', 'Plain', 'Portal', 'Protected', 'Protection', 'Purposeful', 'Quiet', 'Reassuring', 'Remote', 'Resourceful', 'Ruined', 'Rustic', 'Safe', 'Services', 'Simple', 'Small', 'Spacious', 'Storage', 'Strange', 'Stylish', 'Suspicious', 'Tall', 'Threatening', 'Tranquil', 'Unexpected', 'Unpleasant', 'Unusual', 'Useful', 'Warm', 'Warning', 'Watery', 'Welcoming']));
var $author$project$Tables$askMythicElementsLocations = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsLocations));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsLocations) - 1));
var $author$project$Tables$mythicElementsMagicItemDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Animal', 'Animate', 'Area', 'Armor', 'Assist', 'Attack', 'Attract', 'Benefit', 'Bestow', 'Block', 'Book', 'Change', 'Clothing', 'Cloud', 'Cold', 'Communication', 'Container', 'Control', 'Create', 'Curse', 'Damage', 'Death', 'Deceit', 'Decrease', 'Defense', 'Destroy', 'Detect', 'Dimensions', 'Elements', 'Emotion', 'Energy', 'Enhance', 'Environment', 'Escape', 'Evil', 'Explode', 'Fear', 'Fire', 'Flight', 'Food', 'Gem', 'Good', 'Group', 'Harm', 'Heal', 'Health', 'Helpful', 'Illness', 'Illusion', 'Imbue', 'Imitate', 'Increase', 'Information', 'Inhibit', 'Instant', 'Jewelry', 'Lethal', 'Life', 'Light', 'Limited', 'Liquid', 'Mental', 'Monster', 'Multi', 'Nature', 'Object', 'Orb', 'Others', 'Physical', 'Plants', 'Poison', 'Potion', 'Power', 'Ranged', 'Resistance', 'Restore', 'Ring', 'Rope', 'Rune', 'Safety', 'Scroll', 'Self', 'Senses', 'Skill', 'Special', 'Speed', 'Spell', 'Staff', 'Strange', 'Summon', 'Sword', 'Tool', 'Transform', 'Trap', 'Travel', 'Useful', 'Utility', 'Wand', 'Water', 'Weapon']));
var $author$project$Tables$askMythicElementsMagicItemDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsMagicItemDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsMagicItemDescriptors) - 1));
var $author$project$Tables$mythicElementsMutationDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Agility', 'Animal', 'Appearance', 'Armor', 'Assist', 'Attach', 'Attack', 'Benefit', 'Bestow', 'Bizarre', 'Block', 'Body', 'Change', 'Claws', 'Color', 'Combat', 'Communicate', 'Conceal', 'Constrain', 'Control', 'Create', 'Damage', 'Deceive', 'Decrease', 'Defect', 'Defense', 'Deformed', 'Detect', 'Diminish', 'Disrupt', 'Dominate', 'Elements', 'Energy', 'Enhance', 'Environment', 'Expose', 'Extra', 'Eyes', 'Fear', 'Fight', 'Fly', 'Free', 'Harm', 'Heal', 'Health', 'Heat', 'Helpful', 'Horrible', 'Imitate', 'Immunity', 'Imprison', 'Increase', 'Information', 'Inspect', 'Large', 'Learn', 'Lethal', 'Limb', 'Limit', 'Mental', 'Messy', 'Move', 'Nature', 'Pain', 'Partial', 'Power', 'Projectile', 'Protection', 'Ranged', 'Recharge', 'Release', 'Replace', 'Requirement', 'Resistance', 'Restore', 'Reveal', 'Scary', 'Senses', 'Simple', 'Skill', 'Stop', 'Strange', 'Strength', 'Strong', 'Struggle', 'Suffer', 'Suppress', 'Surroundings', 'Survive', 'Swim', 'Toxic', 'Transform', 'Travel', 'Usurp', 'Violence', 'Vulnerability', 'Warm', 'Weak', 'Weapon', 'Wound']));
var $author$project$Tables$askMythicElementsMutationDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsMutationDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsMutationDescriptors) - 1));
var $author$project$Tables$mythicElementsNames = $elm$core$Array$fromList(
	_List_fromArray(
		['A', 'Action', 'Ah', 'Ahg', 'An', 'Animal', 'Ar', 'As', 'B', 'Bah', 'Be', 'Bih', 'Brah', 'Col', 'Color', 'Cor', 'Dah', 'Deeds', 'Del', 'Drah', 'Eee', 'Eh', 'Ei', 'Ell', 'Elements', 'Emotion', 'Ess', 'Est', 'Et', 'Fah', 'Fer', 'Fi', 'Floral', 'Gah', 'Go', 'Grah', 'Hee', 'Ia', 'Ick', 'In', 'Iss', 'Je', 'Ke', 'Jen', 'Kha', 'Kr', 'Lah', 'Lee', 'Len', 'Lin', 'Location', 'Ly', 'Mah', 'Military', 'Misdeed', 'N', 'Nah', 'Nature', 'Nee', 'Nn', 'Number', 'Occupation', 'Oh', 'On', 'Or', 'Orn', 'Oth', 'Ow', 'Ph', 'Pr', 'R', 'Rah', 'Ren', 'Sah', 'Se', 'Sh', 'Sha', 'T', 'Ta', 'Tal', 'Tar', 'Th', 'Thah', 'Thoh', 'Ti', 'Time', 'Tor', 'Uh', 'Va', 'Vah', 'Ve', 'Vice', 'Virtue', 'Wah', 'Wr', 'X', 'Y', 'Yah', 'Yuh', 'Z']));
var $author$project$Tables$askMythicElementsNames = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsNames));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsNames) - 1));
var $author$project$Tables$mythicElementsNobleHouse = $elm$core$Array$fromList(
	_List_fromArray(
		['Aggressive', 'Allies', 'Anger', 'Bestow', 'Betray', 'Bizarre', 'Block', 'Break', 'Bureaucracy', 'Cautious', 'Change', 'Commerce', 'Compromise', 'Conflict', 'Connections', 'Control', 'Create', 'Crisis', 'Cruel', 'Dangerous', 'Death', 'Deceit', 'Defeat', 'Defiant', 'Disrupt', 'Enemies', 'Extravagant', 'Faded', 'Fame', 'Family', 'Headquarters', 'Heirloom', 'Hero', 'History', 'Home', 'Important', 'Imprison', 'Increase', 'Information', 'Intrigue', 'Investment', 'Land', 'Large', 'Leadership', 'Legal', 'Leverage', 'Liberty', 'Love', 'Loyal', 'Magnificent', 'Malice', 'Mighty', 'Military', 'Misfortune', 'Move', 'Mysterious', 'Neglect', 'Old', 'Oppose', 'Oppress', 'Overthrow', 'Passion', 'Peace', 'Persecute', 'Plans', 'Politics', 'Possessions', 'Powerful', 'Public', 'Refuse', 'Release', 'Remarkable', 'Return', 'Riches', 'Royalty', 'Ruthless', 'Secret', 'Security', 'Servant', 'Spy', 'Strange', 'Strong', 'Struggle', 'Succession', 'Suffering', 'Suppress', 'Tactics', 'Tension', 'Travel', 'Trust', 'Usurp', 'Valuable', 'Vengeance', 'Victory', 'Violence', 'War', 'Weak', 'Wealth', 'Weapon', 'Young']));
var $author$project$Tables$askMythicElementsNobleHouse = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsNobleHouse));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsNobleHouse) - 1));
var $author$project$Tables$mythicElementsObjects = $elm$core$Array$fromList(
	_List_fromArray(
		['Active', 'Artistic', 'Average', 'Beautiful', 'Bizarre', 'Bright', 'Clothing', 'Clue', 'Cold', 'Colorful', 'Communication', 'Complicated', 'Confusing', 'Consumable', 'Container', 'Creepy', 'Crude', 'Cute', 'Damaged', 'Dangerous', 'Deactivated', 'Deliberate', 'Delightful', 'Desired', 'Domestic', 'Empty', 'Energy', 'Enormous', 'Equipment', 'Expected', 'Expended', 'Extravagant', 'Faded', 'Familiar', 'Fancy', 'Flora', 'Fortunate', 'Fragile', 'Fragrant', 'Frightening', 'Garbage', 'Guidance', 'Hard', 'Harmful', 'Healing', 'Heavy', 'Helpful', 'Horrible', 'Important', 'Inactive', 'Information', 'Intriguing', 'Large', 'Lethal', 'Light', 'Liquid', 'Loud', 'Majestic', 'Meaningful', 'Mechanical', 'Modern', 'Moving', 'Multiple', 'Mundane', 'Mysterious', 'Natural', 'New', 'Odd', 'Official', 'Old', 'Ornamental', 'Ornate', 'Personal', 'Powerful', 'Prized', 'Protection', 'Rare', 'Ready', 'Reassuring', 'Resource', 'Ruined', 'Small', 'Soft', 'Solitary', 'Stolen', 'Strange', 'Stylish', 'Threatening', 'Tool', 'Travel', 'Unexpected', 'Unpleasant', 'Unusual', 'Useful', 'Useless', 'Valuable', 'Warm', 'Weapon', 'Wet', 'Worn']));
var $author$project$Tables$askMythicElementsObjects = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsObjects));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsObjects) - 1));
var $author$project$Tables$mythicElementsPlotTwists = $elm$core$Array$fromList(
	_List_fromArray(
		['Action', 'Attack', 'Bad', 'Barrier', 'Betray', 'Business', 'Change', 'Character', 'Conclude', 'Conditional', 'Conflict', 'Connection', 'Consequence', 'Control', 'Danger', 'Death', 'Delay', 'Destroy', 'Diminish', 'Disaster', 'Discover', 'Emotion', 'Enemy', 'Enhance', 'Enter', 'Escape', 'Evidence', 'Failure', 'Family', 'Free', 'Friend', 'Good', 'Group', 'Harm', 'Headquarters', 'Help', 'Helpless', 'Hidden', 'Idea', 'Immediate', 'Impending', 'Important', 'Incapacitate', 'Information', 'Injustice', 'Leader', 'Legal', 'Lethal', 'Lie', 'Limit', 'Location', 'Lucky', 'Mental', 'Missing', 'Mundane', 'Mystery', 'Necessary', 'News', 'Object', 'Oppose', 'Outcast', 'Overcome', 'Past', 'Peace', 'Personal', 'Persuade', 'Physical', 'Plan', 'Power', 'Prepare', 'Problem', 'Promise', 'Protect', 'Public', 'Pursue', 'Rare', 'Remote', 'Repair', 'Repeat', 'Require', 'Rescue', 'Resource', 'Response', 'Reveal', 'Revenge', 'Reversal', 'Reward', 'Skill', 'Social', 'Solution', 'Strange', 'Success', 'Tension', 'Trap', 'Travel', 'Unknown', 'Unlikely', 'Unusual', 'Urgent', 'Useful']));
var $author$project$Tables$askMythicElementsPlotTwists = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsPlotTwists));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsPlotTwists) - 1));
var $author$project$Tables$mythicElementsPowers = $elm$core$Array$fromList(
	_List_fromArray(
		['Absorb', 'Adversity', 'Alter', 'Animate', 'Assist', 'Attach', 'Attack', 'Block', 'Body', 'Change', 'Chemical', 'Cold', 'Colorful', 'Combat', 'Combine', 'Communicate', 'Control', 'Cosmetic', 'Create', 'Creature', 'Damage', 'Dark', 'Death', 'Deceive', 'Defense', 'Delay', 'Destroy', 'Detect', 'Dimensions', 'Diminish', 'Disrupt', 'Distance', 'Dominate', 'Duplicate', 'Electricity', 'Elements', 'Emission', 'Emotion', 'Enemies', 'Energy', 'Enhance', 'Environment', 'Explosion', 'Extra', 'Fire', 'Flight', 'Free', 'Friend', 'Harm', 'Heal', 'Heat', 'Help', 'Hide', 'Illusion', 'Imbue', 'Immunity', 'Increase', 'Information', 'Life', 'Light', 'Limb', 'Limited', 'Location', 'Magic', 'Major', 'Manipulate', 'Matter', 'Mental', 'Minor', 'Natural', 'Nature', 'Object', 'Others', 'Physical', 'Plants', 'Poison', 'Power', 'Protect', 'Radius', 'Ranged', 'Reflect', 'Repel', 'Resistance', 'Reveal', 'Self', 'Sense', 'Skill', 'Spirit', 'Stealth', 'Strange', 'Summon', 'Switch', 'Take', 'Technology', 'Time', 'Transform', 'Trap', 'Travel', 'Weapon', 'Weather']));
var $author$project$Tables$askMythicElementsPowers = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsPowers));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsPowers) - 1));
var $author$project$Tables$mythicElementsScavengingResults = $elm$core$Array$fromList(
	_List_fromArray(
		['Abundance', 'Activity', 'Adversity', 'Allies', 'Animal', 'Art', 'Barrier', 'Beauty', 'Bizarre', 'Bleak', 'Broken', 'Clean', 'Clothes', 'Comfort', 'Communicate', 'Competition', 'Concealment', 'Conflict', 'Container', 'Control', 'Crisis', 'Damaged', 'Danger', 'Death', 'Dirty', 'Disagreeable', 'Disgusting', 'Dispute', 'Drink', 'Elements', 'Empty', 'Enemies', 'Energy', 'Extravagance', 'Failure', 'Fear', 'Fight', 'Food', 'Fresh', 'Friendship', 'Fuel', 'Good', 'Health', 'Helpful', 'Hope', 'Important', 'Information', 'Joy', 'Large', 'Lavish', 'Lean', 'Less', 'Lethal', 'Mechanical', 'Medicinal', 'Messy', 'Misfortune', 'Mundane', 'Mysterious', 'Nature', 'New', 'Normal', 'Odd', 'Official', 'Old', 'Open', 'Opposition', 'Pain', 'Peace', 'Pleasures', 'Portal', 'Possessions', 'Protection', 'Reassuring', 'Repairable', 'Rotten', 'Rough', 'Ruined', 'Scary', 'Shelter', 'Simple', 'Small', 'Smelly', 'Strange', 'Struggle', 'Success', 'Supply', 'Technology', 'Tool', 'Travel', 'Triumph', 'Trouble', 'Useless', 'Valuable', 'Vehicle', 'Victory', 'Violence', 'Warm', 'Waste', 'Weapon']));
var $author$project$Tables$askMythicElementsScavengingResults = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsScavengingResults));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsScavengingResults) - 1));
var $author$project$Tables$mythicElementsSmells = $elm$core$Array$fromList(
	_List_fromArray(
		['Acrid', 'Animal', 'Antiseptic', 'Aromatic', 'Artificial', 'Attractive', 'Bad', 'Bizarre', 'Burnt', 'Chemical', 'Clean', 'Comforting', 'Cooking', 'Decrepit', 'Delicious', 'Delightful', 'Dirty', 'Disagreeable', 'Disgusting', 'Dry', 'Dull', 'Earthy', 'Electrical', 'Evocative', 'Faded', 'Faint', 'Familiar', 'Fetid', 'Fishy', 'Floral', 'Food', 'Foul', 'Fragrant', 'Fresh', 'Fruity', 'Funky', 'Good', 'Grassy', 'Gratifying', 'Heady', 'Heavy', 'Herbal', 'Horrible', 'Humid', 'Industrial', 'Interesting', 'Intoxicating', 'Irritating', 'Lacking', 'Laden', 'Malodorous', 'Meaningful', 'Medicinal', 'Metallic', 'Mildew', 'Moist', 'Mossy', 'Musky', 'Musty', 'Mysterious', 'Natural', 'Nature', 'Nauseating', 'Normal', 'Odd', 'Odorless', 'Offensive', 'Overpowering', 'Perfumed', 'Pleasurable', 'Powerful', 'Pungent', 'Punishing', 'Putrid', 'Rancid', 'Reassuring', 'Reek', 'Rich', 'Ripe', 'Rot', 'Rotten', 'Savory', 'Smelly', 'Smokey', 'Sour', 'Stagnant', 'Stale', 'Stench', 'Stinging', 'Strange', 'Strong', 'Stuffy', 'Sulphuric', 'Sweet', 'Warm', 'Waste', 'Watery', 'Weak', 'Weather', 'Woody']));
var $author$project$Tables$askMythicElementsSmells = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsSmells));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsSmells) - 1));
var $author$project$Tables$mythicElementsSounds = $elm$core$Array$fromList(
	_List_fromArray(
		['Activity', 'Alarm', 'Animal', 'Approach', 'Banging', 'Battle', 'Beep', 'Bell', 'Beseeching', 'Bizarre', 'Burning', 'Busy', 'Calm', 'Ceaseless', 'Celebrate', 'Chaotic', 'Cheerful', 'Clang', 'Combative', 'Communicate', 'Construction', 'Conversation', 'Crash', 'Creaking', 'Creepy', 'Cries', 'Damage', 'Danger', 'Disagreeable', 'Distant', 'Drip', 'Echo', 'Emotion', 'Energetic', 'Explosion', 'Familiar', 'Ferocious', 'Footsteps', 'Frantic', 'Frightening', 'Grinding', 'Growl', 'Hammering', 'Helpful', 'Imitate', 'Important', 'Indistinct', 'Industry', 'Information', 'Innocent', 'Intense', 'Interesting', 'Irritating', 'Loud', 'Machinery', 'Meaningful', 'Metallic', 'Muffled', 'Multiple', 'Music', 'Mysterious', 'Natural', 'Near', 'Noisy', 'Normal', 'Odd', 'Productivity', 'Pursuit', 'Quiet', 'Reassuring', 'Remarkable', 'Rip', 'Roar', 'Rumbling', 'Rustling', 'Scary', 'Scraping', 'Scratching', 'Simple', 'Sizzle', 'Slam', 'Slow', 'Soft', 'Start', 'Stop', 'Strange', 'Tapping', 'Technology', 'Threatening', 'Thud', 'Traffic', 'Tranquil', 'Uncertain', 'Warning', 'Water', 'Weather', 'Whirring', 'Whistle', 'Wild', 'Wind']));
var $author$project$Tables$askMythicElementsSounds = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsSounds));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsSounds) - 1));
var $author$project$Tables$mythicElementsSpellEffects = $elm$core$Array$fromList(
	_List_fromArray(
		['Animal', 'Animate', 'Assist', 'Attack', 'Attract', 'Bestow', 'Bizarre', 'Block', 'Break', 'Bright', 'Burn', 'Change', 'Cloud', 'Cold', 'Communicate', 'Conceal', 'Conjure', 'Control', 'Counteract', 'Create', 'Creature', 'Curse', 'Damage', 'Dark', 'Death', 'Deceive', 'Decrease', 'Defense', 'Destroy', 'Detect', 'Diminish', 'Disease', 'Dominate', 'Duplicate', 'Earth', 'Elements', 'Emotion', 'Enemies', 'Energy', 'Enhance', 'Environment', 'Expose', 'Fire', 'Fix', 'Food', 'Free', 'Group', 'Guide', 'Hamper', 'Harm', 'Heal', 'Helpful', 'Ice', 'Illusion', 'Imbue', 'Immunity', 'Imprison', 'Information', 'Inspect', 'Life', 'Light', 'Limitation', 'Liquid', 'Loud', 'Manipulation', 'Mind', 'Nature', 'Object', 'Others', 'Pain', 'Physical', 'Plant', 'Poison', 'Portal', 'Powerful', 'Protect', 'Radius', 'Ranged', 'Resistance', 'Restore', 'Self', 'Senses', 'Shield', 'Soul', 'Strange', 'Strength', 'Stun', 'Summon', 'Time', 'Transform', 'Trap', 'Travel', 'Trigger', 'Uncertain', 'Undead', 'Wall', 'Water', 'Weak', 'Weapon', 'Weather']));
var $author$project$Tables$askMythicElementsSpellEffects = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsSpellEffects));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsSpellEffects) - 1));
var $author$project$Tables$mythicElementsStarshipDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Activity', 'Adversity', 'Assist', 'Automated', 'Battle', 'Beautiful', 'Bestow', 'Bleak', 'Block', 'Bright', 'Business', 'Clean', 'Cold', 'Colorful', 'Combative', 'Communicate', 'Computer', 'Contain', 'Control', 'Creepy', 'Crew', 'Damaged', 'Danger', 'Dark', 'Death', 'Defense', 'Elaborate', 'Empty', 'Energy', 'Engine', 'Enormous', 'Environment', 'Escape', 'Exit', 'Exterior', 'Fear', 'Food', 'Full', 'Hall', 'Health', 'Helpful', 'Important', 'Information', 'Inquire', 'Interesting', 'Lacking', 'Large', 'Lavish', 'Lethal', 'Loud', 'Magnificent', 'Maintenance', 'Meaningful', 'Mechanical', 'Message', 'Messy', 'Mighty', 'Military', 'Modern', 'Multiple', 'Mundane', 'Mysterious', 'Natural', 'Normal', 'Odd', 'Portal', 'Possessions', 'Power', 'Powerful', 'Prison', 'Protection', 'Quiet', 'Rare', 'Reassuring', 'Remarkable', 'Resources', 'Room', 'Rough', 'Ruined', 'Scary', 'Security', 'Simple', 'Small', 'Sounds', 'Start', 'Stop', 'Storage', 'Strange', 'Supplies', 'Survival', 'System', 'Tactics', 'Technology', 'Travel', 'Unusual', 'Valuable', 'Vehicle', 'Warm', 'Weapon', 'Work']));
var $author$project$Tables$askMythicElementsStarshipDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsStarshipDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsStarshipDescriptors) - 1));
var $author$project$Tables$mythicElementsTerrainDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Abandoned', 'Abundant', 'Activity', 'Advanced', 'Allies', 'Ancient', 'Animals', 'Atmosphere', 'Barren', 'Beautiful', 'Bizarre', 'Catastrophe', 'Chaotic', 'City', 'Civilization', 'Cliffs', 'Clouds', 'Cold', 'Colorful', 'Combative', 'Communicate', 'Conflict', 'Damaged', 'Danger', 'Defense', 'Desert', 'Dry', 'Dull', 'Elements', 'Empty', 'Energy', 'Enormous', 'Environment', 'Fertile', 'Frightening', 'Habitable', 'Harsh', 'Hazy', 'Healthy', 'Helpful', 'Hostile', 'Hot', 'Intense', 'Interesting', 'Large', 'Lethal', 'Life', 'Lovely', 'Magnificent', 'Masses', 'Mechanical', 'Message', 'Mighty', 'Misfortune', 'Mountainous', 'Multiple', 'Mundane', 'Mysterious', 'Natural', 'Nature', 'Nondescript', 'Ocean', 'Odd', 'Peaceful', 'People', 'Plants', 'Populated', 'Powerful', 'Primitive', 'Rain', 'Rare', 'Remarkable', 'Resourceful', 'Riches', 'River', 'Rocky', 'Rough', 'Ruined', 'Ruins', 'Sandy', 'Scary', 'Simple', 'Small', 'Strange', 'Strong', 'Technology', 'Threatening', 'Toxic', 'Tranquil', 'Trees', 'Unusual', 'Valuable', 'Violent', 'Warm', 'Water', 'Weak', 'Weather', 'Wild', 'Windy', 'Wonders']));
var $author$project$Tables$askMythicElementsTerrainDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsTerrainDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsTerrainDescriptors) - 1));
var $author$project$Tables$mythicElementsUndeadDescriptors = $elm$core$Array$fromList(
	_List_fromArray(
		['Active', 'Aggressive', 'Angry', 'Animal', 'Anxious', 'Attract', 'Beautiful', 'Bestow', 'Bizarre', 'Bleak', 'Bold', 'Bound', 'Cold', 'Combative', 'Communicate', 'Control', 'Create', 'Creepy', 'Dangerous', 'Dark', 'Deceive', 'Dirty', 'Disgusting', 'Elements', 'Enemies', 'Energy', 'Environment', 'Evil', 'Fast', 'Fear', 'Fight', 'Floating', 'Friendly', 'Frightening', 'Glad', 'Glow', 'Goals', 'Good', 'Guide', 'Harm', 'Helpful', 'Helpless', 'Historical', 'Horrible', 'Hungry', 'Imitate', 'Information', 'Insubstantial', 'Intelligent', 'Large', 'Leadership', 'Lethal', 'Light', 'Limited', 'Lonely', 'Love', 'Macabre', 'Malice', 'Message', 'Messy', 'Mighty', 'Mindless', 'Miserable', 'Misfortune', 'Monstrous', 'Mundane', 'Odd', 'Old', 'Pain', 'Pale', 'Passive', 'Possessions', 'Possessive', 'Powerful', 'Powers', 'Purposeful', 'Pursue', 'Quiet', 'Resistant', 'Rotting', 'Scary', 'Seeking', 'Shambling', 'Slow', 'Small', 'Smelly', 'Strange', 'Strong', 'Threatening', 'Tough', 'Transform', 'Travel', 'Trick', 'Vengeful', 'Violent', 'Weak', 'Weakness', 'Weapons', 'Wounds', 'Young']));
var $author$project$Tables$askMythicElementsUndeadDescriptors = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsUndeadDescriptors));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsUndeadDescriptors) - 1));
var $author$project$Tables$mythicElementsVisionsAndDreams = $elm$core$Array$fromList(
	_List_fromArray(
		['Activity', 'Adversity', 'Allies', 'Assist', 'Attainment', 'Bizarre', 'Bleak', 'Catastrophe', 'Celebrate', 'Change', 'Colorful', 'Conflict', 'Contact', 'Control', 'Creepy', 'Crisis', 'Cruelty', 'Danger', 'Dark', 'Death', 'Defeat', 'Disruption', 'Elements', 'Emotions', 'Enemies', 'Energy', 'Environment', 'Event', 'Evil', 'Failure', 'Fears', 'Festive', 'Fight', 'Friendship', 'Frightening', 'Future', 'Goals', 'Good', 'Guidance', 'Harm', 'Helpful', 'Helpless', 'Hint', 'Hope', 'Horrible', 'Hurry', 'Ideas', 'Implore', 'Important', 'Incomplete', 'Information', 'Instruction', 'Liberty', 'Lies', 'Love', 'Malice', 'Masses', 'Mechanical', 'Message', 'Messy', 'Military', 'Misfortune', 'Mundane', 'Mysterious', 'Natural', 'Obscure', 'Odd', 'Oppose', 'Path', 'Peace', 'People', 'Place', 'Plans', 'Plot', 'Positive', 'Possessions', 'Power', 'Preventable', 'Reassuring', 'Riches', 'Riddle', 'Ruin', 'Scary', 'Simple', 'Strange', 'Struggle', 'Success', 'Suffering', 'Suppress', 'Tension', 'Threat', 'Time', 'Travel', 'Trouble', 'Trust', 'Uncertain', 'Unsettling', 'Violence', 'Warning', 'Weapon']));
var $author$project$Tables$askMythicElementsVisionsAndDreams = A2(
	$elm$random$Random$map,
	function (i) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Array$get, i, $author$project$Tables$mythicElementsVisionsAndDreams));
	},
	A2(
		$elm$random$Random$int,
		0,
		$elm$core$Array$length($author$project$Tables$mythicElementsVisionsAndDreams) - 1));
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$Tables$tables = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('Mythic 2e: Actions', $author$project$Tables$askMythicActions),
			_Utils_Tuple2('Mythic 2e: Descritions', $author$project$Tables$askMythicDescriptions),
			_Utils_Tuple2('Mythic 2e: Elements - Adventure Tone', $author$project$Tables$askMythicElementsAdventureTone),
			_Utils_Tuple2('Mythic 2e: Elements - Alien Species Descriptors', $author$project$Tables$askMythicElementsAlienSpeciesDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Animal Actions', $author$project$Tables$askMythicElementsAnimalActions),
			_Utils_Tuple2('Mythic 2e: Elements - Army Descriptors', $author$project$Tables$askMythicElementsArmyDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Cavern Descriptors', $author$project$Tables$askMythicElementsCavernDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Characters', $author$project$Tables$askMythicElementsCharacters),
			_Utils_Tuple2('Mythic 2e: Elements - Character Actions, Combat', $author$project$Tables$askMythicElementsCharacterActionsCombat),
			_Utils_Tuple2('Mythic 2e: Elements - Character Actions, General', $author$project$Tables$askMythicElementsCharacterActionsGeneral),
			_Utils_Tuple2('Mythic 2e: Elements - Character Appearance', $author$project$Tables$askMythicElementsCharacterAppearance),
			_Utils_Tuple2('Mythic 2e: Elements - Character Background', $author$project$Tables$askMythicElementsCharacterBackground),
			_Utils_Tuple2('Mythic 2e: Elements - Character Conversations', $author$project$Tables$askMythicElementsCharacterConversations),
			_Utils_Tuple2('Mythic 2e: Elements - Character Descriptors', $author$project$Tables$askMythicElementsCharacterDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Character Identity', $author$project$Tables$askMythicElementsCharacterIdentity),
			_Utils_Tuple2('Mythic 2e: Elements - Character Motivations', $author$project$Tables$askMythicElementsCharacterMotivations),
			_Utils_Tuple2('Mythic 2e: Elements - Character Personality', $author$project$Tables$askMythicElementsCharacterPersonality),
			_Utils_Tuple2('Mythic 2e: Elements - Character Skills', $author$project$Tables$askMythicElementsCharacterSkills),
			_Utils_Tuple2('Mythic 2e: Elements - Character Traits & Flaws', $author$project$Tables$askMythicElementsCharacterTraitsAndFlaws),
			_Utils_Tuple2('Mythic 2e: Elements - City Descriptors', $author$project$Tables$askMythicElementsCityDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Civilization Descriptors', $author$project$Tables$askMythicElementsCivilizationDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Creature Abilities', $author$project$Tables$askMythicElementsCreatureAbilities),
			_Utils_Tuple2('Mythic 2e: Elements - Creature Descriptors', $author$project$Tables$askMythicElementsCreatureDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Cryptic Message', $author$project$Tables$askMythicElementsCrypticMessage),
			_Utils_Tuple2('Mythic 2e: Elements - Curses', $author$project$Tables$askMythicElementsCurses),
			_Utils_Tuple2('Mythic 2e: Elements - Domicile Descriptors', $author$project$Tables$askMythicElementsDomicileDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Dungeon Descriptors', $author$project$Tables$askMythicElementsDungeonDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Dungeon Traps', $author$project$Tables$askMythicElementsDungeonTraps),
			_Utils_Tuple2('Mythic 2e: Elements - Forest Descriptors', $author$project$Tables$askMythicElementsForestDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Gods', $author$project$Tables$askMythicElementsGods),
			_Utils_Tuple2('Mythic 2e: Elements - Legends', $author$project$Tables$askMythicElementsLegends),
			_Utils_Tuple2('Mythic 2e: Elements - Locations', $author$project$Tables$askMythicElementsLocations),
			_Utils_Tuple2('Mythic 2e: Elements - Magic Item Descriptors', $author$project$Tables$askMythicElementsMagicItemDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Mutation Descriptors', $author$project$Tables$askMythicElementsMutationDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Names', $author$project$Tables$askMythicElementsNames),
			_Utils_Tuple2('Mythic 2e: Elements - Noble House', $author$project$Tables$askMythicElementsNobleHouse),
			_Utils_Tuple2('Mythic 2e: Elements - Objects', $author$project$Tables$askMythicElementsObjects),
			_Utils_Tuple2('Mythic 2e: Elements - Plot Twists', $author$project$Tables$askMythicElementsPlotTwists),
			_Utils_Tuple2('Mythic 2e: Elements - Powers', $author$project$Tables$askMythicElementsPowers),
			_Utils_Tuple2('Mythic 2e: Elements - Scavenging Results', $author$project$Tables$askMythicElementsScavengingResults),
			_Utils_Tuple2('Mythic 2e: Elements - Smells', $author$project$Tables$askMythicElementsSmells),
			_Utils_Tuple2('Mythic 2e: Elements - Sounds', $author$project$Tables$askMythicElementsSounds),
			_Utils_Tuple2('Mythic 2e: Elements - Spell Effects', $author$project$Tables$askMythicElementsSpellEffects),
			_Utils_Tuple2('Mythic 2e: Elements - Starship Descriptors', $author$project$Tables$askMythicElementsStarshipDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Terrain Descriptors', $author$project$Tables$askMythicElementsTerrainDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Undead Descriptors', $author$project$Tables$askMythicElementsUndeadDescriptors),
			_Utils_Tuple2('Mythic 2e: Elements - Visions & Dreams', $author$project$Tables$askMythicElementsVisionsAndDreams)
		]));
var $author$project$Main$defaults = function (theme) {
	return {
		x: '1',
		o: false,
		G: false,
		I: '3',
		u: 0,
		v: '6',
		r: A2(
			$elm$core$Maybe$withDefault,
			'',
			$elm$core$List$head(
				$elm$core$Dict$keys($author$project$Tables$tables))),
		s: theme,
		l: 0
	};
};
var $elm$random$Random$Generate = $elm$core$Basics$identity;
var $elm$random$Random$initialSeed = function (x) {
	var _v0 = $elm$random$Random$next(
		A2($elm$random$Random$Seed, 0, 1013904223));
	var state1 = _v0.a;
	var incr = _v0.b;
	var state2 = (state1 + x) >>> 0;
	return $elm$random$Random$next(
		A2($elm$random$Random$Seed, state2, incr));
};
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$random$Random$init = A2(
	$elm$core$Task$andThen,
	function (time) {
		return $elm$core$Task$succeed(
			$elm$random$Random$initialSeed(
				$elm$time$Time$posixToMillis(time)));
	},
	$elm$time$Time$now);
var $elm$random$Random$step = F2(
	function (_v0, seed) {
		var generator = _v0;
		return generator(seed);
	});
var $elm$random$Random$onEffects = F3(
	function (router, commands, seed) {
		if (!commands.b) {
			return $elm$core$Task$succeed(seed);
		} else {
			var generator = commands.a;
			var rest = commands.b;
			var _v1 = A2($elm$random$Random$step, generator, seed);
			var value = _v1.a;
			var newSeed = _v1.b;
			return A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$random$Random$onEffects, router, rest, newSeed);
				},
				A2($elm$core$Platform$sendToApp, router, value));
		}
	});
var $elm$random$Random$onSelfMsg = F3(
	function (_v0, _v1, seed) {
		return $elm$core$Task$succeed(seed);
	});
var $elm$random$Random$cmdMap = F2(
	function (func, _v0) {
		var generator = _v0;
		return A2($elm$random$Random$map, func, generator);
	});
_Platform_effectManagers['Random'] = _Platform_createManager($elm$random$Random$init, $elm$random$Random$onEffects, $elm$random$Random$onSelfMsg, $elm$random$Random$cmdMap);
var $elm$random$Random$command = _Platform_leaf('Random');
var $elm$random$Random$generate = F2(
	function (tagger, generator) {
		return $elm$random$Random$command(
			A2($elm$random$Random$map, tagger, generator));
	});
var $elm$time$Time$here = _Time_here(0);
var $author$project$Main$GotCatalog = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$http$Http$resolve = F2(
	function (toResult, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 2:
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 3:
				var metadata = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.bj));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					$elm$http$Http$BadBody,
					toResult(body));
		}
	});
var $elm$http$Http$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$elm$http$Http$resolve(
				function (string) {
					return A2(
						$elm$core$Result$mapError,
						$elm$json$Json$Decode$errorToString,
						A2($elm$json$Json$Decode$decodeString, decoder, string));
				}));
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {aJ: reqs, aO: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.aQ;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.aJ));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.aO)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					aW: r.aW,
					aY: r.aY,
					a1: A2(_Http_mapExpect, func, r.a1),
					aw: r.aw,
					a8: r.a8,
					bn: r.bn,
					aQ: r.aQ,
					bq: r.bq
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{aW: false, aY: r.aY, a1: r.a1, aw: r.aw, a8: r.a8, bn: r.bn, aQ: r.aQ, bq: r.bq}));
};
var $elm$http$Http$get = function (r) {
	return $elm$http$Http$request(
		{aY: $elm$http$Http$emptyBody, a1: r.a1, aw: _List_Nil, a8: 'GET', bn: $elm$core$Maybe$Nothing, aQ: $elm$core$Maybe$Nothing, bq: r.bq});
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $author$project$Main$iconsDecoder = A2(
	$elm$json$Json$Decode$map,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$Dict$toList,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$concatMap(
				function (_v0) {
					var size = _v0.a;
					var authors = _v0.b;
					return A2(
						$elm$core$List$concatMap,
						function (_v1) {
							var author = _v1.a;
							var icons = _v1.b;
							return A2(
								$elm$core$List$map,
								function (icon) {
									return './icons/ffffff/transparent/' + (size + ('/' + (author + ('/' + (icon + '.svg')))));
								},
								icons);
						},
						$elm$core$Dict$toList(authors));
				}),
			$elm$core$List$sort)),
	A2(
		$elm$json$Json$Decode$field,
		'icons',
		$elm$json$Json$Decode$dict(
			$elm$json$Json$Decode$dict(
				$elm$json$Json$Decode$list($elm$json$Json$Decode$string)))));
var $author$project$Main$loadCatalog = $elm$http$Http$get(
	{
		a1: A2($elm$http$Http$expectJson, $author$project$Main$GotCatalog, $author$project$Main$iconsDecoder),
		bq: './icons/icons.json'
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$Preferences = F9(
	function (tool, amount, sides, custom, explode, table, iconAmount, theme, resultMode) {
		return {x: amount, o: custom, G: explode, I: iconAmount, u: resultMode, v: sides, r: table, s: theme, l: tool};
	});
var $elm$json$Json$Decode$map8 = _Json_map8;
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $author$project$Main$IconTool = 2;
var $author$project$Main$WordTool = 1;
var $author$project$Main$toolFromName = function (name) {
	switch (name) {
		case 'words':
			return 1;
		case 'icons':
			return 2;
		default:
			return 0;
	}
};
var $author$project$Main$preferencesDecoder = function (initial) {
	var optional = F3(
		function (field, decoder_, fallback) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						A2($elm$json$Json$Decode$field, field, decoder_),
						$elm$json$Json$Decode$succeed(fallback)
					]));
		});
	var knownTable = function (name) {
		return A2($elm$core$Dict$member, name, $author$project$Tables$tables) ? name : initial.r;
	};
	return A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (withMode, mode) {
				return withMode(mode);
			}),
		A9(
			$elm$json$Json$Decode$map8,
			$author$project$Main$Preferences,
			A3(
				optional,
				'tool',
				A2($elm$json$Json$Decode$map, $author$project$Main$toolFromName, $elm$json$Json$Decode$string),
				initial.l),
			A3(optional, 'amount', $elm$json$Json$Decode$string, initial.x),
			A3(optional, 'sides', $elm$json$Json$Decode$string, initial.v),
			A3(optional, 'custom', $elm$json$Json$Decode$bool, initial.o),
			A3(optional, 'explode', $elm$json$Json$Decode$bool, initial.G),
			A3(
				optional,
				'table',
				A2($elm$json$Json$Decode$map, knownTable, $elm$json$Json$Decode$string),
				initial.r),
			A3(optional, 'iconAmount', $elm$json$Json$Decode$string, initial.I),
			A3(
				optional,
				'theme',
				A2($elm$json$Json$Decode$map, $author$project$Main$themeFromString, $elm$json$Json$Decode$string),
				initial.s)),
		$elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					$author$project$Main$resultModeDecoder,
					$elm$json$Json$Decode$succeed(initial.u)
				])));
};
var $author$project$Main$DiceResult = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$Main$IconResult = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$WordResult = function (a) {
	return {$: 1, a: a};
};
var $elm$random$Random$constant = function (value) {
	return function (seed) {
		return _Utils_Tuple2(value, seed);
	};
};
var $elm$random$Random$andThen = F2(
	function (callback, _v0) {
		var genA = _v0;
		return function (seed) {
			var _v1 = genA(seed);
			var result = _v1.a;
			var newSeed = _v1.b;
			var _v2 = callback(result);
			var genB = _v2;
			return genB(newSeed);
		};
	});
var $author$project$Main$explosiveDieRoll = function (sides) {
	return A2(
		$elm$random$Random$andThen,
		function (roll) {
			return ((sides > 1) && _Utils_eq(roll, sides)) ? A2(
				$elm$random$Random$map,
				$elm$core$List$cons(roll),
				$author$project$Main$explosiveDieRoll(sides)) : $elm$random$Random$constant(
				_List_fromArray(
					[roll]));
		},
		A2($elm$random$Random$int, 1, sides));
};
var $elm$random$Random$listHelp = F4(
	function (revList, n, gen, seed) {
		listHelp:
		while (true) {
			if (n < 1) {
				return _Utils_Tuple2(revList, seed);
			} else {
				var _v0 = gen(seed);
				var value = _v0.a;
				var newSeed = _v0.b;
				var $temp$revList = A2($elm$core$List$cons, value, revList),
					$temp$n = n - 1,
					$temp$gen = gen,
					$temp$seed = newSeed;
				revList = $temp$revList;
				n = $temp$n;
				gen = $temp$gen;
				seed = $temp$seed;
				continue listHelp;
			}
		}
	});
var $elm$random$Random$list = F2(
	function (n, _v0) {
		var gen = _v0;
		return function (seed) {
			return A4($elm$random$Random$listHelp, _List_Nil, n, gen, seed);
		};
	});
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Main$recordAction = F3(
	function (action, timestamp, model) {
		var recorded = {g: action, k: timestamp};
		var generate = F2(
			function (generator, toResult) {
				var _v1 = A2($elm$random$Random$step, generator, model.D);
				var value = _v1.a;
				var next = _v1.b;
				return _Utils_update(
					model,
					{
						h: A2($elm$core$List$cons, recorded, model.h),
						i: A2(
							$elm$core$List$cons,
							{
								g: action,
								ab: toResult(value),
								k: timestamp
							},
							model.i),
						D: next
					});
			});
		switch (action.$) {
			case 0:
				var sides = action.a;
				var amount = action.b;
				var explode = action.c;
				var resultMode = action.d;
				return A2(
					generate,
					A2(
						$elm$random$Random$list,
						amount,
						explode ? $author$project$Main$explosiveDieRoll(sides) : A2(
							$elm$random$Random$map,
							$elm$core$List$singleton,
							A2($elm$random$Random$int, 1, sides))),
					$author$project$Main$DiceResult(resultMode));
			case 1:
				var name = action.a;
				return A2(
					generate,
					A2(
						$elm$core$Maybe$withDefault,
						$elm$random$Random$constant('Table not found'),
						A2($elm$core$Dict$get, name, $author$project$Tables$tables)),
					$author$project$Main$WordResult);
			case 2:
				var amount = action.a;
				return A2(
					generate,
					A2(
						$elm$random$Random$list,
						amount,
						A2($elm$random$Random$int, 0, model.U - 1)),
					$author$project$Main$IconResult);
			case 3:
				return _Utils_update(
					model,
					{
						h: A2($elm$core$List$cons, recorded, model.h),
						i: _List_Nil
					});
			default:
				var value = action.a;
				return _Utils_update(
					model,
					{
						h: A2($elm$core$List$cons, recorded, model.h),
						D: $elm$random$Random$initialSeed(value)
					});
		}
	});
var $author$project$Main$sessionSeed = A2($elm$random$Random$int, 1, 2147483646);
var $author$project$Main$startSeed = F2(
	function (value, model) {
		return _Utils_update(
			model,
			{
				D: $elm$random$Random$initialSeed(value),
				W: true,
				ad: value
			});
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Main$stateParameter = function (url) {
	return A2(
		$elm$core$Maybe$andThen,
		A2(
			$elm$core$Basics$composeR,
			$elm$core$String$split('&'),
			A2(
				$elm$core$Basics$composeR,
				$elm$core$List$filter(
					$elm$core$String$startsWith('state=')),
				A2(
					$elm$core$Basics$composeR,
					$elm$core$List$head,
					$elm$core$Maybe$map(
						$elm$core$String$dropLeft(6))))),
		url.bf);
};
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Main$init = F3(
	function (flags, url, _v0) {
		var shared = $author$project$Main$stateParameter(url);
		var fromFlags = F2(
			function (field, decoder_) {
				return $elm$core$Result$toMaybe(
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2($elm$json$Json$Decode$field, field, decoder_),
						flags));
			});
		var inCopy = A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(fromFlags, 'copy', $elm$json$Json$Decode$bool));
		var stored = A2(fromFlags, 'session', $author$project$Main$savedStateDecoder);
		var _v1 = function () {
			if (!shared.$) {
				var token = shared.a;
				return _Utils_Tuple3(
					2,
					$author$project$Main$decodeStateFromString(token),
					$elm$core$Maybe$Just($author$project$Main$InvalidLink));
			} else {
				return inCopy ? _Utils_Tuple3(
					1,
					stored,
					$elm$core$Maybe$Just($author$project$Main$MissingCopy)) : _Utils_Tuple3(0, stored, $elm$core$Maybe$Nothing);
			}
		}();
		var session = _v1.a;
		var selected = _v1.b;
		var missing = _v1.c;
		var _v3 = function () {
			if (!selected.$) {
				if (!selected.a.$) {
					var state = selected.a.a;
					return _Utils_Tuple2(
						$elm$core$Maybe$Just(state),
						$elm$core$Maybe$Nothing);
				} else {
					var storedVersion = selected.a.a;
					return _Utils_Tuple2(
						$elm$core$Maybe$Nothing,
						$elm$core$Maybe$Just(
							$author$project$Main$NewerFormat(storedVersion)));
				}
			} else {
				return _Utils_Tuple2($elm$core$Maybe$Nothing, missing);
			}
		}();
		var saved = _v3.a;
		var problem = _v3.b;
		var seedCommand = (_Utils_eq(saved, $elm$core$Maybe$Nothing) && _Utils_eq(problem, $elm$core$Maybe$Nothing)) ? A2($elm$random$Random$generate, $author$project$Main$SeedGenerated, $author$project$Main$sessionSeed) : $elm$core$Platform$Cmd$none;
		var startPreferences = $author$project$Main$defaults(
			A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(
					$elm$core$Maybe$map,
					function ($) {
						return $.s;
					},
					saved)));
		var preferences = A2(
			$elm$core$Maybe$withDefault,
			startPreferences,
			A2(
				fromFlags,
				'preferences',
				$author$project$Main$preferencesDecoder(startPreferences)));
		var initial = {
			h: _List_Nil,
			z: $author$project$Main$CatalogLoading,
			T: $elm$core$Maybe$Nothing,
			i: _List_Nil,
			U: A2(
				$elm$core$Maybe$withDefault,
				0,
				A2(fromFlags, 'iconCount', $elm$json$Json$Decode$int)),
			c: preferences,
			C: problem,
			ac: $elm$core$Maybe$Nothing,
			D: $elm$random$Random$initialSeed(0),
			W: false,
			ad: 0,
			O: session,
			al: A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(fromFlags, 'shareBase', $elm$json$Json$Decode$string)),
			X: '',
			E: false,
			Q: '',
			L: false,
			ae: $elm$time$Time$utc
		};
		var model = function () {
			if (!saved.$) {
				var state = saved.a;
				return A3(
					$elm$core$List$foldl,
					function (item) {
						return A2($author$project$Main$recordAction, item.g, item.k);
					},
					A2($author$project$Main$startSeed, state.D, initial),
					state.h);
			} else {
				return initial;
			}
		}();
		return _Utils_Tuple2(
			model,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						seedCommand,
						$author$project$Main$loadCatalog,
						A2($elm$core$Task$perform, $author$project$Main$GotZone, $elm$time$Time$here)
					])));
	});
var $author$project$Main$storageIssue = _Platform_incomingPort('storageIssue', $elm$json$Json$Decode$string);
var $author$project$Main$CatalogFailed = {$: 2};
var $author$project$Main$CatalogReady = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$SeedCleared = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$SetPreferences = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Main$canEdit = function (model) {
	return (model.O !== 2) && (_Utils_eq(model.C, $elm$core$Maybe$Nothing) && model.W);
};
var $author$project$Main$iconAvailable = function (model) {
	var _v0 = model.z;
	if (_v0.$ === 1) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Main$allowed = F2(
	function (model, action) {
		return $author$project$Main$canEdit(model) && function () {
			if (action.$ === 2) {
				return $author$project$Main$iconAvailable(model);
			} else {
				return true;
			}
		}();
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$setDialog = _Platform_outgoingPort(
	'setDialog',
	function ($) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'id',
					$elm$json$Json$Encode$string($.ag)),
					_Utils_Tuple2(
					'visible',
					$elm$json$Json$Encode$bool($.ao))
				]));
	});
var $author$project$Main$closeDialog = function (id_) {
	return $author$project$Main$setDialog(
		{ag: id_, ao: false});
};
var $author$project$Main$copyToClipboard = _Platform_outgoingPort('copyToClipboard', $elm$json$Json$Encode$string);
var $author$project$Main$createCopy = _Platform_outgoingPort('createCopy', $elm$core$Basics$identity);
var $truqu$elm_base64$Base64$Encode$intToBase64 = function (i) {
	switch (i) {
		case 0:
			return 'A';
		case 1:
			return 'B';
		case 2:
			return 'C';
		case 3:
			return 'D';
		case 4:
			return 'E';
		case 5:
			return 'F';
		case 6:
			return 'G';
		case 7:
			return 'H';
		case 8:
			return 'I';
		case 9:
			return 'J';
		case 10:
			return 'K';
		case 11:
			return 'L';
		case 12:
			return 'M';
		case 13:
			return 'N';
		case 14:
			return 'O';
		case 15:
			return 'P';
		case 16:
			return 'Q';
		case 17:
			return 'R';
		case 18:
			return 'S';
		case 19:
			return 'T';
		case 20:
			return 'U';
		case 21:
			return 'V';
		case 22:
			return 'W';
		case 23:
			return 'X';
		case 24:
			return 'Y';
		case 25:
			return 'Z';
		case 26:
			return 'a';
		case 27:
			return 'b';
		case 28:
			return 'c';
		case 29:
			return 'd';
		case 30:
			return 'e';
		case 31:
			return 'f';
		case 32:
			return 'g';
		case 33:
			return 'h';
		case 34:
			return 'i';
		case 35:
			return 'j';
		case 36:
			return 'k';
		case 37:
			return 'l';
		case 38:
			return 'm';
		case 39:
			return 'n';
		case 40:
			return 'o';
		case 41:
			return 'p';
		case 42:
			return 'q';
		case 43:
			return 'r';
		case 44:
			return 's';
		case 45:
			return 't';
		case 46:
			return 'u';
		case 47:
			return 'v';
		case 48:
			return 'w';
		case 49:
			return 'x';
		case 50:
			return 'y';
		case 51:
			return 'z';
		case 52:
			return '0';
		case 53:
			return '1';
		case 54:
			return '2';
		case 55:
			return '3';
		case 56:
			return '4';
		case 57:
			return '5';
		case 58:
			return '6';
		case 59:
			return '7';
		case 60:
			return '8';
		case 61:
			return '9';
		case 62:
			return '+';
		default:
			return '/';
	}
};
var $truqu$elm_base64$Base64$Encode$toBase64 = function (_int) {
	return _Utils_ap(
		$truqu$elm_base64$Base64$Encode$intToBase64(63 & (_int >>> 18)),
		_Utils_ap(
			$truqu$elm_base64$Base64$Encode$intToBase64(63 & (_int >>> 12)),
			_Utils_ap(
				$truqu$elm_base64$Base64$Encode$intToBase64(63 & (_int >>> 6)),
				$truqu$elm_base64$Base64$Encode$intToBase64(63 & (_int >>> 0)))));
};
var $truqu$elm_base64$Base64$Encode$add = F2(
	function (_char, _v0) {
		var res = _v0.a;
		var count = _v0.b;
		var acc = _v0.c;
		var current = (acc << 8) | _char;
		if (count === 2) {
			return _Utils_Tuple3(
				_Utils_ap(
					res,
					$truqu$elm_base64$Base64$Encode$toBase64(current)),
				0,
				0);
		} else {
			return _Utils_Tuple3(res, count + 1, current);
		}
	});
var $truqu$elm_base64$Base64$Encode$chomp = F2(
	function (char_, acc) {
		var _char = $elm$core$Char$toCode(char_);
		return (_char < 128) ? A2($truqu$elm_base64$Base64$Encode$add, _char, acc) : ((_char < 2048) ? A2(
			$truqu$elm_base64$Base64$Encode$add,
			128 | (63 & _char),
			A2($truqu$elm_base64$Base64$Encode$add, 192 | (_char >>> 6), acc)) : (((_char < 55296) || ((_char >= 57344) && (_char <= 65535))) ? A2(
			$truqu$elm_base64$Base64$Encode$add,
			128 | (63 & _char),
			A2(
				$truqu$elm_base64$Base64$Encode$add,
				128 | (63 & (_char >>> 6)),
				A2($truqu$elm_base64$Base64$Encode$add, 224 | (_char >>> 12), acc))) : A2(
			$truqu$elm_base64$Base64$Encode$add,
			128 | (63 & _char),
			A2(
				$truqu$elm_base64$Base64$Encode$add,
				128 | (63 & (_char >>> 6)),
				A2(
					$truqu$elm_base64$Base64$Encode$add,
					128 | (63 & (_char >>> 12)),
					A2($truqu$elm_base64$Base64$Encode$add, 240 | (_char >>> 18), acc))))));
	});
var $truqu$elm_base64$Base64$Encode$initial = _Utils_Tuple3('', 0, 0);
var $truqu$elm_base64$Base64$Encode$wrapUp = function (_v0) {
	var res = _v0.a;
	var cnt = _v0.b;
	var acc = _v0.c;
	switch (cnt) {
		case 1:
			return res + ($truqu$elm_base64$Base64$Encode$intToBase64(63 & (acc >>> 2)) + ($truqu$elm_base64$Base64$Encode$intToBase64(63 & (acc << 4)) + '=='));
		case 2:
			return res + ($truqu$elm_base64$Base64$Encode$intToBase64(63 & (acc >>> 10)) + ($truqu$elm_base64$Base64$Encode$intToBase64(63 & (acc >>> 4)) + ($truqu$elm_base64$Base64$Encode$intToBase64(63 & (acc << 2)) + '=')));
		default:
			return res;
	}
};
var $truqu$elm_base64$Base64$Encode$encode = function (input) {
	return $truqu$elm_base64$Base64$Encode$wrapUp(
		A3($elm$core$String$foldl, $truqu$elm_base64$Base64$Encode$chomp, $truqu$elm_base64$Base64$Encode$initial, input));
};
var $truqu$elm_base64$Base64$encode = $truqu$elm_base64$Base64$Encode$encode;
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Main$resultModeName = function (mode) {
	return A2(
		$elm$core$Maybe$withDefault,
		'All',
		A2(
			$elm$core$Maybe$map,
			$elm$core$Tuple$second,
			A2(
				$elm_community$list_extra$List$Extra$find,
				function (_v0) {
					var choice = _v0.a;
					return _Utils_eq(choice, mode);
				},
				$author$project$Main$resultModes)));
};
var $author$project$Main$actionEncoder = function (recorded) {
	var _v0 = recorded.g;
	switch (_v0.$) {
		case 0:
			var sides = _v0.a;
			var amount = _v0.b;
			var explode = _v0.c;
			var resultMode = _v0.d;
			return $elm$json$Json$Encode$object(
				_Utils_ap(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'tag',
							$elm$json$Json$Encode$string('roll')),
							_Utils_Tuple2(
							'sides',
							$elm$json$Json$Encode$int(sides)),
							_Utils_Tuple2(
							'amount',
							$elm$json$Json$Encode$int(amount)),
							_Utils_Tuple2(
							'explode',
							$elm$json$Json$Encode$bool(explode)),
							_Utils_Tuple2(
							'ts',
							$elm$json$Json$Encode$int(
								$elm$time$Time$posixToMillis(recorded.k)))
						]),
					(!resultMode) ? _List_Nil : _List_fromArray(
						[
							_Utils_Tuple2(
							'resultMode',
							$elm$json$Json$Encode$string(
								$elm$core$String$toLower(
									$author$project$Main$resultModeName(resultMode))))
						])));
		case 1:
			var table = _v0.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'tag',
						$elm$json$Json$Encode$string('ask')),
						_Utils_Tuple2(
						'table',
						$elm$json$Json$Encode$string(table)),
						_Utils_Tuple2(
						'ts',
						$elm$json$Json$Encode$int(
							$elm$time$Time$posixToMillis(recorded.k)))
					]));
		case 2:
			var iconAmount = _v0.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'tag',
						$elm$json$Json$Encode$string('show')),
						_Utils_Tuple2(
						'iconAmount',
						$elm$json$Json$Encode$int(iconAmount)),
						_Utils_Tuple2(
						'ts',
						$elm$json$Json$Encode$int(
							$elm$time$Time$posixToMillis(recorded.k)))
					]));
		case 3:
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'tag',
						$elm$json$Json$Encode$string('clear')),
						_Utils_Tuple2(
						'ts',
						$elm$json$Json$Encode$int(
							$elm$time$Time$posixToMillis(recorded.k)))
					]));
		default:
			var value = _v0.a;
			return $elm$json$Json$Encode$object(
				_List_fromArray(
					[
						_Utils_Tuple2(
						'tag',
						$elm$json$Json$Encode$string('resetSeed')),
						_Utils_Tuple2(
						'value',
						$elm$json$Json$Encode$int(value)),
						_Utils_Tuple2(
						'ts',
						$elm$json$Json$Encode$int(
							$elm$time$Time$posixToMillis(recorded.k)))
					]));
	}
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $author$project$Main$themeToString = function (themeMode) {
	switch (themeMode) {
		case 0:
			return 'auto';
		case 1:
			return 'light';
		default:
			return 'dark';
	}
};
var $author$project$Main$encode = function (model) {
	var usesResultMode = function (item) {
		var _v0 = item.g;
		if (!_v0.$) {
			var mode = _v0.d;
			return !(!mode);
		} else {
			return false;
		}
	};
	var format = A2($elm$core$List$any, usesResultMode, model.h) ? $author$project$Main$schemaVersion : 1;
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'version',
				$elm$json$Json$Encode$int(format)),
				_Utils_Tuple2(
				'seed',
				$elm$json$Json$Encode$int(model.ad)),
				_Utils_Tuple2(
				'actions',
				A2(
					$elm$json$Json$Encode$list,
					$author$project$Main$actionEncoder,
					$elm$core$List$reverse(model.h))),
				_Utils_Tuple2(
				'theme',
				$elm$json$Json$Encode$string(
					$author$project$Main$themeToString(model.c.s)))
			]));
};
var $author$project$Main$toolName = function (tool) {
	switch (tool) {
		case 0:
			return 'dice';
		case 1:
			return 'words';
		default:
			return 'icons';
	}
};
var $author$project$Main$encodePreferences = function (prefs) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'tool',
				$elm$json$Json$Encode$string(
					$author$project$Main$toolName(prefs.l))),
				_Utils_Tuple2(
				'amount',
				$elm$json$Json$Encode$string(prefs.x)),
				_Utils_Tuple2(
				'sides',
				$elm$json$Json$Encode$string(prefs.v)),
				_Utils_Tuple2(
				'custom',
				$elm$json$Json$Encode$bool(prefs.o)),
				_Utils_Tuple2(
				'explode',
				$elm$json$Json$Encode$bool(prefs.G)),
				_Utils_Tuple2(
				'table',
				$elm$json$Json$Encode$string(prefs.r)),
				_Utils_Tuple2(
				'iconAmount',
				$elm$json$Json$Encode$string(prefs.I)),
				_Utils_Tuple2(
				'theme',
				$elm$json$Json$Encode$string(
					$author$project$Main$themeToString(prefs.s))),
				_Utils_Tuple2(
				'resultMode',
				$elm$json$Json$Encode$string(
					$elm$core$String$toLower(
						$author$project$Main$resultModeName(prefs.u))))
			]));
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$Task$onError = _Scheduler_onError;
var $elm$core$Task$attempt = F2(
	function (resultToMessage, task) {
		return $elm$core$Task$command(
			A2(
				$elm$core$Task$onError,
				A2(
					$elm$core$Basics$composeL,
					A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
					$elm$core$Result$Err),
				A2(
					$elm$core$Task$andThen,
					A2(
						$elm$core$Basics$composeL,
						A2($elm$core$Basics$composeL, $elm$core$Task$succeed, resultToMessage),
						$elm$core$Result$Ok),
					task)));
	});
var $elm$browser$Browser$Dom$focus = _Browser_call('focus');
var $author$project$Main$focus = function (target) {
	return A2(
		$elm$core$Task$attempt,
		function (_v0) {
			return $author$project$Main$NoOp;
		},
		$elm$browser$Browser$Dom$focus(target));
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$core$Basics$not = _Basics_not;
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$Main$ownSession = _Platform_outgoingPort(
	'ownSession',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $author$project$Main$positiveInt = function (value) {
	return A2(
		$elm$core$Maybe$andThen,
		function (number) {
			return ((number > 0) && (number <= 2147483647)) ? $elm$core$Maybe$Just(number) : $elm$core$Maybe$Nothing;
		},
		$elm$core$String$toInt(value));
};
var $author$project$Main$Record = F3(
	function (a, b, c) {
		return {$: 6, a: a, b: b, c: c};
	});
var $author$project$Main$recordNow = F2(
	function (scrollToResult, action) {
		return A2(
			$elm$core$Task$perform,
			A2($author$project$Main$Record, action, scrollToResult),
			$elm$time$Time$now);
	});
var $author$project$Main$reloadApp = _Platform_outgoingPort(
	'reloadApp',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Main$saveSession = _Platform_outgoingPort('saveSession', $elm$core$Basics$identity);
var $author$project$Main$save = function (model) {
	return $author$project$Main$canEdit(model) ? $author$project$Main$saveSession(
		$author$project$Main$encode(model)) : $elm$core$Platform$Cmd$none;
};
var $author$project$Main$savePreferences = _Platform_outgoingPort('savePreferences', $elm$core$Basics$identity);
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.aH;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.av,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.bf,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.aE,
					_Utils_ap(http, url.ay)),
				url.aC)));
};
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $author$project$Main$toolAction = function (prefs) {
	var _v0 = prefs.l;
	switch (_v0) {
		case 0:
			return A3(
				$elm$core$Maybe$map2,
				F2(
					function (sides, amount) {
						return A4($author$project$Main$RollAction, sides, amount, prefs.G, prefs.u);
					}),
				$author$project$Main$positiveInt(prefs.v),
				$author$project$Main$positiveInt(prefs.x));
		case 1:
			return $elm$core$Maybe$Just(
				$author$project$Main$AskAction(prefs.r));
		default:
			return A2(
				$elm$core$Maybe$map,
				$author$project$Main$ShowAction,
				$author$project$Main$positiveInt(prefs.I));
	}
};
var $author$project$Main$toolTabId = function (tool) {
	return 'tool-tab-' + $author$project$Main$toolName(tool);
};
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var response = msg.a;
				var catalog = function () {
					if (!response.$) {
						var paths = response.a;
						return ((model.U > 0) && _Utils_eq(
							$elm$core$List$length(paths),
							model.U)) ? $author$project$Main$CatalogReady(
							$elm$core$Array$fromList(paths)) : $author$project$Main$CatalogFailed;
					} else {
						return $author$project$Main$CatalogFailed;
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{z: catalog}),
					$elm$core$Platform$Cmd$none);
			case 1:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{z: $author$project$Main$CatalogLoading}),
					$author$project$Main$loadCatalog);
			case 2:
				var preferences = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{c: preferences, L: false}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$savePreferences(
								$author$project$Main$encodePreferences(preferences)),
								((!preferences.l) && (preferences.o && (!model.c.o))) ? $author$project$Main$focus('dice-sides') : $elm$core$Platform$Cmd$none
							])));
			case 3:
				var tool = msg.a;
				var prefs = model.c;
				var _v2 = A2(
					$author$project$Main$update,
					$author$project$Main$SetPreferences(
						_Utils_update(
							prefs,
							{l: tool})),
					model);
				var updated = _v2.a;
				var savePrefs = _v2.b;
				return _Utils_Tuple2(
					updated,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								savePrefs,
								$author$project$Main$focus(
								$author$project$Main$toolTabId(tool))
							])));
			case 4:
				var _v3 = $author$project$Main$toolAction(model.c);
				if (!_v3.$) {
					var action = _v3.a;
					return _Utils_Tuple2(
						model,
						A2($author$project$Main$allowed, model, action) ? A2($author$project$Main$recordNow, false, action) : $elm$core$Platform$Cmd$none);
				} else {
					var prefs = model.c;
					var invalidField = (prefs.l === 2) ? 'icon-amount' : (_Utils_eq(
						$author$project$Main$positiveInt(prefs.x),
						$elm$core$Maybe$Nothing) ? 'dice-amount' : 'dice-sides');
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{L: true}),
						$author$project$Main$focus(invalidField));
				}
			case 5:
				var action = msg.a;
				return _Utils_Tuple2(
					model,
					A2($author$project$Main$allowed, model, action) ? A2($author$project$Main$recordNow, true, action) : $elm$core$Platform$Cmd$none);
			case 6:
				var action = msg.a;
				var focusResult = msg.b;
				var timestamp = msg.c;
				if (A2($author$project$Main$allowed, model, action)) {
					var updated = A3($author$project$Main$recordAction, action, timestamp, model);
					return _Utils_Tuple2(
						updated,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Main$save(updated),
									focusResult ? $author$project$Main$focus('latest-result') : $elm$core$Platform$Cmd$none
								])));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 7:
				var value = msg.a;
				var updated = A2($author$project$Main$startSeed, value, model);
				return _Utils_Tuple2(
					updated,
					$author$project$Main$save(updated));
			case 8:
				var value = msg.a;
				var updated = A2(
					$author$project$Main$startSeed,
					value,
					_Utils_update(
						model,
						{h: _List_Nil, i: _List_Nil, C: $elm$core$Maybe$Nothing, E: false}));
				return _Utils_Tuple2(
					updated,
					$author$project$Main$save(updated));
			case 9:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{E: !model.E}),
					$elm$core$Platform$Cmd$none);
			case 10:
				var query = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Q: query}),
					$elm$core$Platform$Cmd$none);
			case 11:
				var table = msg.a;
				var prefs = model.c;
				var updated = _Utils_update(
					prefs,
					{r: table});
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{c: updated}),
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$closeDialog('table-dialog'),
								$author$project$Main$savePreferences(
								$author$project$Main$encodePreferences(updated))
							])));
			case 12:
				var id_ = msg.a;
				var prepared = (id_ === 'share-dialog') ? _Utils_update(
					model,
					{
						T: $elm$core$Maybe$Nothing,
						X: model.al + ('?state=' + $elm$url$Url$percentEncode(
							$truqu$elm_base64$Base64$encode(
								A2(
									$elm$json$Json$Encode$encode,
									0,
									$author$project$Main$encode(model)))))
					}) : _Utils_update(
					model,
					{Q: ''});
				return _Utils_Tuple2(
					prepared,
					$author$project$Main$setDialog(
						{ag: id_, ao: true}));
			case 13:
				var id_ = msg.a;
				return _Utils_Tuple2(
					model,
					$author$project$Main$closeDialog(id_));
			case 14:
				return _Utils_Tuple2(
					model,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$closeDialog('clear-dialog'),
								A2($elm$random$Random$generate, $author$project$Main$SeedCleared, $author$project$Main$sessionSeed)
							])));
			case 15:
				return _Utils_Tuple2(
					model,
					$author$project$Main$copyToClipboard(model.X));
			case 16:
				var result = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							T: $elm$core$Maybe$Just(result)
						}),
					$elm$core$Platform$Cmd$none);
			case 17:
				return _Utils_Tuple2(
					model,
					$author$project$Main$createCopy(
						$author$project$Main$encode(model)));
			case 18:
				var reason = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ac: $elm$core$Maybe$Just(reason)
						}),
					$elm$core$Platform$Cmd$none);
			case 19:
				return _Utils_Tuple2(
					model,
					$author$project$Main$ownSession(0));
			case 20:
				return _Utils_Tuple2(
					model,
					$author$project$Main$reloadApp(0));
			case 21:
				var zone = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ae: zone}),
					$elm$core$Platform$Cmd$none);
			case 22:
				var request = msg.a;
				if (!request.$) {
					var url = request.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(
							$elm$url$Url$toString(url)));
				} else {
					var url = request.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(url));
				}
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$tools = _List_fromArray(
	[
		_Utils_Tuple2(0, 'Dice'),
		_Utils_Tuple2(1, 'Words'),
		_Utils_Tuple2(2, 'Pictograms')
	]);
var $author$project$Main$version = '0.9.0';
var $author$project$Main$CloseDialog = function (a) {
	return {$: 13, a: a};
};
var $author$project$Main$ConfirmClear = {$: 14};
var $elm$html$Html$button = _VirtualDom_node('button');
var $author$project$Main$countLabel = F2(
	function (amount, name) {
		return $elm$core$String$fromInt(amount) + (' ' + (name + ((amount === 1) ? '' : 's')));
	});
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Main$viewClearDialog = function (model) {
	var replacingNewer = !_Utils_eq(model.C, $elm$core$Maybe$Nothing);
	return A3(
		$elm$html$Html$node,
		'dialog',
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('clear-dialog'),
				$elm$html$Html$Attributes$class('dialog'),
				A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'clear-dialog-title'),
				A2($elm$html$Html$Attributes$attribute, 'aria-describedby', 'clear-dialog-description')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('clear-dialog-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						replacingNewer ? 'Start a new session?' : 'Clear history?')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('clear-dialog-description')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						replacingNewer ? 'This will replace the session stored in this browser.' : ('This will remove ' + (A2(
							$author$project$Main$countLabel,
							$elm$core$List$length(model.i),
							'result') + ' and start a new sequence.')))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dialog-actions')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('button'),
								$elm$html$Html$Attributes$class('secondary'),
								A2($elm$html$Html$Attributes$attribute, 'autofocus', ''),
								$elm$html$Html$Events$onClick(
								$author$project$Main$CloseDialog('clear-dialog'))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Cancel')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('button'),
								$elm$html$Html$Attributes$class('danger'),
								$elm$html$Html$Events$onClick($author$project$Main$ConfirmClear)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								replacingNewer ? 'Start new session' : 'Clear history')
							]))
					]))
			]));
};
var $author$project$Main$OpenDialog = function (a) {
	return {$: 12, a: a};
};
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$html$Html$details = _VirtualDom_node('details');
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$header = _VirtualDom_node('header');
var $elm$html$Html$Attributes$height = function (n) {
	return A2(
		_VirtualDom_attribute,
		'height',
		$elm$core$String$fromInt(n));
};
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$html$Html$small = _VirtualDom_node('small');
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $elm$html$Html$summary = _VirtualDom_node('summary');
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$viewTheme = function (prefs) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('field')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$label,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$for('theme')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Theme')
					])),
				A2(
				$elm$html$Html$select,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('theme'),
						$elm$html$Html$Events$onInput(
						function (value) {
							return $author$project$Main$SetPreferences(
								_Utils_update(
									prefs,
									{
										s: $author$project$Main$themeFromString(value)
									}));
						})
					]),
				A2(
					$elm$core$List$map,
					function (_v0) {
						var theme = _v0.a;
						var name = _v0.b;
						return A2(
							$elm$html$Html$option,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$value(
									$author$project$Main$themeToString(theme)),
									$elm$html$Html$Attributes$selected(
									_Utils_eq(theme, prefs.s))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(name)
								]));
					},
					_List_fromArray(
						[
							_Utils_Tuple2(0, 'System'),
							_Utils_Tuple2(1, 'Light'),
							_Utils_Tuple2(2, 'Dark')
						])))
			]));
};
var $elm$html$Html$Attributes$width = function (n) {
	return A2(
		_VirtualDom_attribute,
		'width',
		$elm$core$String$fromInt(n));
};
var $author$project$Main$viewHeader = function (model) {
	return A2(
		$elm$html$Html$header,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('topbar')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('topbar-inner')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('brand')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$img,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('brand-icon'),
										$elm$html$Html$Attributes$src('favicon-32x32.png'),
										$elm$html$Html$Attributes$alt(''),
										$elm$html$Html$Attributes$width(32),
										$elm$html$Html$Attributes$height(32)
									]),
								_List_Nil),
								A2(
								$elm$html$Html$h1,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Dice Roller')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('header-actions')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('button'),
										$elm$html$Html$Attributes$class('secondary'),
										$elm$html$Html$Events$onClick(
										$author$project$Main$OpenDialog('share-dialog')),
										$elm$html$Html$Attributes$disabled(
										(!model.W) || (!_Utils_eq(model.C, $elm$core$Maybe$Nothing)))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Share')
									])),
								A2(
								$elm$html$Html$details,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('session-menu')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$summary,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Session')
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('session-menu-content')
											]),
										_List_fromArray(
											[
												$author$project$Main$viewTheme(model.c),
												$author$project$Main$canEdit(model) ? A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$type_('button'),
														$elm$html$Html$Attributes$class('menu-action'),
														$elm$html$Html$Events$onClick(
														$author$project$Main$OpenDialog('clear-dialog'))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Clear history…')
													])) : $elm$html$Html$text(''),
												A2(
												$elm$html$Html$small,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('muted')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Version ' + $author$project$Main$version)
													]))
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Main$ToggleHistory = {$: 9};
var $elm$html$Html$aside = _VirtualDom_node('aside');
var $author$project$Main$boolString = function (value_) {
	return value_ ? 'true' : 'false';
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Main$Repeat = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$diceNotation = F3(
	function (sides, amount, explode) {
		return $elm$core$String$fromInt(amount) + ('d' + ($elm$core$String$fromInt(sides) + (explode ? '!' : '')));
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$Main$tableName = function (name) {
	return A3(
		$elm$core$String$replace,
		'Descritions',
		'Descriptions',
		A3(
			$elm$core$String$replace,
			'Mythic 2e: ',
			'',
			A3($elm$core$String$replace, 'Mythic 2e: Elements - ', '', name)));
};
var $author$project$Main$actionLabel = function (action) {
	switch (action.$) {
		case 0:
			var sides = action.a;
			var amount = action.b;
			var explode = action.c;
			var mode = action.d;
			return _Utils_ap(
				(!mode) ? '' : ($author$project$Main$resultModeName(mode) + ' '),
				A3($author$project$Main$diceNotation, sides, amount, explode));
		case 1:
			var name = action.a;
			return $author$project$Main$tableName(name);
		case 2:
			var amount = action.a;
			return A2($author$project$Main$countLabel, amount, 'pictogram');
		case 3:
			return 'Clear history';
		default:
			return 'Reset seed';
	}
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.am, posixMinutes) < 0) {
					return posixMinutes + era.aB;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		as: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		aA: month,
		aV: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).as;
	});
var $elm$core$Basics$modBy = _Basics_modBy;
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $elm$time$Time$Apr = 3;
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Jan = 0;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $elm$time$Time$Mar = 2;
var $elm$time$Time$May = 4;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Oct = 9;
var $elm$time$Time$Sep = 8;
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).aA;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $elm$time$Time$toSecond = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				1000));
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).aV;
	});
var $author$project$Main$formatTimestamp = F2(
	function (zone, posix) {
		var year = $elm$core$String$fromInt(
			A2($elm$time$Time$toYear, zone, posix));
		var second = A3(
			$elm$core$String$padLeft,
			2,
			'0',
			$elm$core$String$fromInt(
				A2($elm$time$Time$toSecond, zone, posix)));
		var month = function (m) {
			switch (m) {
				case 0:
					return '01';
				case 1:
					return '02';
				case 2:
					return '03';
				case 3:
					return '04';
				case 4:
					return '05';
				case 5:
					return '06';
				case 6:
					return '07';
				case 7:
					return '08';
				case 8:
					return '09';
				case 9:
					return '10';
				case 10:
					return '11';
				default:
					return '12';
			}
		}(
			A2($elm$time$Time$toMonth, zone, posix));
		var minute = A3(
			$elm$core$String$padLeft,
			2,
			'0',
			$elm$core$String$fromInt(
				A2($elm$time$Time$toMinute, zone, posix)));
		var hour = A3(
			$elm$core$String$padLeft,
			2,
			'0',
			$elm$core$String$fromInt(
				A2($elm$time$Time$toHour, zone, posix)));
		var day = A3(
			$elm$core$String$padLeft,
			2,
			'0',
			$elm$core$String$fromInt(
				A2($elm$time$Time$toDay, zone, posix)));
		return year + ('-' + (month + ('-' + (day + (' ' + (hour + (':' + (minute + (':' + second)))))))));
	});
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$findIndexHelp = F3(
	function (index, predicate, list) {
		findIndexHelp:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var xs = list.b;
				if (predicate(x)) {
					return $elm$core$Maybe$Just(index);
				} else {
					var $temp$index = index + 1,
						$temp$predicate = predicate,
						$temp$list = xs;
					index = $temp$index;
					predicate = $temp$predicate;
					list = $temp$list;
					continue findIndexHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$findIndex = $elm_community$list_extra$List$Extra$findIndexHelp(0);
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$Main$viewPictogram = F2(
	function (lazy, path) {
		var name = A3(
			$elm$core$String$replace,
			'-',
			' ',
			A3(
				$elm$core$String$replace,
				'.svg',
				'',
				A2(
					$elm$core$Maybe$withDefault,
					'Pictogram',
					$elm$core$List$head(
						$elm$core$List$reverse(
							A2($elm$core$String$split, '/', path))))));
		return A2(
			$elm$html$Html$img,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('pictogram'),
						$elm$html$Html$Attributes$src(path),
						$elm$html$Html$Attributes$alt(name),
						$elm$html$Html$Attributes$title(name)
					]),
				lazy ? _List_fromArray(
					[
						A2($elm$html$Html$Attributes$attribute, 'loading', 'lazy')
					]) : _List_Nil),
			_List_Nil);
	});
var $author$project$Main$viewEntry = F3(
	function (compact, catalog, entry) {
		switch (entry.$) {
			case 0:
				var mode = entry.a;
				var dice = entry.b;
				var totals = A2($elm$core$List$map, $elm$core$List$sum, dice);
				var aggregate = function () {
					switch (mode) {
						case 0:
							return $elm$core$Maybe$Nothing;
						case 1:
							return $elm$core$List$maximum(totals);
						case 2:
							return $elm$core$List$minimum(totals);
						default:
							return $elm$core$Maybe$Just(
								$elm$core$List$sum(totals));
					}
				}();
				var kept = ((mode === 1) || (mode === 2)) ? A2(
					$elm$core$Maybe$andThen,
					function (score) {
						return A2(
							$elm_community$list_extra$List$Extra$findIndex,
							$elm$core$Basics$eq(score),
							totals);
					},
					aggregate) : $elm$core$Maybe$Nothing;
				var group = F2(
					function (index, die) {
						return A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('die-group', true),
											_Utils_Tuple2(
											'kept',
											_Utils_eq(
												kept,
												$elm$core$Maybe$Just(index)))
										]))
								]),
							_List_fromArray(
								[
									_Utils_eq(
									kept,
									$elm$core$Maybe$Just(index)) ? A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('kept-marker')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('✓')
												])),
											A2(
											$elm$html$Html$span,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('sr-only')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Kept die: ')
												]))
										])) : $elm$html$Html$text(''),
									$elm$html$Html$text(
									A2(
										$elm$core$String$join,
										' + ',
										A2($elm$core$List$map, $elm$core$String$fromInt, die)))
								]));
					});
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dice-result')
						]),
					_List_fromArray(
						[
							function () {
							if (!aggregate.$) {
								var score = aggregate.a;
								return A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('aggregate-result')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$elm$core$String$fromInt(score))
										]));
							} else {
								return $elm$html$Html$text('');
							}
						}(),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2('dice-values', true),
											_Utils_Tuple2(
											'dice-breakdown',
											!_Utils_eq(aggregate, $elm$core$Maybe$Nothing))
										]))
								]),
							A2($elm$core$List$indexedMap, group, dice)),
							((!mode) && ((!compact) && (($elm$core$List$length(dice) > 1) || A2(
							$elm$core$List$any,
							function (die) {
								return $elm$core$List$length(die) > 1;
							},
							dice)))) ? A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('result-meta')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									'Total ' + $elm$core$String$fromInt(
										$elm$core$List$sum(totals)))
								])) : $elm$html$Html$text('')
						]));
			case 1:
				var word = entry.a;
				return A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('word-result')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(word)
						]));
			default:
				var indices = entry.a;
				switch (catalog.$) {
					case 1:
						var paths = catalog.a;
						var pictures = A2(
							$elm$core$List$filterMap,
							function (index) {
								return A2($elm$core$Array$get, index, paths);
							},
							indices);
						return (compact && ($elm$core$List$length(pictures) > 3)) ? A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('pictogram-preview')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('pictograms')
										]),
									A2(
										$elm$core$List$map,
										$author$project$Main$viewPictogram(true),
										A2($elm$core$List$take, 3, pictures))),
									A2(
									$elm$html$Html$details,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('extra-pictograms')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$summary,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													'Show ' + ($elm$core$String$fromInt(
														$elm$core$List$length(pictures) - 3) + ' more'))
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('pictograms')
												]),
											A2(
												$elm$core$List$map,
												$author$project$Main$viewPictogram(true),
												A2($elm$core$List$drop, 3, pictures)))
										]))
								])) : A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('pictograms')
								]),
							A2(
								$elm$core$List$map,
								$author$project$Main$viewPictogram(compact),
								pictures));
					case 0:
						return A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('muted')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Loading pictograms…')
								]));
					default:
						return A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('muted')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Pictograms unavailable')
								]));
				}
		}
	});
var $author$project$Main$viewHistoryItem = F2(
	function (model, item) {
		return A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('history-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('history-content')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('history-meta')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$author$project$Main$actionLabel(item.g)),
									A3(
									$elm$html$Html$node,
									'time',
									_List_fromArray(
										[
											A2(
											$elm$html$Html$Attributes$attribute,
											'datetime',
											A3(
												$elm$core$String$replace,
												' ',
												'T',
												A2($author$project$Main$formatTimestamp, $elm$time$Time$utc, item.k)) + 'Z')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											A2($author$project$Main$formatTimestamp, model.ae, item.k))
										]))
								])),
							A3($author$project$Main$viewEntry, true, model.z, item.ab)
						])),
					$author$project$Main$canEdit(model) ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('button'),
							$elm$html$Html$Attributes$class('secondary repeat'),
							A2(
							$elm$html$Html$Attributes$attribute,
							'aria-label',
							'Repeat ' + $author$project$Main$actionLabel(item.g)),
							$elm$html$Html$Attributes$disabled(
							!A2($author$project$Main$allowed, model, item.g)),
							$elm$html$Html$Events$onClick(
							$author$project$Main$Repeat(item.g))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Repeat')
						])) : $elm$html$Html$text('')
				]));
	});
var $author$project$Main$viewHistory = function (model) {
	var visible = model.E ? model.i : A2($elm$core$List$take, 3, model.i);
	var count = $elm$core$List$length(model.i);
	var rows = A2(
		$elm$core$List$indexedMap,
		F2(
			function (index, item) {
				return _Utils_Tuple2(
					$elm$core$String$fromInt(count - index),
					A2($author$project$Main$viewHistoryItem, model, item));
			}),
		visible);
	return (!count) ? $elm$html$Html$text('') : A2(
		$elm$html$Html$aside,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('history-panel'),
				A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'history-heading')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('history-heading')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('History')
					])),
				A3(
				$elm$html$Html$Keyed$node,
				'ol',
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('history-list'),
						$elm$html$Html$Attributes$id('history-list')
					]),
				rows),
				(count > 3) ? A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('button'),
						$elm$html$Html$Attributes$class('secondary history-toggle'),
						A2(
						$elm$html$Html$Attributes$attribute,
						'aria-expanded',
						$author$project$Main$boolString(model.E)),
						A2($elm$html$Html$Attributes$attribute, 'aria-controls', 'history-list'),
						$elm$html$Html$Events$onClick($author$project$Main$ToggleHistory)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						model.E ? 'Show recent results' : ('View all ' + ($elm$core$String$fromInt(count) + ' results')))
					])) : $elm$html$Html$text('')
			]));
};
var $elm$html$Html$section = _VirtualDom_node('section');
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $author$project$Main$viewResult = function (model) {
	var latest = $elm$core$List$head(model.i);
	return A2(
		$elm$html$Html$section,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('result-panel'),
				A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'latest-result')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('result-content'),
						A2($elm$html$Html$Attributes$attribute, 'aria-live', 'polite'),
						A2($elm$html$Html$Attributes$attribute, 'aria-atomic', 'true')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('result-heading')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h2,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('latest-result'),
										$elm$html$Html$Attributes$tabindex(-1)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Latest result')
									])),
								function () {
								if (!latest.$) {
									var item = latest.a;
									return A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('result-meta')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$author$project$Main$actionLabel(item.g))
											]));
								} else {
									return $elm$html$Html$text('');
								}
							}()
							])),
						function () {
						if (!latest.$) {
							var item = latest.a;
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('result-value')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('sr-only')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												'Result ' + ($elm$core$String$fromInt(
													$elm$core$List$length(model.i)) + '. '))
											])),
										A3($author$project$Main$viewEntry, false, model.z, item.ab)
									]));
						} else {
							return A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('result-empty')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('—')
											])),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('sr-only')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('No result yet.')
											]))
									]));
						}
					}()
					]))
			]));
};
var $author$project$Main$SaveAsCopy = {$: 17};
var $author$project$Main$viewSaveIssue = function (model) {
	var _v0 = model.ac;
	if (!_v0.$) {
		var message = _v0.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('notice')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'role', 'status')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(message)
						])),
					$author$project$Main$canEdit(model) ? A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('button'),
							$elm$html$Html$Attributes$class('secondary'),
							$elm$html$Html$Events$onClick($author$project$Main$SaveAsCopy)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Save as a copy')
						])) : $elm$html$Html$text('')
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Main$BackToOwnSession = {$: 19};
var $author$project$Main$UpdateApp = {$: 20};
var $author$project$Main$sessionBanner = F3(
	function (heading, description, actions) {
		return A2(
			$elm$html$Html$section,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('session-banner')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h2,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(heading)
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('muted')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(description)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('button-row')
						]),
					actions)
				]));
	});
var $author$project$Main$viewSession = function (model) {
	var back = A2(
		$elm$html$Html$button,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$type_('button'),
				$elm$html$Html$Attributes$class('secondary'),
				$elm$html$Html$Events$onClick($author$project$Main$BackToOwnSession)
			]),
		_List_fromArray(
			[
				$elm$html$Html$text('My session')
			]));
	var _v0 = model.C;
	if (!_v0.$) {
		switch (_v0.a.$) {
			case 0:
				var _v1 = _v0.a;
				return A3(
					$author$project$Main$sessionBanner,
					'Shared link unavailable',
					'This link could not be opened.',
					_List_fromArray(
						[back]));
			case 1:
				var _v2 = _v0.a;
				return A3(
					$author$project$Main$sessionBanner,
					'Session copy unavailable',
					'This copy is stored in the browser that created it.',
					_List_fromArray(
						[back]));
			default:
				var storedVersion = _v0.a.a;
				return A3(
					$author$project$Main$sessionBanner,
					'Newer version detected',
					'This session uses format ' + ($elm$core$String$fromInt(storedVersion) + '. Try updating Dice Roller to open it.'),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Attributes$class('secondary'),
									$elm$html$Html$Events$onClick($author$project$Main$UpdateApp)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Update and reload')
								])),
							(!model.O) ? A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Attributes$class('secondary'),
									$elm$html$Html$Events$onClick(
									$author$project$Main$OpenDialog('clear-dialog'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Start a new session…')
								])) : back
						]));
		}
	} else {
		var _v3 = model.O;
		switch (_v3) {
			case 0:
				return $elm$html$Html$text('');
			case 1:
				return A3(
					$author$project$Main$sessionBanner,
					'Session copy',
					'Changes in this copy are saved separately.',
					_List_fromArray(
						[back]));
			default:
				return A3(
					$author$project$Main$sessionBanner,
					'Shared session',
					A2(
						$author$project$Main$countLabel,
						$elm$core$List$length(model.i),
						'result') + ' in this snapshot.',
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Attributes$class('primary'),
									$elm$html$Html$Events$onClick($author$project$Main$SaveAsCopy)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Continue as a copy')
								])),
							back
						]));
		}
	}
};
var $author$project$Main$CopyLink = {$: 15};
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Attributes$readonly = $elm$html$Html$Attributes$boolProperty('readOnly');
var $author$project$Main$viewShareDialog = function (model) {
	return A3(
		$elm$html$Html$node,
		'dialog',
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('share-dialog'),
				$elm$html$Html$Attributes$class('dialog'),
				A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'share-dialog-title')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h2,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('share-dialog-title')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Share session')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('muted')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('This link opens a snapshot of the results in this session.')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('field')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('share-link')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Session link')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('share-link'),
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$readonly(true),
								$elm$html$Html$Attributes$value(model.X)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$attribute, 'role', 'status'),
						$elm$html$Html$Attributes$class('share-status')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(
						function () {
							var _v0 = model.T;
							if (!_v0.$) {
								if (_v0.a) {
									return 'Link copied.';
								} else {
									return 'Copy failed. The link is selected so you can copy it manually.';
								}
							} else {
								return '';
							}
						}())
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dialog-actions')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('button'),
								$elm$html$Html$Attributes$class('secondary'),
								$elm$html$Html$Events$onClick(
								$author$project$Main$CloseDialog('share-dialog'))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Close')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('button'),
								$elm$html$Html$Attributes$class('primary'),
								$elm$html$Html$Events$onClick($author$project$Main$CopyLink)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Copy link')
							]))
					]))
			]));
};
var $author$project$Main$ChooseTable = function (a) {
	return {$: 11, a: a};
};
var $author$project$Main$SearchTables = function (a) {
	return {$: 10, a: a};
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$core$String$trim = _String_trim;
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $elm_community$list_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$List$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$List$cons, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elm_community$list_extra$List$Extra$unique = function (list) {
	return A4($elm_community$list_extra$List$Extra$uniqueHelp, $elm$core$Basics$identity, _List_Nil, list, _List_Nil);
};
var $author$project$Main$viewTableDialog = function (model) {
	var recent = A2(
		$elm$core$List$take,
		4,
		$elm_community$list_extra$List$Extra$unique(
			A2(
				$elm$core$List$filter,
				function (name) {
					return A2($elm$core$Dict$member, name, $author$project$Tables$tables);
				},
				A2(
					$elm$core$List$cons,
					model.c.r,
					A2(
						$elm$core$List$filterMap,
						function (item) {
							var _v0 = item.g;
							if (_v0.$ === 1) {
								var name = _v0.a;
								return $elm$core$Maybe$Just(name);
							} else {
								return $elm$core$Maybe$Nothing;
							}
						},
						model.h)))));
	var query = $elm$core$String$toLower(
		$elm$core$String$trim(model.Q));
	var options = function (choices) {
		return A2(
			$elm$html$Html$ul,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('table-options')
				]),
			A2(
				$elm$core$List$map,
				function (name) {
					return A2(
						$elm$html$Html$li,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('button'),
										$elm$html$Html$Attributes$class('table-option'),
										A2(
										$elm$html$Html$Attributes$attribute,
										'aria-pressed',
										$author$project$Main$boolString(
											_Utils_eq(name, model.c.r))),
										$elm$html$Html$Events$onClick(
										$author$project$Main$ChooseTable(name))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Main$tableName(name))
									]))
							]));
				},
				choices));
	};
	var names = A2(
		$elm$core$List$filter,
		function (name) {
			return (query !== '') || (!A2($elm$core$List$member, name, recent));
		},
		A2(
			$elm$core$List$filter,
			function (name) {
				return A2(
					$elm$core$String$contains,
					query,
					$elm$core$String$toLower(
						$author$project$Main$tableName(name)));
			},
			$elm$core$Dict$keys($author$project$Tables$tables)));
	return A3(
		$elm$html$Html$node,
		'dialog',
		_List_fromArray(
			[
				$elm$html$Html$Attributes$id('table-dialog'),
				$elm$html$Html$Attributes$class('dialog table-dialog'),
				A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'table-dialog-title')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dialog-heading')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('table-dialog-title')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Choose a table')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('button'),
								$elm$html$Html$Attributes$class('secondary'),
								$elm$html$Html$Events$onClick(
								$author$project$Main$CloseDialog('table-dialog'))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Cancel')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('field')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('table-search')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Search Mythic 2e tables')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('table-search'),
								$elm$html$Html$Attributes$type_('search'),
								A2($elm$html$Html$Attributes$attribute, 'autofocus', ''),
								$elm$html$Html$Attributes$value(model.Q),
								$elm$html$Html$Events$onInput($author$project$Main$SearchTables)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('table-results')
					]),
				_List_fromArray(
					[
						((query === '') && (!$elm$core$List$isEmpty(recent))) ? A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Recent')
									])),
								options(recent)
							])) : $elm$html$Html$text(''),
						$elm$core$List$isEmpty(names) ? A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('muted'),
								A2($elm$html$Html$Attributes$attribute, 'role', 'status')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('No matching tables.')
							])) : A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								(query === '') ? A2(
								$elm$html$Html$h3,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('All tables')
									])) : $elm$html$Html$text(''),
								options(names)
							]))
					]))
			]));
};
var $elm$html$Html$Attributes$hidden = $elm$html$Html$Attributes$boolProperty('hidden');
var $author$project$Main$toolPanelId = function (tool) {
	return 'tool-panel-' + $author$project$Main$toolName(tool);
};
var $author$project$Main$RunTool = {$: 4};
var $elm$html$Html$form = _VirtualDom_node('form');
var $elm$html$Html$Attributes$autocomplete = function (bool) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'autocomplete',
		bool ? 'on' : 'off');
};
var $author$project$Main$numericField = F6(
	function (id_, name, current, validate, stepper, change) {
		var number = $author$project$Main$positiveInt(current);
		var step = F4(
			function (label_, glyph, delta, blocked) {
				return A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$type_('button'),
							A2($elm$html$Html$Attributes$attribute, 'aria-label', label_),
							$elm$html$Html$Attributes$disabled(blocked),
							$elm$html$Html$Events$onClick(
							change(
								$elm$core$String$fromInt(
									A2(
										$elm$core$Maybe$withDefault,
										1,
										A2(
											$elm$core$Maybe$map,
											function (n) {
												return n + delta;
											},
											number)))))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(glyph)
						]));
			});
		var invalid = validate && _Utils_eq(
			$author$project$Main$positiveInt(current),
			$elm$core$Maybe$Nothing);
		var editor = A2(
			$elm$html$Html$input,
			_Utils_ap(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id(id_),
						$elm$html$Html$Attributes$type_('text'),
						A2($elm$html$Html$Attributes$attribute, 'inputmode', 'numeric'),
						$elm$html$Html$Attributes$autocomplete(false),
						$elm$html$Html$Attributes$value(current),
						$elm$html$Html$Events$onInput(change)
					]),
				invalid ? _List_fromArray(
					[
						A2($elm$html$Html$Attributes$attribute, 'aria-invalid', 'true'),
						A2($elm$html$Html$Attributes$attribute, 'aria-describedby', id_ + '-error')
					]) : _List_Nil),
			_List_Nil);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('field numeric-field')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$for(id_)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(name)
						])),
					function () {
					if (!stepper.$) {
						var unit = stepper.a;
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('quantity-stepper')
								]),
							_List_fromArray(
								[
									A4(
									step,
									'Fewer ' + unit,
									'−',
									-1,
									A2($elm$core$Maybe$withDefault, 1, number) <= 1),
									editor,
									A4(
									step,
									'More ' + unit,
									'+',
									1,
									_Utils_eq(
										number,
										$elm$core$Maybe$Just(2147483647)))
								]));
					} else {
						return editor;
					}
				}(),
					invalid ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id(id_ + '-error'),
							$elm$html$Html$Attributes$class('field-error'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Enter a positive whole number up to 2,147,483,647.')
						])) : $elm$html$Html$text('')
				]));
	});
var $elm$html$Html$Events$alwaysPreventDefault = function (msg) {
	return _Utils_Tuple2(msg, true);
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $elm$html$Html$Events$onSubmit = function (msg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'submit',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysPreventDefault,
			$elm$json$Json$Decode$succeed(msg)));
};
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $author$project$Main$RetryCatalog = {$: 1};
var $author$project$Main$viewCatalogStatus = function (catalog) {
	switch (catalog.$) {
		case 0:
			return A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('muted'),
						A2($elm$html$Html$Attributes$attribute, 'role', 'status')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Loading pictograms…')
					]));
		case 2:
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('catalog-status')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$attribute, 'role', 'status')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Pictograms are unavailable.')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('button'),
								$elm$html$Html$Attributes$class('secondary'),
								$elm$html$Html$Events$onClick($author$project$Main$RetryCatalog)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Retry')
							]))
					]));
		default:
			return $elm$html$Html$text('');
	}
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$fieldset = _VirtualDom_node('fieldset');
var $elm$html$Html$legend = _VirtualDom_node('legend');
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $author$project$Main$viewDice = function (model) {
	var prefs = model.c;
	var preset = function (sides) {
		var value_ = $elm$core$String$fromInt(sides);
		return A2(
			$elm$html$Html$button,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$type_('button'),
					A2(
					$elm$html$Html$Attributes$attribute,
					'aria-pressed',
					$author$project$Main$boolString(
						(!prefs.o) && _Utils_eq(prefs.v, value_))),
					$elm$html$Html$Events$onClick(
					$author$project$Main$SetPreferences(
						_Utils_update(
							prefs,
							{o: false, v: value_})))
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('d' + value_)
				]));
	};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('dice-controls')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$fieldset,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$legend,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Die type')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('presets')
							]),
						_Utils_ap(
							A2(
								$elm$core$List$map,
								preset,
								_List_fromArray(
									[4, 6, 8, 10, 12, 20, 100])),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('button'),
											A2(
											$elm$html$Html$Attributes$attribute,
											'aria-pressed',
											$author$project$Main$boolString(prefs.o)),
											$elm$html$Html$Events$onClick(
											$author$project$Main$SetPreferences(
												_Utils_update(
													prefs,
													{o: true})))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Custom')
										]))
								])))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('dice-fields')
					]),
				_List_fromArray(
					[
						A6(
						$author$project$Main$numericField,
						'dice-amount',
						'Dice count',
						prefs.x,
						model.L,
						$elm$core$Maybe$Just('dice'),
						function (value_) {
							return $author$project$Main$SetPreferences(
								_Utils_update(
									prefs,
									{x: value_}));
						}),
						prefs.o ? A6(
						$author$project$Main$numericField,
						'dice-sides',
						'Sides',
						prefs.v,
						model.L,
						$elm$core$Maybe$Nothing,
						function (value_) {
							return $author$project$Main$SetPreferences(
								_Utils_update(
									prefs,
									{v: value_}));
						}) : $elm$html$Html$text(''),
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('check-field')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('checkbox'),
										$elm$html$Html$Attributes$checked(prefs.G),
										$elm$html$Html$Events$onCheck(
										function (value_) {
											return $author$project$Main$SetPreferences(
												_Utils_update(
													prefs,
													{G: value_}));
										})
									]),
								_List_Nil),
								$elm$html$Html$text('Exploding')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('result-options')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('dice-result-mode'),
								$elm$html$Html$Attributes$class('field-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Result')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('result-modes'),
								A2($elm$html$Html$Attributes$attribute, 'role', 'radiogroup'),
								A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', 'dice-result-mode')
							]),
						A2(
							$elm$core$List$map,
							function (_v0) {
								var mode = _v0.a;
								var label_ = _v0.b;
								return A2(
									$elm$html$Html$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('result-option')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('radio'),
													$elm$html$Html$Attributes$name('dice-result-mode'),
													$elm$html$Html$Attributes$checked(
													_Utils_eq(prefs.u, mode)),
													$elm$html$Html$Events$onCheck(
													function (_v1) {
														return $author$project$Main$SetPreferences(
															_Utils_update(
																prefs,
																{u: mode}));
													})
												]),
											_List_Nil),
											A2(
											$elm$html$Html$span,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(label_)
												]))
										]));
							},
							$author$project$Main$resultModes))
					]))
			]));
};
var $author$project$Main$viewToolForm = function (model) {
	var prefs = model.c;
	var primaryLabel = function () {
		var _v1 = prefs.l;
		switch (_v1) {
			case 0:
				var _v2 = $author$project$Main$toolAction(prefs);
				if (!_v2.$) {
					var action = _v2.a;
					return 'Roll ' + $author$project$Main$actionLabel(action);
				} else {
					return (!prefs.u) ? 'Roll' : ('Roll ' + $author$project$Main$resultModeName(prefs.u));
				}
			case 1:
				return 'Ask';
			default:
				return 'Show icons';
		}
	}();
	return A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('tool-form'),
				$elm$html$Html$Events$onSubmit($author$project$Main$RunTool)
			]),
		_List_fromArray(
			[
				function () {
				var _v0 = prefs.l;
				switch (_v0) {
					case 0:
						return $author$project$Main$viewDice(model);
					case 1:
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('table-choice')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$p,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('muted')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Mythic 2e table')
												])),
											A2(
											$elm$html$Html$strong,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													$author$project$Main$tableName(prefs.r))
												]))
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('button'),
											$elm$html$Html$Attributes$class('secondary'),
											$elm$html$Html$Events$onClick(
											$author$project$Main$OpenDialog('table-dialog'))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Change table')
										]))
								]));
					default:
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('icon-controls')
								]),
							_List_fromArray(
								[
									A6(
									$author$project$Main$numericField,
									'icon-amount',
									'Pictogram count',
									prefs.I,
									model.L,
									$elm$core$Maybe$Just('pictograms'),
									function (value) {
										return $author$project$Main$SetPreferences(
											_Utils_update(
												prefs,
												{I: value}));
									}),
									$author$project$Main$viewCatalogStatus(model.z)
								]));
				}
			}(),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('submit'),
						$elm$html$Html$Attributes$class('primary'),
						$elm$html$Html$Attributes$disabled(
						(!$author$project$Main$canEdit(model)) || ((prefs.l === 2) && (!$author$project$Main$iconAvailable(model))))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(primaryLabel)
					]))
			]));
};
var $author$project$Main$viewToolPanel = F2(
	function (model, tool) {
		var active = _Utils_eq(model.c.l, tool);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$id(
					$author$project$Main$toolPanelId(tool)),
					A2($elm$html$Html$Attributes$attribute, 'role', 'tabpanel'),
					A2(
					$elm$html$Html$Attributes$attribute,
					'aria-labelledby',
					$author$project$Main$toolTabId(tool)),
					$elm$html$Html$Attributes$hidden(!active)
				]),
			active ? _List_fromArray(
				[
					$author$project$Main$viewToolForm(model)
				]) : _List_Nil);
	});
var $author$project$Main$SelectTool = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$viewToolTabs = function (activeTool) {
	var count = $elm$core$List$length($author$project$Main$tools);
	var tab = F2(
		function (index, _v3) {
			var tool = _v3.a;
			var label_ = _v3.b;
			var target = function (key) {
				switch (key) {
					case 'ArrowLeft':
						return $elm$core$Maybe$Just(
							A2($elm$core$Basics$modBy, count, index - 1));
					case 'ArrowRight':
						return $elm$core$Maybe$Just(
							A2($elm$core$Basics$modBy, count, index + 1));
					case 'Home':
						return $elm$core$Maybe$Just(0);
					case 'End':
						return $elm$core$Maybe$Just(count - 1);
					default:
						return $elm$core$Maybe$Nothing;
				}
			};
			var onKey = A2(
				$elm$json$Json$Decode$andThen,
				function (key) {
					var _v0 = A2(
						$elm$core$Maybe$andThen,
						function (position) {
							return $elm$core$List$head(
								A2($elm$core$List$drop, position, $author$project$Main$tools));
						},
						target(key));
					if (!_v0.$) {
						var _v1 = _v0.a;
						var next = _v1.a;
						return $elm$json$Json$Decode$succeed(
							_Utils_Tuple2(
								$author$project$Main$SelectTool(next),
								true));
					} else {
						return $elm$json$Json$Decode$fail('Not a tab navigation key');
					}
				},
				A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string));
			var active = _Utils_eq(activeTool, tool);
			return A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id(
						$author$project$Main$toolTabId(tool)),
						$elm$html$Html$Attributes$type_('button'),
						A2($elm$html$Html$Attributes$attribute, 'role', 'tab'),
						A2(
						$elm$html$Html$Attributes$attribute,
						'aria-selected',
						$author$project$Main$boolString(active)),
						A2(
						$elm$html$Html$Attributes$attribute,
						'aria-controls',
						$author$project$Main$toolPanelId(tool)),
						$elm$html$Html$Attributes$tabindex(
						active ? 0 : (-1)),
						$elm$html$Html$Events$onClick(
						$author$project$Main$SelectTool(tool)),
						A2($elm$html$Html$Events$preventDefaultOn, 'keydown', onKey)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(label_)
					]));
		});
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('modes'),
				A2($elm$html$Html$Attributes$attribute, 'role', 'tablist'),
				A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Tools')
			]),
		A2($elm$core$List$indexedMap, tab, $author$project$Main$tools));
};
var $author$project$Main$view = function (model) {
	var showTools = (model.O !== 2) && _Utils_eq(model.C, $elm$core$Maybe$Nothing);
	return {
		aY: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('app-shell'),
						A2(
						$elm$html$Html$Attributes$attribute,
						'data-theme',
						$author$project$Main$themeToString(model.c.s))
					]),
				_List_fromArray(
					[
						$author$project$Main$viewHeader(model),
						A2(
						$elm$html$Html$main_,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('page')
							]),
						_List_fromArray(
							[
								$author$project$Main$viewSession(model),
								$author$project$Main$viewSaveIssue(model),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('workspace')
									]),
								_List_fromArray(
									[
										showTools ? $author$project$Main$viewToolTabs(model.c.l) : $elm$html$Html$text(''),
										showTools ? A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('workspace-controls')
											]),
										A2(
											$elm$core$List$map,
											A2(
												$elm$core$Basics$composeL,
												$author$project$Main$viewToolPanel(model),
												$elm$core$Tuple$first),
											$author$project$Main$tools)) : $elm$html$Html$text(''),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('workspace-output')
											]),
										_List_fromArray(
											[
												$author$project$Main$viewResult(model),
												$author$project$Main$viewHistory(model)
											]))
									]))
							])),
						$author$project$Main$viewTableDialog(model),
						$author$project$Main$viewShareDialog(model),
						$author$project$Main$viewClearDialog(model)
					]))
			]),
		bo: 'Dice Roller (v' + ($author$project$Main$version + ')')
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{
		a6: $author$project$Main$init,
		bc: function (_v0) {
			return $author$project$Main$NoOp;
		},
		bd: $author$project$Main$Navigate,
		bm: function (_v1) {
			return $elm$core$Platform$Sub$batch(
				_List_fromArray(
					[
						$author$project$Main$clipboardResult($author$project$Main$ClipboardResult),
						$author$project$Main$storageIssue($author$project$Main$SaveIssue)
					]));
		},
		bp: $author$project$Main$update,
		bs: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));