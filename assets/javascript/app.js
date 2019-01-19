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

//  Button for adding trains
$("#submit").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#first-train-time").val().trim();
    var frequency = $("#frequency").val().trim();

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
        var firstTime = $("#first-train-time").val("").format("HH:mm");

        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
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
        $("#next-train").text(nextTrain);
        $("#minutes-tt").text(tMinutesTillTrain);
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