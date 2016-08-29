//data from https://data.medicare.gov/Hospital-Compare/Hospital-General-Information/xubh-q36u
//data from https://data.medicare.gov/Hospital-Compare/Medicare-Hospital-Spending-by-Claim/nrth-mfg3
//location data: https://console.aws.amazon.com/s3/home?region=us-west-2#&bucket=data.johnsnowlabs.com&prefix=world/Hospital%20Location/US%20Hospital%20Medical%20Center%20Location/
//location: https://www.medicare.gov/hospitalservices/Provider.svc/ProviderFinder?loc=CS%7CBOSTON,%20MA%7C47.6062%7C-122.3321%7C25&filters=RTNG%7C5,3,2&sort=14%7CASC&paging=1%7C20


$('#locationstuff').hide();
function myFunction() {
    var location =  document.getElementById("location");
  console.log(location.value);
  var searchfor = location.value;
  getData(searchfor);
  $('.choose').hide();
}
function myFunction2(){
  console.log("function2");
  d3.selectAll("svg > *").remove();
  $('.choose').show();
}
// var jsonDataURL = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
function getData(location) {
var dataArray = [];

//chart
//$.getJSON(jsonDataURL, function(data) {
  //console.log(data.data);
//add fake data
var data = document.getElementById('fccdata').innerHTML;
data = JSON.parse(data);
data = data.data;
//console.log(data);

//fake data over
 var  initialLocation;
 $.each(data, function(key, value) {
   //console.log(value.hospital.location);
   if (value.hospital.location === location){
       dataArray.push(value);
      initialLocation = new google.maps.LatLng(value.hospital.latitude, value.hospital.longitude);
   }
 });
  map.setCenter(initialLocation);
 //console.log("dataarray: ", dataArray);

  var y = d3.scale.linear().domain([0, 30000])
    .range([200, 50]);
  var x = d3.scale.linear().domain([0, dataArray.length-1])
    .range([60, 500]);
  var z = d3.scale.linear().domain([0, dataArray.length-1])
    .range([60, 500]);

  //add data to existing chart
  //selects all rectangle current and future
  //and binds dataArray to rectangles
  var bars = d3.select('.chart').selectAll('rect')
    .data(dataArray);

  bars.enter().append('rect').attr('width', '60px').attr('height', function(d) {
    //console.log("d: ", d.hospital.cost);

    var num = parseInt(d.hospital.cost.replace(",", ""));
      return y(0) - y(num) + "px";

    }).attr('x', function(d, i) {
      return  x(i) + "px";
    }).attr('y', function(d) {

    var num = parseInt(d.hospital.cost.replace(",", ""));
      return y(num);
    }).append("svg:title")
    .text(function(d) {
    //console.log("title d: ", d.hospital.name);
      var answer = d.hospital.name + ": $" + d.hospital.cost;
      return answer;
    });

  //creating the axes
  //y is linked to the above y that we defined
  var yaxis = d3.svg.axis().scale(y).orient('left');

  d3.select('.chart').append('g').attr("class", "y axis").attr('transform', 'translate(50, 0)').call(yaxis);

      var xAxis = d3.svg.axis()
      .scale(z)
      .orient("bottom")
      .tickFormat(function(d, i){
        //console.log("length: ", dataArray.length);
        console.log(dataArray[d].hospital.name)
    return dataArray[d].hospital.name//"Year1 Year2, etc depending on the tick value - 0,1,2,3,4"
})

      .ticks(dataArray.length-1)
      .tickSubdivide(0)
    d3.select('.chart').append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(30," + 200 + ")")
      .call(xAxis);
}
  //end call
$('#locationbtn').on('click', function(){
  $('#locationstuff').slideToggle( "fast", function() {
    // Animation complete.
  });
});
//});
