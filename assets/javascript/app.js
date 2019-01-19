var config = {
    apiKey: "AIzaSyBIdViqDNMEx1g0DfzJJVt4K48XUT9BRNw",
    authDomain: "employeeproject-3a8b4.firebaseapp.com",
    databaseURL: "https://employeeproject-3a8b4.firebaseio.com",
    projectId: "employeeproject-3a8b4",
    storageBucket: "employeeproject-3a8b4.appspot.com",
    messagingSenderId: "515738439979"
};
firebase.initializeApp(config);

var database = firebase.database();
var employeeName;
var role;
var startDate;
var monthlySalary;

$("#submit").on("click", function (event) {
    event.preventDefault();

    employeeName = $("#employee-name").val().trim();
    role = $("#role").val().trim();
    startDate = moment($("#start-date").val().trim(), "DD/MM/YY").format("X");
    monthlySalary = $("#monthy-rate").val().trim();

    var newEmp = {
        name: employeeName,
        role: role,
        start: startDate,
        rate: monthlySalary,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref().push(newEmp);


});
database.ref().on("child_added", function (snapshot) {

        var sv = snapshot.val();

        // console.log(sv.name);
        // console.log(sv.role);
        // console.log(sv.start);
        // console.log(sv.rate);

        var now = moment(new Date());
        var end = moment(sv.start);
        var duration = moment.duration(now.diff(end));
        var empMonths = parseInt(duration.asMonths());
        //var empMonths = moment(sv.start).diff(moment.unix(sv.start, "X"), "months");
        console.log(empMonths);


        var totalBilled = empMonths * sv.rate;
        //console.log(totalBilled);
        //console.log(typeof sv.rate);

        var arr = [sv.name, sv.role, sv.start, empMonths, sv.rate, totalBilled];
        $("#emp-name").text(sv.name);
        $("#emp-role").text(sv.role);
        $("#emp-start").text(sv.start);
        $("#emp-empMonths").text(empMonths);
        $("#emp-rate").text(sv.rate);
        $("#emp-totalBilled").text(totalBilled);
        //$("#emp-billed").text(sv.employeeName);
        var tableRow = $('<tr>');

        for (var i = 0; i < arr.length; i++) {

            var tableData = $("<td>");
            tableData.text(arr[i]);
            tableRow.append(tableData);

        }


        $("tbody").append(tableRow);


    },
    function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });