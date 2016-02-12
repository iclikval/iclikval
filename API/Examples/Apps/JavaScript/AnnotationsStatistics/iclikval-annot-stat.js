!(function() {
	
	var ick = { version: "0.1" };
	
	var url="http://api.iclikval.riken.jp/annotation";
	var token="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZCI6ImVmNjU5OWFmNTIwNjJlMzcyZjA3ZmM3NzAyNDFjMjE2NzhiYzc2YmMiLCJqdGkiOiJlZjY1OTlhZjUyMDYyZTM3MmYwN2ZjNzcwMjQxYzIxNjc4YmM3NmJjIiwiaXNzIjoiaHR0cDpcL1wvbG9jYWxob3N0IiwiYXVkIjoiODU5YWRiNmQ4NDNmYTdlOWE0ZWIxOTE3MWY1ZWJiZGUzNzllNjZkYTQzM2JiZDVlZmRhZmEzMzg2NWI5MTkzNiIsInN1YiI6Im1heGltZWhlYnJhcmQiLCJleHAiOjE0NTU2NzU4NDgsImlhdCI6MTQ1NDQ2NjI0OCwidG9rZW5fdHlwZSI6ImJlYXJlciIsInNjb3BlIjpudWxsfQ.JFhOq-OJLCeCK7Brm7W1A_GWl2zqIwHWh-i3eiOXDZjkH4c5ODvJgWV9LzOD6VFnBhKcOXJ5upBtruZPYcNwIlp-JQAYXRvo4bc1yEksnFKOVESs4NrTGV7JUHsyZu1KHyVdRCCYJnxtbwaKHRAkfMG50u7DI8PRyo78uB9T17ZL9wupU4JsorWfaU0-oynIkW9XdsSWwyg2hq2X-kJOk-IekWxAFounYl9HZl7KMJMQMLWTg5OxGrL6MlsrUuciwx_C5L4JQhuuvi_53CRuKO1K18AUCAbYNY-sz_UTN368l0kcRq5FrUOwYe17bu-DUeHEHWfWE-U2RiwJ_fP6DA";
	//Query Params//
	var firstPage=1;
	var lastPage=""; // "" to the end
	var pageSize=2000;
	////////////////
	var annots=[];//annotations by users object
	var root={"name":"All","id":0,"category":"Annotations","index":[],"children":[]};
	var paths=[root]; //key,value of selected node
	var sorted=[]; //sorted list of leaves for search
	var node=root; //current node
	var color = d3.scale.ordinal().range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);
	var param={};
	

	//METHODS//
	ick.load = function(bar,loc) {
//console.time("all");
		
		initView(bar,loc);
		
//console.time("getAnnot");
		getAnnotations(firstPage);
		

	}
	
	function initView(bar,loc) {
		
		//style
		d3.select("head").selectAll("#css").data(["style"])
		.enter().append("style").attr("id","css").text(
		".hide{position:absolute;z-index:10;background-color:#fff;border:1px solid #000;border-radius:.2em;padding:3px;pointer-events:none;opacity:0}\n"
		+".ick-box{position:absolute;z-index:3;display:inline-block;background-color:#fff;border:1px solid #000;border-radius:.2em;padding:3px;min-height:14px;}\n"
		+".ick-box ul{margin:0px;padding:0px 5px;}\n"
		+".ick-box ul li {list-style-type:none;list-style-position:outside;}\n"
		+".ick-box ul li:hover{background-color:#666;cursor:pointer;}\n"
		);
		
		//hidden div
		d3.select("body").selectAll(".hide").data(["tip","info"])
		.enter().append("div").attr("id",function(d){return "ick-"+d;}).attr("class", "hide");
		
		//build views
		param.path={};
		param.path.location=bar;
		path(param.path);
			
		param.treemap={};
		param.treemap.location=loc;
		param.treemap.width=800;
		param.treemap.height=600;
		treemap(param.treemap);

		
/*		//Multi bar chart
		var margin = {top: 20, right: 20, bottom: 100, left: 100};
		params.width = 1400 - margin.left - margin.right;
		params.height = 600 - margin.top - margin.bottom;

		//x axis: users
		params.x0 = d3.scale.ordinal().rangeRoundBands([0, params.width], .1);
		//x axis: key/rel/value
		params.x1 = d3.scale.ordinal();
		//y axis: numeric value
		params.y = d3.scale.linear().range([params.height, 0]);

		var svg = d3.select("#"+loc).append("svg")
			.attr("width", params.width + margin.left + margin.right)
			.attr("height", params.height + margin.top + margin.bottom)
			.append("g")
			.attr("class","ick-view")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		params.xAxis = d3.svg.axis()
			.scale(params.x0)
			.orient("bottom");

		params.yAxis = d3.svg.axis()
			.scale(params.y)
			.orient("left")
			.tickFormat(d3.format("0."));
			
		svg.append("g")
			.attr("class", "xAxis")
			.attr("transform", "translate(0," + params.height + ")")
			.call(params.xAxis)
			.append("text")
			  .attr("x", params.width)
			  .attr("y", -18)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text("Users");
			
		svg.append("g")
			.attr("class", "yAxis")
			.call(params.yAxis)
			.append("text")
			  .attr("transform", "rotate(-90)")
			  .attr("y", 6)
			  .attr("dy", ".71em")
			  .style("text-anchor", "end")
			  .text("Annotations");
		
		svg.append("g").attr("class", "legend")
*/
	}
	
	function getAnnotations(page) {
		d3.json(url+"?page="+page+"&page_size="+pageSize)
			.header("Authorization","Bearer "+token)
			.get(function(err,data) {
//console.timeEnd("getAnnot");
console.log("page",page,"read");

				action(data);
				//recursive call
				if(data.page<data.page_count && (lastPage>0 ? page<lastPage : true) ) { //if lastPage="", read all
					page++;
					root.index=d3.range(annots.length);
					//paths.push(root);
					updateView();
//console.time("getAnnot");
					getAnnotations(page);
				}
				else {
console.log("data",data);
console.log("annots",annots);
					root.index=d3.range(annots.length);
					updateView();
//console.timeEnd("all");
				}
			})
	}
	
	function action(data) {
console.time("action-annot");
		annots=annots.concat(data._embedded.annotation)
console.timeEnd("action-annot");
	}
	
	function reduce(node,mode) {
		//init
		node.children=[];
		leaves=[];
		//local var
		if(!mode) {console.log("NO MODE"); mode="annot. type";}
		var cats=[]; //list of categories
		var cat=""; //current category
	//	var res=[]; //node.children
		var i=0; //index of children
		
		//category accessor
		function getCat(idx) {
			if(mode=="annot. type" || mode=="user") {return annots[idx].reviewer.username;}
			else if(mode=="media type") {return annots[idx].media.type;}
			else if(mode=="media") {return annots[idx].media.title;}
			else if(mode=="language") {return annots[idx].language;}
			else if(mode=="key") {return annots[idx].key;}
			else if(mode=="relationship") {return annots[idx].relationship;}
			else if(mode=="value") {return annots[idx].value;}
		}
		
		//children computation
		if(mode=="annot. type") {
			node.children=node.index.reduce(function(res,idx){
				if(getCat(idx)=="iclikval") { i=0; }
				else { i=1; }
				res[i].index.push(idx);
				return res;
			},[{"name":"Automatic","id":"Automatic","category":mode,"index":[],"children":[]},
				{"name":"Human","id":"Human","category":mode,"index":[],"children":[]}]
			);
			gid=3;
		}
		else {
			node.children=node.index.reduce(function(res,idx){
				cat=getCat(idx);
				i=cats.indexOf(cat);
				if(i<0){
					i=cats.length;
					cats.push(cat);
					res.push({"name":cats[i],"id":cats[i].replace(/\W/g,""),"category":mode,"index":[],"children":[]});
					gid++;
				}
				res[i].index.push(idx);
				return res;
			},[]);
		}
		
		//sort children for search
		var search=node.children.slice(0);
		search.push(node);
		sorted=search.sort(function(a,b) { return a.name.length<b.name.length ? -1 : a.name.length>b.name.length ? 1 : a.name<b.name ? -1 : a.name>b.name ? 1 : 0  ; });
	}
	
	//VIEWS//
	/*bar from Kerry Rodden’s Block 7090426*/
	function path(p) {
		
		var tag = { w:125,h:30,s:3,t:10,u:8,x:0 };
		
		//create div
		var div = d3.select("#"+p.location)
			.classed("ick-container",true)
			.append("div")
			.attr("id","ick-path")
			.style("display","inline-flex")
			.style("line-height","30px")
		//create svg
		div.append("svg")
			.attr("width", 30)
			.attr("height", 30)
		//mode
		div.append("span").html("&nbspSplit by:&nbsp")
		var s=div.append("select").attr("id","ick_mode")
			s.on("change",function() {updateView();});
			
		p.update= function(list) {
			//update list of options
			d3.selectAll('.ick-searchbox').select('ul')
				.selectAll("li").remove()
			d3.selectAll('.ick-searchbox').select('ul')
				.style("padding","5px")
				.selectAll("li")
				.data(list)
				.enter().append("li")
				.on("click",function(d) {
					d3.selectAll(".ick-search").property("value",d.name)
					d3.selectAll('.ick-searchbox')
						.style("display","none")
						.select('ul').selectAll("li").remove()
					tip("hide",d);
					if(d!=node) {updatePath(d);}
					updateView();
				})
				.on('mouseover', function(d){ tip("show",d); })
				.on('mouseout', function(d){ tip("hide",d); })
				.on("mousemove", function(d) { tip("move"); })
				.text(function(d){return d.name;}) 
		}
			
		//Search bar//
		div.append("span").html("&nbspZoom on:&nbsp")
		var s=div.append("input").attr("type","text")
			.attr("class","ick-search")
			.attr("size","7")
			.on("focus",function() {
				d3.select(".ick-searchbox").style("display","inline-block");
				p.update(sorted.slice(0,10));
			})
			.on("keyup",function() {
				var word = this.value;
				var matches=[];
				var i=0;
				//build regext with input
				regexp = new RegExp(word,'i');
				//search 10 first results (sort by length & alpha)
				while(i<sorted.length && matches.length<10) {
					if(regexp.test(sorted[i].name)) {
						matches.push(sorted[i]);
					}
					i++;
				}
				p.update(matches);
			})
			div.append("div").attr("class","ick-searchbox ick-box")
			.style("display","none")
			.append("ul")

		p.setView = function() {
			//group for tile
			var sel = d3.select("#ick-path").select("svg")
			.selectAll("g").data(paths);
			var g = sel.enter().append("g")
			.attr("transform", d3.svg.transform()
				.translate(function(d,i) {
					return [i*(tag.w+tag.s),0]; 
				})
			)
			//shape
			g.append("polygon")
			.attr("points", tail)
			.style("fill", function(d) { return color(d.id); })
			.style("cursor","pointer")
			.on('mouseover', function(d){ info("show",d); })
			.on('mouseout', function(d){ info("hide",d); })
			.on("mousemove", function(d) { info("move"); })
			.on("click", function(d,i) {
				paths=paths.slice(0,i+1);
				node=d;
				updateView();
			})
			//path
			g.append("path")
				.attr("id",function(d){return "map"+d.id;})
				.style("opacity",0)
				.style("pointer-events","none")
				.attr("d",line())
			//text
			g.append("text")
			.attr("text-anchor", "left")
			.attr("dy","0.5ex")
			.style("pointer-events","none")
			.append("textPath")
			.attr("xlink:href",function(d){return "#map"+d.id;})
			.text(function(d) { return d.category+" = "+d.name; });
			// Remove exiting nodes.
			sel.exit().remove();
			//adapt container length
			d3.select("#ick-path").select("svg").attr("width",(paths.length*(tag.w+tag.s)+2*tag.t)) //(paths.length*(tag.w+tag.s)+15));
			
			function line() {
				var path = d3.svg.line()
				.x(function(t) {return t[0];})
				.y(function(t) {return t[1];})
				.interpolate("linear");
		
				return path([[tag.t+tag.s,tag.h/2],[tag.w-tag.s,tag.h/2]]);
			}

			function tail(d,i) {
				var res = [];
				res.push([0,0]);
				res.push([tag.w,0]);
				res.push([tag.w+tag.t,tag.h/2]);
				res.push([tag.w,tag.h]);
				res.push([0,tag.h]);
				if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
					res.push([tag.t,tag.h/2]);
				}
				
				return res.join(" ");
			}
			
			//options//
			var opts=["annot. type","user","media type","media","language","key","relationship","value"];
			var used=paths.map(function(p) {return p.category;})
			//console.log("optmanag:",opts.filter(function(o) {return used.indexOf(o)<0;}));
			//"value"
			var sel = d3.select("#ick_mode").selectAll("option")
			.data(opts.filter(function(o) {return used.indexOf(o)<0;}),function(d){return d;})
			sel.enter().append("option").attr("value",function(d){return d;}).text(function(d){return d;})
			sel.exit().remove();
		}
		
		//first init
		p.setView();
	}

	function treemap(p){
		//create svg
		var svg = d3.select("#"+p.location)
			.classed("ick-container",true)
			.append("svg")
			.attr("id","ick-treemap")
			.attr("width", p.width)
			.attr("height", p.height)
			.style("display","inline-block")//disable bottom padding

		//group for visual elements
		svg.append("g").classed("ick-visual",true)

		//group for label elements
		var labels = svg.append("g")
			.classed("ick-labels",true)
			.style("font-family","'Source Code Pro','Lucida Console',Monaco,monospace");
		
		//highlight elememt//
		svg.append("rect")
			.classed("ick-hl",true)
			.style("stroke","#000")
			.style("stroke-width","5")
			.style("stroke-opacity",0.5)
			.style("fill","none")
			.style("pointer-events","none");		
		
		p.rectTranslate = d3.svg.transform()
			.translate(function(d) { 
				var dc=d.view.treemap.coords;
				var x=p.x(dc.x) ? p.x(dc.x) : 0;
				var y=p.y(dc.y) ? p.y(dc.y) : 0;
				return [x,y]; 
			});

		p.setView = function() {
			//MARGIN//
			//margin inner final svg
			margin = {top:0, right:0, bottom:0, left:1}; 
			//if(!config.options.headers) {margin.top=20;}
			h = p.height - margin.top - margin.bottom; 
			w = p.width - margin.right - margin.left;
			
			//D.LAYOUT//
			p.layout = d3.layout.treemap() //array of all nodes
				.size([w, h]) //size of map
				.round(false) //round the value (for scale)
				.sticky(true) //keep child position when transform
				.value(function(d){return d.index.length;});
			p.layout.nodes(node);
			saveCoords(node,"treemap");
		
			//d3.scales
			p.x = d3.scale.linear().range([0, w]).domain([node.x, node.x + node.dx]);
			p.y = d3.scale.linear().range([0, h]).domain([node.y, node.y + node.dy]);
			
			//VISUAL//
			var sel = d3.select("#ick-treemap").select(".ick-visual").datum(node)
			.selectAll("rect").data(p.layout.nodes()
				.filter(function(d){return !d.children;}),
				function(d){return d.id;}
			);
			//create new
			sel.enter().append("rect")
			.attr("class",function(d){return "v"+d.id;})
			.style("fill",function(d){return color(d.id);})
			.on("click", function(d) {
				tip("hide",d);
				updatePath(d);
				updateView();
			})
			.on('mouseover', function(d){ tip("show",d); })
			.on("mousemove", function(d) { tip("move"); })
			.on("mouseout", function(d){ tip("hide",d); })	
			//update All
			sel.transition().duration(1000)
			.attr("transform", p.rectTranslate)
			.attr("width", function(d) { //w = x2-x1
				var dc=d.view.treemap.coords;
				return p.x(dc.x+dc.dx)-p.x(dc.x)-1; 
			})
			.attr("height", function(d) { //h = y2-y1
				var dc=d.view.treemap.coords;
				return p.y(dc.y+dc.dy)-p.y(dc.y)-1;
			})
			.style("opacity",1);
			//delete
			sel.exit().transition().duration(1000)
			.style("opacity",0)
/*			.attr("transform","translate(0,0)")
			.attr("width","0")
			.attr("height","0")
*/		
			.remove();
			
			//LABELS//
			//path
			var sel = d3.select("#ick-treemap").select(".ick-labels").datum(node)
			.selectAll("path").data(p.layout.nodes()
				.filter(function(d){return !d.children;}),
				function(d){return d.id;}
			);
			//create path
			sel.enter().append("path")
				.attr("id",function(d){return "map"+d.id;})
				.attr("d",function(d) {return "M0,0L0,0"; })
				.style("opacity",0)
				.style("pointer-events","none")
			//update
			sel.transition().duration(1000)
			.attr("d",function(d) {return line(d); })
			//delete
			sel.exit().remove();
			
			//text
			var sel = d3.select("#ick-treemap").select(".ick-labels").datum(node)
			.selectAll("text").data(p.layout.nodes()
				.filter(function(d){return !d.children;})
				,function(d){return d.id;}
			);
			//create text
			sel.enter().append("text")
				.attr("class",function(d){return "t"+d.id;})
				.attr("text-anchor", "left")
				.attr("dy","0.5ex")
				.style("pointer-events","none")
				.append("textPath")
				.attr("xlink:href",function(d){return "#map"+d.id;})
				.text(function(d){ return d.name; })
			//delete
			sel.exit().remove();

			//Path computation
			function line(d) {
				var dc=d.view.treemap.coords;
				var ax,ay,bx,by;
				var mw=5,mh=22; //margin width and height
				var rw=p.x(dc.x+dc.dx)-p.x(dc.x)-1; //rect width
				var rh=p.y(dc.y+dc.dy)-p.y(dc.y)-1; //rect height

/*				if(config.options.headers && d.children) {
					ax=p.x(dc.x)+mw;
					ay=p.y(dc.y+10);
					bx=p.x(dc.x+dc.dx)-mw;
					by=ay;
					//margin
					if(ax>=bx || rh<mh) {bx=ax;}
				}
*/
//				else {
					if(rw<rh) {//vertical
						ax=p.x(dc.x+(dc.dx/2));
						ay=p.y(dc.y);
						bx=ax;
						by=p.y(dc.y+dc.dy);
						//margin && min width
						if(ay+mw<by-mw && rw>mh) { ay=ay+mw; by=by-mw;} 
						else {by=ay;}
					}
					else { //horizontal
						ax=p.x(dc.x);
						ay=p.y(dc.y+(dc.dy/2));
						bx=p.x(dc.x+dc.dx);
						by=ay;
						//margin && min height
						if(ax+mw<bx-mw && rh>mh) { ax=ax+mw; bx=bx-mw;}
						else {bx=ax;}					
//					}
				}
				
				var path = d3.svg.line()
				.x(function(t) {return t[0];})
				.y(function(t) {return t[1];})
				.interpolate("linear");
		
				return path([[ax,ay],[bx,by]]);
			}

		}
		
/*		p.setColor = function(mode) {
			var c = d3.scale.ordinal().range(colors.category); //probe + sample type
			var sel = d3.select("#rd-treemap").select(".rd-visual").selectAll(".leaf"); //value + probe + sample type
			
			//headers gray
			d3.select("#rd-treemap").select(".rd-visual").selectAll(".node").style("fill","#ddd")
			
			if(mode=="value") {
				c = d3.scale.linear().domain([Math.log2(2),(Math.log2(10)-Math.log2(2)/2),Math.log2(10)]).range(colors.range);
				sel.style("fill",function(d){ return c(Math.log2(d.value)); })
			}	
			else if(mode=="probe") {
				sel.style("fill",function(d){ return c(d.data.probe);  })
			}
			else if(mode=="sample type") {
				sel.style("fill",function(d){ return c(d.parent.data.type); })
			}
			else {
				sel = d3.select("#rd-treemap").select(".rd-visual").selectAll("rect"); //sample + organ + cell
				if(mode=="sample") { 
					sel.style("fill",function(d){
						var n=d;
						while(n.depth>3 && n.parent) { n=n.parent; }
						return n.depth==3 ? c(n.name) : "#ddd";
					})
				}
				else {
					c = colors.type; //organ + cell
					var depth;
					if(mode=="organ type") { depth=2; }
					else if(mode=="cell type") { depth=1; }
					
					sel.style("fill",function(d){
						var n=d;
						while(n.depth>depth && n.parent) { n=n.parent; }
						return n.depth==depth ? c[n.name] : "#ddd";
					})
				}
			}
		}
*/
/*		p.setLabel = function(mode) {
			//Label text
			var txt = labels.datum(root).selectAll("textPath")
			//headers
			if(config.options.headers) { 
				txt.filter(function (d){return d.children;})
				.text(function(d){ return d.name; })
			}
			//leaves
			if(mode=="value") {
				txt.filter(function (d){return !d.children;})
				.text(function(d){ return d.value;});
			}
			else if(mode=="probe") {
				txt.filter(function (d){return !d.children;})
				.text(function(d){return d.data.probe;});
			}
			else if(mode=="sample type") {
				txt.filter(function (d){return !d.children;})
				.text(function(d){return d.parent.data.type;}); }
			else {
				var depth;
				if(mode=="sample") {depth=3;}
				else if(mode=="organ type") {depth=2;}
				else if(mode=="cell type") {depth=1;}
				txt.filter(function (d){return !d.children;})
				.text(function(d){
					var n=d;
					while(n.depth>depth && n.parent) { n=n.parent; }
					return n.name;
				})
			}
		}
*/	
		p.setHL = function(d) {
			if(d.view.treemap.coords) {
				var n = d.view.treemap.coords;
				d3.select("#ick-treemap").select(".ick-hl")
				.datum(d)
				.attr("transform", p.rectTranslate)
				.attr("width", function(d) {
					var dc=d.view.treemap.coords;
					return p.x(dc.x+dc.dx)-p.x(dc.x)-1; 
				})
				.attr("height", function(d) { 
					var dc=d.view.treemap.coords;
					return p.y(dc.y+dc.dy)-p.y(dc.y)-1;
				})
			}
		}
	}
	
	function saveCoords(n,layout) {
		if(!n.view) {n.view={};}
		if(!n.view[layout]) {n.view[layout]={};}
		n.view[layout].coords={"x":n.x,"y":n.y,"dx":n.dx,"dy":n.dy};
		//recursive call
		if(n.children) { 
			for (var i in n.children) {
				saveCoords(n.children[i],layout);
			}
		}
	}
		
	function updateView(){
		var mode=d3.select("#ick_mode").node().value;
		reduce(node,mode);
		for(var l in param) { //foreach layout	
			param[l].setView();
		}
//console.log("struct:",root);
	}
	
	function updatePath(n) {
		paths.push(n);
		node=n;
		var mode = d3.select("#ick_mode").node().value;
		var opt=d3.select("#ick_mode").select("option[value='"+mode+"']")
		opt.remove();
	}
/*		//Multi bar chart
		//compute data for barchart
		var bars = d3.keys(annots["iclikval"].length)//.filter(function(key) { return key !== "annot"; });
		users.forEach(function(d) {
			d.vals = bars.map(function(category) { return {user: d.name, category: category, value: +annots[d.name].length[category]}; });
		 });
		
		//update view
		params.x0.domain(users.map(function(d) { return d.name; }));
		params.x1.domain(bars).rangeRoundBands([0, params.x0.rangeBand()]);
		params.y.domain([0, d3.max(users, function(d) { return d3.max(d.vals, function(d) { return d.value; }); })]);
		
		params.xAxis.scale(params.x0)
		params.yAxis.scale(params.y)
		d3.select(".xAxis").call(params.xAxis)
			.selectAll(".tick").select("text")
			.attr("transform", "rotate(90)")
			.attr("y", 0)
			.attr("x", 10)
			.attr("dy", "0.25em")
			.style("text-anchor", "start");
		d3.select(".yAxis").call(params.yAxis);
		
		var sel=d3.select(".ick-view").selectAll(".user").data(users)
		var user=sel.enter().append("g")
			.attr("class", "user")
		sel.attr("transform", function(d) { return "translate(" + params.x0(d.name) + ",0)"; });
			
		sel=d3.select("svg").selectAll(".user").selectAll("rect").data(function(d) { return d.vals; })
		sel.enter().append("rect")
			.style("fill", function(d) { return color(d.category); })
			.attr("id",function(d) { return d.user+"-"+d.category; })
			.on('mouseover', function(d){ tip("show",d); })
			.on("mousemove", function(d) { tip("move"); })
			.on("mouseout", function(d){ tip("hide",d); })	
		sel.attr("width", params.x1.rangeBand())
			.attr("x", function(d) { return params.x1(d.category); })	
		sel.transition().duration(1000)
			.attr("y", function(d) { return params.y(d.value); })
			.attr("height", function(d) { return params.height - params.y(d.value); })

		var legend = d3.select("svg").select(".legend").selectAll(".item")
			.data(bars.slice())
			.enter().append("g")
				.attr("class", "item")
				.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
		legend.append("rect")
			  .attr("x", params.width - 18)
			  .attr("width", 18)
			  .attr("height", 18)
			  .style("fill", color);

		legend.append("text")
			  .attr("x", params.width - 24)
			  .attr("y", 9)
			  .attr("dy", ".35em")
			  .style("text-anchor", "end")
			  .text(function(d) { return d; });	
*/

	function tip(state,d) {
		if(state=="show") {
			d3.select("#ick-tip")
				.datum(d)
				.style("opacity",1)
				.html("name: "+d.name+"<br/>value: "+d.index.length)
			//HL
			d3.select(".v"+d.id)
			.style("fill",d3.rgb(color(d.id)).darker());
			
		}
		else if(state=="hide") {
			d3.select("#ick-tip").style("opacity",0);
			//HL
			d3.select(".v"+d.id)
			.style("fill",color(d.id));
		}
		else { // move
			d3.select("#ick-tip").style("top", (d3.event.pageY-10)+"px")
            .style("left", (d3.event.pageX+10)+"px");
		}
	}
	
	function info(state,d) {
		if(state=="show") {
			d3.select("#ick-info")
				.datum(d)
				.style("opacity",1)
				.text(function(d) { return d.category+" = "+d.name; });			
		}
		else if(state=="hide") {
			d3.select("#ick-info").style("opacity",0);
		}
		else { // move
			d3.select("#ick-info").style("top", (d3.event.pageY-10)+"px")
            .style("left", (d3.event.pageX+10)+"px");
		}
	}
	
	//DEFINE OR EXPORTS//
	if (typeof define === "function" && define.amd) define(ick); else if (typeof module === "object" && module.exports) module.exports = ick;
	this.ick = ick;
	
}());