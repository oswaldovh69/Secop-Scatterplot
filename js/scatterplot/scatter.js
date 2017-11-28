function ChartScatterPlot() {
		console.log('Llamado de Función');

	var margin = { top: 10, right: 300, bottom: 50, left: 100 },
		outerWidth = 1150,
		outerHeight = 450,
		width = outerWidth - margin.left - margin.right,
		height = outerHeight - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.range([0, width]).nice();

	var y = d3.scale.linear()
		.range([height, 0]).nice();

	var xCat = "Exceso Costo",
		yCat = "Cuantia Contrato",
		rCat = "Valor Total Adiciones",
		colorCat = "Orden Entidad",
		iSearch = 0,
		pathData = '../../data/scatterplot/',
		yUnity = 1000000,
		textUnityYCat = "Por Millon",
		textComplementXCat = "%",
		rowNums = 0;
		
		
	function searchData(index) {
		iSearch = 0;
		d3.csv(pathData + dataFile, function(data) {
			data.forEach(function(d) {
			d["Exceso Costo"] = +d["Exceso Costo"];
			d["Exceso Tiempo"] = +d["Exceso Tiempo"];
			d.NombreEntidad = +d["Nombre Entidad"];
			if (index == iSearch) {
				console.log(index + " - " + iSearch + "- " + d["Municipios Ejecucion"]);
				document.getElementById("txtAreaNombreEntidad").value = d["Nombre Entidad"];
				document.getElementById("txtAreaDetalleObjetoContratar").value = d["Detalle Objeto Contratar"];
				document.getElementById("txtAreaDetalleTipoContrato").value = d["Tipo Contrato"];
				document.getElementById("txtAreaDetalleMunicipiosEjecucion").value = d["Municipios Ejecucion"];
				document.getElementById("urlContrato").href = d["Ruta Proceso SECOP I"];
			}
			iSearch = iSearch + 1;
		  })
		})
		return '';
	 };
	 

	d3.csv(pathData + dataFile, function(data) {
		data.forEach(function(d) {
			d["Exceso Costo"] = +d["Exceso Costo"];
			d["Exceso Tiempo"] = +d["Exceso Tiempo"];
			d.NombreEntidad = +d["Nombre Entidad"];
			//console.log(d["Nombre Entidad"]);
			//console.log(d["Exceso Costo"]);
			rowNums = rowNums + 1;
		});
	  

	  var 
		xMax = d3.max(data, function(d) { return d[xCat]; }),
		xMin = d3.min(data, function(d) { return d[xCat]; }),
		xMin = xMin > 0 ? 0 : xMin,
		yMax = d3.max(data, function(d) { return d[yCat]/yUnity; }),
		yMin = d3.min(data, function(d) { return d[yCat]/yUnity; }),
		yMin = yMin > 0 ? 0 : yMin;
		
		console.log('File: ' + dataFile);
		console.log('xMin ' + xMin);
		console.log('xMax ' + xMax);
		console.log('yMin ' + yMin);
		console.log('yMin ' + yMax);
		console.log('rowNums ' + rowNums);

		x.domain([xMin, xMax]);
		y.domain([yMin, yMax]);

	  var xAxis = d3.svg.axis()
		  .scale(x)
		  .orient("bottom")
		  .tickSize(-height);

	  var yAxis = d3.svg.axis()
		  .scale(y)
		  .orient("left")
		  .tickSize(-width);

	  var color = d3.scale.category10();
	  
	  var tip = d3.tip()
		  .attr("class", "d3-tip")
		  .offset([-10, 0])
		  .html(function(d, i) {
			return searchData(i) + xCat + ": " + d[xCat] + " %" + "<br>" + yCat + ": " + accounting.formatMoney(d[yCat]);
		  });
	 
	  var zoomBeh = d3.behavior.zoom()
		  .x(x)
		  .y(y)
		  //.scaleExtent([0, 500])
		  .on("zoom", zoom);
		
	  var svg = d3.select("#scatter")
		.append("svg")
		  .attr("width", outerWidth)
		  .attr("height", outerHeight)
		  .attr("id", 'SVG')
		.append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
		  .call(zoomBeh);

	  svg.call(tip);

	  svg.append("rect")
		  .attr("width", width)
		  .attr("height", height);

	  svg.append("g")
		  .classed("x axis", true)
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis)
		.append("text")
		  .classed("label", true)
		  .attr("x", width)
		  .attr("y", margin.bottom - 10)
		  .style("text-anchor", "end")
		  .text(xCat + " " + textComplementXCat);

	  svg.append("g")
		  .classed("y axis", true)
		  .call(yAxis)
		.append("text")
		  .classed("label", true)
		  .attr("transform", "rotate(-90)")
		  .attr("y", -margin.left)
		  .attr("dy", ".71em")
		  .style("text-anchor", "end")
		  .text(yCat + " - " + textUnityYCat);

	  var objects = svg.append("svg")
		  .classed("objects", true)
		  .attr("width", width)
		  .attr("height", height);

	  objects.append("svg:line")
		  .classed("axisLine hAxisLine", true)
		  .attr("x1", 0)
		  .attr("y1", 0)
		  .attr("x2", width)
		  .attr("y2", 0)
		  .attr("transform", "translate(0," + height + ")");

	  objects.append("svg:line")
		  .classed("axisLine vAxisLine", true)
		  .attr("x1", 0)
		  .attr("y1", 0)
		  .attr("x2", 0)
		  .attr("y2", height);

	  objects.selectAll(".dot")
		  .data(data)
		.enter().append("circle")
		  .classed("dot", true)
		  .attr("r", function (d) { return (Math.log(d[rCat]) / Math.PI); })
		  //.attr("r", function (d) { return 10; })
		  .attr("transform", transform)
		  .style("fill", function(d) { return color(d[colorCat]); })
 		  .on("mouseover", tip.show)
		  .on("mouseout", tip.hide);
/* 		  .on("click", tip.show)
		  .on("mouseout", tip.hide); */
		  
	  var legend = svg.selectAll(".legend")
			.data(color.domain())
			.enter().append("g")
			.classed("legend", true)
			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		legend.append("circle")
		  .attr("r", 3.5)
		  .attr("cx", width + 20)
		  .attr("fill", color);


		legend.append("text")
		  .attr("x", width + 26)
		  .attr("dy", ".35em")
		  .text(function(d) { return d; });

		d3.select("#InPorcentajeExcesoPlazo").on("click", changeExcesoPlazo);
		d3.select("#InPorcentajeExcesoCosto").on("click", changeExcesoCosto);
		d3.select("#mySelectAno").on("click", changeAno);

		function changeExcesoPlazo() {
			xCat = "Exceso Tiempo";
			
			xMax = d3.max(data, function(d) { return d[xCat]; });
			xMin = d3.min(data, function(d) { return d[xCat]; });
			
			console.log('changeExcesoPlazo: ' + xMin);
			console.log('changeExcesoPlazo: ' + xMax);	

			zoomBeh.scaleExtent([0, yMax]);
			zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

			var svg = d3.select("#scatter").transition();

			svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat + " " + textComplementXCat);

			objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
			document.getElementById('InPorcentajeExcesoCosto').style.visibility = 'visible';
			svg.call(tip);
		}
	  
		function changeExcesoCosto() {
			xCat = "Exceso Costo";

			xMax = d3.max(data, function(d) { return d[xCat]; }),
			xMin = d3.min(data, function(d) { return d[xCat]; }),
			xMin = xMin > 0 ? 0 : xMin;
			
			console.log('changeExcesoCosto :' + xMin);
			console.log('changeExcesoCosto :' + xMax);	
			
			zoomBeh.scaleExtent([0, yMax]);
			zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));
			
			var svg = d3.select("#scatter").transition();

			svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCat + " " + textComplementXCat);
			objects.selectAll(".dot").transition().duration(1000).attr("transform", transform);
			svg.call(tip);
		}

		function zoom() {
			svg.select(".x.axis").call(xAxis);
			svg.select(".y.axis").call(yAxis);

			svg.selectAll(".dot")
				.attr("transform", transform);
		}

		function transform(d) {
			return "translate(" + x(d[xCat]) + "," + y(d[yCat]/yUnity) + ")";
		}
		
	});
};

function refreshChart() {
	console.log('Borrar Elementos');
	var container = document.getElementById("scatter");
	var svgElement = document.getElementById("SVG");
	
	if(svgElement){
		container.removeChild(svgElement);
	}
	document.getElementById('InPorcentajeExcesoCosto').style.visibility = 'hidden';
};
