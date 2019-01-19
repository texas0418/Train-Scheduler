// Initialize Firebase
var config = {
    apiKey: "AIzaSyBL32p_cUxXP-tMHBe-5H-XMMg1cut8YTQ",
    authDomain: "myawesomeproject-1e730.firebaseapp.com",
    databaseURL: "https://myawesomeproject-1e730.firebaseio.com",
    projectId: "myawesomeproject-1e730",
    storageBucket: "myawesomeproject-1e730.appspot.com",
    messagingSenderId: "321724845525"
  };
firebase.initializeApp(config);

var database = firebase.database();
var trainName;
var destination;
var firstTrainTime;
var frequency;

//  Button for adding trains
$("#submit").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTrainTime = $("#first-train-time").val().trim();
    frequency = $("#frequency").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        train: trainName,
        dest: destination,
        first: firstTrainTime,
        frequ: frequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };

    database.ref().push(newTrain);

    // Logs everythign to the console
    console.log(newTrain.trainName);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrainTime);
    console.log(newTrain.frequency);

    // Alert
    alert("Train added successfully");

    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#destination").val("");
    $("#first-train-time").val("");
    $("#frequency").val("");
});

// 3. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (snapshot) {

        var sv = snapshot.val();
        var tFrequency = $("#frequency").val("");

        var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        var arr = [sv.train, sv.dest, sv.frequ, nextTrain, tMinutesTillTrain];
        $("#train-name").text(sv.train);
        $("#destination").text(sv.dest);
        $("#frequency").text(sv.frequ);
        $("#emp-rate").text(nextTrain);
        $("#emp-totalBilled").text(tMinutesTillTrain);
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