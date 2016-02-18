!(function() {
	
	var ick = { version: "0.2" };
	
	var url="http://api.iclikval.riken.jp/annotation";
	var token="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpZCI6IjZjNDg4YmIzMmM2ZmJjNjI1MmFhYmE2MmQwN2FhYzEwNmU5N2ZmYjQiLCJqdGkiOiI2YzQ4OGJiMzJjNmZiYzYyNTJhYWJhNjJkMDdhYWMxMDZlOTdmZmI0IiwiaXNzIjoiaHR0cDpcL1wvbG9jYWxob3N0IiwiYXVkIjoiODU5YWRiNmQ4NDNmYTdlOWE0ZWIxOTE3MWY1ZWJiZGUzNzllNjZkYTQzM2JiZDVlZmRhZmEzMzg2NWI5MTkzNiIsInN1YiI6Im1heGltZWhlYnJhcmQiLCJleHAiOjE0NTY4ODc0MTcsImlhdCI6MTQ1NTY3NzgxNywidG9rZW5fdHlwZSI6ImJlYXJlciIsInNjb3BlIjpudWxsfQ.INqWl2AaA4RRy3Tvp8Ldr2L0WPPdO1Njx5rAN4Y9f5_IrM9_WUbppqqlOEG4_P6Zva_ychYQTFWaPW6KDYsHlFFi1YOcgop03SgZxk2Zy9TtFEUawZTH2dZZUhPO1-Lg891B0_DEqLUm_XWj__Z6VT8d-EXw8U9D5wEWiLE1rw9YpADPqWKWmUvOjH7HpuXRDLEwRKIL0B4mpRrYe-AAGMKluTINHj-G65RfZ8ydXRbW8WvcUpC_rrVI34zRwMnTfIHZyBkr4XlsLzGVWV5t9XIJRfKeDqBLcHmb-kY8CdAVUhHa5EFe0AP_L_JssxbFg9PQ1GMWy5h7yRHblVjPYg";
	//Query Params//
	var currentPage=1;
	var lastPage=""; // "" to the end
	var pageSize=2000;
	////////////////
	var config={};//config from index.html
	var param={};//param from ick.js
	var annots=[];//list of annotations object
	var total={"item":"Total","id":0,"category":"Total","index":{"length":0},"news":[],"children":[]};
	var root={"item":"Annotations","id":1,"category":"Loaded","index":[],"news":[],"children":[]};
	var node=root; //current node
	var paths=[[root,"annot. type"]]; //list of filters [node,split mode]
	var sorted=[]; //sorted list of leaves for search
	var color = d3.scale.ordinal().range(["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]);

	//METHODS//
	ick.load = function(c) {
//console.time("all");
		config=c;
		initView();	
//console.time("getAnnot");
		getAnnotations();
	}
	
	function initView() {
		
		//style
		d3.select("head").selectAll("#ick-css").data(["style"])
		.enter().append("style").attr("id","ick-css").text(
		".ick-hide{position:absolute;z-index:10;background-color:#fff;border:1px solid #000;border-radius:.2em;padding:3px;pointer-events:none;opacity:0}\n"
		+".ick-box{position:absolute;z-index:3;display:inline-block;background-color:#fff;border:1px solid #000;border-radius:.2em;padding:3px;min-height:14px;}\n"
		+".ick-box ul{margin:0px;padding:0px 5px;}\n"
		+".ick-box ul li {list-style-type:none;list-style-position:outside;}\n"
		+".ick-box ul li:hover{background-color:#666;cursor:pointer;}\n"
		+".ick-pie{float:left;border:1px solid #000;border-radius:.2em;padding:3px}\n"
		
		);
		
		//hidden div
		d3.select("body").selectAll(".ick-hide").data(["tip"])
		.enter().append("div").attr("id",function(d){return "ick-"+d;}).attr("class", "ick-hide");
		
		//build views
		param.path={"height":30};
		path(config.path,param.path);
		
		param.progress={"height":20};
		progress(config.progress,param.progress);
		
		param.pie={"radius":50};
		pie(config.pie,param.pie);
			
		param.treemap={};
		treemap(config.treemap,param.treemap);

		
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
	
	function getAnnotations() {
		d3.json(url+"?page="+currentPage+"&page_size="+pageSize)
			.header("Authorization","Bearer "+token)
			.get(function(err,data) {
//console.timeEnd("getAnnot");
console.log("page",currentPage,"read");
if(err){console.log("ERR:",err);}

				action(data);

				//recursive call
				if(data.page<data.page_count && (lastPage>0 ? currentPage<lastPage : true) ) { //if lastPage="", read all
					currentPage++;
//console.time("getAnnot");
					getAnnotations(currentPage);
				}
				else {
console.log("data",data);
console.log("annots",annots);					
//console.timeEnd("all");
				}
			})
	}
	
	function action(data) {
//console.time("action-annot");
		total.index.length=data.total_items;
		var news=d3.range(root.index.length,root.index.length+data._embedded.annotation.length);
		annots=annots.concat(data._embedded.annotation);
		root.index=root.index.concat(news);
		root.news=news;
		updateView("load");
//console.timeEnd("action-annot");
	}
	
	function reduce(path,load) {
		//init
		var node=path[0];
		var mode=path[1];
		var idxs=[]; //list of annot
		var cats=[];
		var children=[];
		var cat=""; //current category
		var id=""; //current id (cat replace)
		var i=0; //index of children
		if(load) { //Load new annot
			idxs=node.news; //update only new annot
			if(node.children){
				cats=node.children.map(function(c){return c.id;});
				children=node.children;
			}
		}
		else { //update all annot
			idxs=node.index;
			if(node.children){
				cats=node.children.map(function(c){ //list of categories
					c.index=[];c.children=[]; //delete index and descendant
					return c.id;
				});
			children=node.children;
			}
		}
console.log("reduce",node.item,idxs.length);	
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
		
		if(mode=="annot. type") {
			if(cats.indexOf("Automatic")<0) {
				children.push({"item":"Automatic","id":"Automatic","category":mode,"index":[],"news":[],"children":[]});
				cats.push("Automatic");
			}
			if(cats.indexOf("Human")<0) {
				children.push({"item":"Human","id":"Human","category":mode,"index":[],"news":[],"children":[]});
				cats.push("Human");
			}
			//short loop
			idxs.forEach(function(idx) {
				if(getCat(idx)=="iclikval") { i=0; }
				else { i=1; }
				children[i].index.push(idx);
				children[i].news.push(idx);
			});
		}
		else {
			idxs.forEach(function(idx) {
				cat=getCat(idx);
				id=cat.replace(/\W/g,"");
				i=cats.indexOf(id);
				if(i<0){
					i=cats.length;
					cats.push(id);
					children.push({"item":cat,"id":id,"category":mode,"index":[],"news":[],"children":[]});
				}
				children[i].index.push(idx);
				children[i].news.push(idx);
			});
		}
		node.news=[];
		node.children=children.filter(function(c){return c.index.length>0;});
	}
	
	//VIEWS//
	/*bar from Kerry Rodden’s Block 7090426*/
	function path(c,p) {
		
		var tag = { w:60,h:p.height,s:3,t:10};	
		//create div
		var div = d3.select("#"+c.location)
			.classed("ick-container",true)
			.append("div")
			.attr("id","ick-path")
			.style("display","inline-flex")
			.style("line-height",p.height+"px")
			.style("height",p.height+"px")
		//create svg
		div.append("svg").attr("width",0).attr("height",p.height)
		//mode
		div.append("span").html("&nbspSplit by:&nbsp")
		var s=div.append("select").attr("id","ick_mode")
			s.on("change",function() {updateView("split");});
			
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
					d3.selectAll(".ick-search").property("value",d.item)
					d3.selectAll('.ick-searchbox')
						.style("display","none")
						.select('ul').selectAll("li").remove()
					tip("hide",d);
					updatePath(d);
					updateView("zoom");
				})
				.on('mouseover', function(d){ tip("show",d); })
				.on('mouseout', function(d){ tip("hide",d); })
				.on("mousemove", function(d) { tip("move"); })
				.text(function(d){return d.item;}) 
		}
			
		//Search bar//
		div.append("span").html("&nbspZoom on:&nbsp")
		div.append("input").attr("type","text")
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
					if(regexp.test(sorted[i].item)) {
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
			.selectAll("g").data(paths.map(function(p){return p[0];}))
			var g = sel.enter().append("g")
			.attr("transform", d3.svg.transform()
				.translate(function(d,i) {
					return [i*(tag.w+tag.s),0]; // i*w+s , 0
				})
			)
			//shape
			g.append("polygon")
			.attr("points", arrow(tag.w,tag.h,tag.t,tag.s,1)) //w h t s n
			.style("fill", function(d) {return color(d.id); })
			.style("cursor","pointer")
			.on('mouseover', function(d){ tip("show",d); })
			.on('mouseout', function(d){ tip("hide",d); })
			.on("mousemove", function(d) { tip("move"); })
			.on("click", function(d,i) {
				paths=paths.slice(0,i+1);
				paths[i][1]="";
				node=d;
				updateView("zoom");
			})
			//path
			g.append("path")
				.attr("id",function(d){return "map"+d.id;})
				.style("opacity",0)
				.style("pointer-events","none")
				.attr("d",line(tag.t+tag.s,tag.h/2,tag.w-tag.s,tag.h/2)) //0,h/2,w,h/2
			//text
			g.append("text")
			.attr("text-anchor", "left")
			.attr("dy","0.5ex")
			.style("pointer-events","none")
			.append("textPath")
			.attr("xlink:href",function(d){return "#map"+d.id;})
			.text(function(d) { return d.item; });
			// Remove exiting nodes.
			sel.exit().remove();
			//adapt container length
			d3.select("#ick-path").select("svg").attr("width",(paths.length*(tag.w+tag.s)+2*tag.t)) //(paths.length*(tag.w+tag.s)+15));
						
			//options//
			var opts=["annot. type","user","media type","media","language","key","relationship","value"];
			var used=paths.map(function(p) {return p[1];});
			var current = used.pop();
			d3.select("#ick_mode").selectAll("option").remove()
			d3.select("#ick_mode").selectAll("option")
			.data(opts.filter(function(o) {return used.indexOf(o)<0;}),function(d){return d;})
			.enter().append("option").attr("value",function(d){return d;}).text(function(d){return d;})
			
			d3.selectAll(".ick-search").property("value","")
		}
		
		//first init
		p.setView();
	}

	function progress(c,p) {
		
		//create div
		var svg = d3.select("#"+c.location)
			.classed("ick-container",true)
			.append("svg")
			.attr("id","ick-progress")
			.attr("width", c.width)
			.attr("height", p.height)
			.style("display","inline-block")//disable bottom padding
			.style("font-family","'Source Code Pro','Lucida Console',Monaco,monospace")
			.style("font-size","10pt");
		//ALL//
		var g=svg.append("g").classed("ick-allitems",true).datum(total)
		//rect
		g.append("rect")
			.attr("width", c.width)
			.attr("height", p.height)
			.attr("fill","#ddd")
			.on('mouseover', function(d){ tip("show",d); })
			.on('mouseout', function(d){ tip("hide",d); })
			.on("mousemove", function(d) { tip("move"); })
			
		//LOAD//
		g=svg.append("g").classed("ick-loaded",true).datum(root)
		//polygon
		g.append("polygon")
			.attr("points", arrow(0,p.height,10,0,0))
			.style("fill", function(d) { return color(d.id); })
			.on('mouseover', function(d){ tip("show",d); })
			.on('mouseout', function(d){ tip("hide",d); })
			.on("mousemove", function(d) { tip("move"); })
		
		g=svg.append("g").classed("ick-displayed",true).datum(node)
		//polygon
		g.append("polygon")
			.attr("points", arrow(0,p.height,10,0,0))
			.style("fill", function(d) { return color(d.id); })
			.on('mouseover', function(d){ tip("show",d); })
			.on('mouseout', function(d){ tip("hide",d); })
			.on("mousemove", function(d) { tip("move"); })
		
		//ADD PATH AND TEXT
		var sel=svg.selectAll("g").data([total,root,node])
		//path
		sel.append("path")
			.attr("id",function(d,i){return "mapprog"+i+d.id;})
			.style("opacity",0)
			.style("pointer-events","none")
			.attr("d",line(0,p.height/2,c.width,p.height/2)) //x,y,x,y
		//text
		sel.append("text")
			.attr("dy","0.5ex")
			.style("pointer-events","none")
			.append("textPath")
			.attr("xlink:href",function(d,i){return "#mapprog"+i+d.id;})
			.style("text-anchor","end") 
            .attr("startOffset","100%")

			
		p.setView = function() {
			//d3.scales
			p.x = d3.scale.linear().range([0, c.width]).domain([0, total.index.length]);
			
			d3.selectAll("#ick-progress").selectAll("polygon").data([root,node])
			.attr("points",function(d) {return arrow(p.x(d.index.length),p.height,10,0,0);})
			.style("fill", function(d) { return color(d.id); })
			
			d3.selectAll("#ick-progress").selectAll("path").data([total,root,node])
			.attr("d",function(d){return line(0,p.height/2,p.x(d.index.length),p.height/2);})
			
			d3.selectAll("#ick-progress").selectAll("textPath").data([total,root,node])
			.text(function(d){return d.category+": "+d.index.length;})
		}
	}
	
	function pie(c,p) {
		
		var pie=d3.layout.pie()
			.sort(null)
			.value(function(d){return d.index.length;});
			
		var arc = d3.svg.arc()
			.outerRadius(p.radius)
			.innerRadius(0);
		
		var w=p.radius*2; //pie
		var h=p.radius*2+22*2; //txt-pie-txt


		p.setView=function() {
			//CREATE
			var sel = d3.select("#"+c.location)
				.selectAll(".ick-pie").data(paths)
			//create new svg
			var svg = sel.enter().append("svg")
				.attr("class","ick-pie")
				.attr("width",w) //m-pie-m
				.attr("height",h)//m-txt-m-pie-m-txt-m
				//.attr("transform", "translate(" + p.margin + "," + p.margin + ")")
				.style("float","left")
			//create title text
			svg.append("path")
				.attr("id",function(d){return "mappietitle"+d[0].id;})
				.style("opacity",0)
				.style("pointer-events","none")
				.attr("d",line(0,11,w,11))
			svg.append("text")
				.attr("class","ick-pie-title")
				.attr("text-anchor", "left")
				.attr("dy","0.5ex")
				.style("pointer-events","none")
				.append("textPath")
				.attr("xlink:href",function(d){return "#mappietitle"+d[0].id;})
				.text(function(d) { return d[0].item; });
			svg.append("g")
				.attr("transform", "translate(" + w/2 + "," + h/2 + ")")
			//create pie
			var path=sel.selectAll("g").selectAll(".arc")
				.data(function(d) {return pie(d[0].children);},function(d){return d.data.id;})
			path.enter().append("path")
				.style("fill", function(d) {return color(d.data.id); })
				.attr("class",function(d){return "arc v"+d.data.id;})
				.on('mouseover', function(d){ tip("show",d.data); })
				.on("mousemove", function(d) { tip("move"); })
				.on("mouseout", function(d){ tip("hide",d.data); })	
			//create subtitle
			svg.append("path")
				.attr("id",function(d){return "mappiesub"+d[0].id;})
				.style("opacity",0)
				.style("pointer-events","none")
				.attr("d",line(0,h-11,w,h-11))
			svg.append("text")
				.attr("class","ick-pie-sub")
				.attr("text-anchor", "left")
				.attr("dy","0.5ex")
				.style("pointer-events","none")
				.append("textPath")
				.attr("xlink:href",function(d){return "#mappiesub"+d[0].id;})
				.text(function(d) { return d[1]; });
			
			//UPDATE
			//update title
			sel.selectAll(".ick-pie-title").selectAll("textPath")
				.text(function(d){return d[0].item;})
			//update arc
			path.attr("d",arc)	
			//update subtitle
			sel.selectAll(".ick-pie-sub").selectAll("textPath")
				.text(function(d){return d[1];})
				
			//DELETE	
			sel.exit().remove();
			path.exit().remove();
		}
	}
	
	function treemap(c,p){
		//margin inner final svg
		margin = {top:0, right:0, bottom:0, left:1}; 
		p.h = c.height - margin.top - margin.bottom; 
		p.w = c.width - margin.right - margin.left;
			
		//create svg
		var svg = d3.select("#"+c.location)
			.classed("ick-container",true)
			.append("svg")
			.attr("id","ick-treemap")
			.attr("width", c.width)
			.attr("height", c.height)
			.style("display","inline-block")//disable bottom padding
		
		//backgroung
		svg.append("rect") 
			.attr("width","100%")
			.attr("height","100%")
			.attr("fill","#ddd")
			.attr("class","ick-bg");

		//group for visual elements
		svg.append("g").classed("ick-visual",true)
			.attr("transform", "translate("+margin.left+","+margin.top+")") //margin left, top

		//group for label elements
		var labels = svg.append("g")
			.classed("ick-labels",true)
			.style("font-family","'Source Code Pro','Lucida Console',Monaco,monospace");
		
		p.rectTranslate = d3.svg.transform()
			.translate(function(d) { 
				var dc=d.view.treemap.coords;
				var x=p.x(dc.x) ? p.x(dc.x) : 0;
				var y=p.y(dc.y) ? p.y(dc.y) : 0;
				return [x,y]; 
			});

		p.setView = function() {			
			//D.LAYOUT//
			p.layout = d3.layout.treemap() //array of all nodes
				.size([p.w, p.h]) //size of map
				.round(false) //round the value (for scale)
				.sticky(true) //keep child position when transform
				.value(function(d){return d.index.length;});
			p.layout.nodes(node);
			saveCoords(node,"treemap");
		
			//d3.scales
			p.x = d3.scale.linear().range([0, p.w]).domain([node.x, node.x + node.dx]);
			p.y = d3.scale.linear().range([0, p.h]).domain([node.y, node.y + node.dy]);
			
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
				updateView("zoom");
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
				.text(function(d){ return d.item; })
			//delete
			sel.exit().remove();

			//Path computation
			function line(d) {
				var dc=d.view.treemap.coords;
				var ax,ay,bx,by;
				var mw=5,mh=22; //margin width and height
				var rw=p.x(dc.x+dc.dx)-p.x(dc.x)-1; //rect width
				var rh=p.y(dc.y+dc.dy)-p.y(dc.y)-1; //rect height

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
				}
				
				var path = d3.svg.line()
				.x(function(t) {return t[0];})
				.y(function(t) {return t[1];})
				.interpolate("linear");
		
				return path([[ax,ay],[bx,by]]);
			}
		}
	}
	
	//UPDATE//	
	function updateView(mode){
		
		if(mode=="load") { //re-split from root
			paths.forEach(function(path) {
				reduce(path,true);
			});
			param["progress"].setView();
		}
		else if(mode=="split"){
			//update last mode
			paths[paths.length-1][1]=d3.select("#ick_mode").node().value;
			reduce(paths[paths.length-1]);
		}
		else if(mode=="zoom") {
			param["path"].setView();
			//update last mode
			paths[paths.length-1][1]=d3.select("#ick_mode").node().value;
			reduce(paths[paths.length-1]);
			param["progress"].setView();
		}	
		param["treemap"].setView();
		param["pie"].setView();
		
		//sort children for search
		var search=node.children.slice(0);
		search.push(node);
		sorted=search.sort(function(a,b) { return a.item.length<b.item.length ? -1 : a.item.length>b.item.length ? 1 : a.item<b.item ? -1 : a.item>b.item ? 1 : 0  ; });	
	}
	
	function updatePath(n) {
		var mode = d3.select("#ick_mode").node().value;
		paths[paths.length-1][1]=mode;
		if(n!=node){paths.push([n]);}
		node=n;
	}

/*		//Multi bar chart
		//compute data for barchart
		var bars = d3.keys(annots["iclikval"].length)//.filter(function(key) { return key !== "annot"; });
		users.forEach(function(d) {
			d.vals = bars.map(function(category) { return {user: d.item, category: category, value: +annots[d.item].length[category]}; });
		 });
		
		//update view
		params.x0.domain(users.map(function(d) { return d.item; }));
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
		sel.attr("transform", function(d) { return "translate(" + params.x0(d.item) + ",0)"; });
			
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

	//UTILITIES//
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
	
	function tip(state,d) {
		if(state=="show") {
			d3.select("#ick-tip")
				.datum(d)
				.style("opacity",1)
				.html("item: "+d.item+"<br/>category: "+d.category+"<br/>annotations: "+d.index.length)
			//HL
			d3.selectAll(".v"+d.id)
			.style("fill",d3.rgb(color(d.id)).darker());
			
		}
		else if(state=="hide") {
			d3.select("#ick-tip").style("opacity",0);
			//HL
			d3.selectAll(".v"+d.id)
			.style("fill",color(d.id));
		}
		else { // move
			d3.select("#ick-tip").style("top", (d3.event.pageY-10)+"px")
            .style("left", (d3.event.pageX+10)+"px");
		}
	}
	
	function line(x1,y1,x2,y2) {
		return "M"+x1+","+y1+" L"+x2+","+y2;
	}
	
	function arrow(w,h,t,s,n) { 
		//width,height,tail,separator,n
		var res = [];
		res.push([0,0]);
		res.push([+w,0]);
		res.push([+w+t,+h/2]);
		res.push([+w,+h]);
		res.push([0,+h]);
		if(n==1) {//left empty arrow
			res.push([+t,+h/2]);
		}
		return res.join(" ");
	}
	
	//DEFINE OR EXPORTS//
	if (typeof define === "function" && define.amd) define(ick); else if (typeof module === "object" && module.exports) module.exports = ick;
	this.ick = ick;
	
}());
