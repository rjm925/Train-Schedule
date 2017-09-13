var numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

var config = {
  apiKey: "AIzaSyCPvZTavp6MmsbPb_rf0708V-AlLiMBIMY",
  authDomain: "test-1379e.firebaseapp.com",
  databaseURL: "https://test-1379e.firebaseio.com",
  projectId: "test-1379e",
  storageBucket: "test-1379e.appspot.com",
  messagingSenderId: "367144901744"
};
firebase.initializeApp(config);

var database = firebase.database();
var inputName = "";
var inputDestination = "";
var inputFrequency = "";
var inputTime = "";

$("#addTrain").on("click", function(event) {
	event.preventDefault();

	inputName = $("#train-name").val().trim();
	inputDestination = $("#train-destination").val().trim();
	inputFrequency = $("#train-frequency").val().trim();
	inputTime = $("#train-time").val().trim();

	var valid = 0;
	for (var i = 0; i < inputTime.length; i++) {
		if (i === 2) {
			if (inputTime[2] === ":") {
				valid++;
			}
		}
		else {
			for (var j = 0; j < numbers.length; j++) {
				if (inputTime[i] === numbers[j]) {
					valid++;
				}
			}
		}
	}

	if (inputName === ""){}
	else if (inputDestination === "") {}
	else if (inputFrequency === "") {}
	else if (inputTime === "") {}
	else if (inputTime.length !== 5) {}
	else if (valid !== 5) {}
	else {
		database.ref().push({
    name: inputName,
    destination: inputDestination,
    frequency: inputFrequency,
    firstTime: inputTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

		$("#train-name").val("");
		$("#train-destination").val("");
		$("#train-frequency").val("");
		$("#train-time").val("");
	}
});

function incomingTrain(firstTime, tfrequency) {
	var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  // Time apart (remainder)
  var tRemainder = diffTime % tfrequency;
  // Minute Until Train
  arrival = tfrequency - tRemainder;
  // Next Train
  nextTrain = moment().add(arrival, "minutes");
}

function addRow(name, destination, frequency) {
	var newRow = $("<tr>");
	var newName = $("<td>");
	newName.append(name);
	var newDestination = $("<td>");
	newDestination.append(destination);
	var newFrequency = $("<td>");
	newFrequency.append(frequency);
	var newTime = $("<td>");
	newTime.append(moment(nextTrain).format("hh:mm A"));
	var newMinutes = $("<td>");
	newMinutes.append(arrival);
	newRow.append(newName);
	newRow.append(newDestination);
	newRow.append(newFrequency);
	newRow.append(newTime);
	newRow.append(newMinutes);
	$("#trainSchedule").append(newRow);
}

database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();

  incomingTrain(sv.firstTime, sv.frequency);
	addRow(sv.name, sv.destination, sv.frequency);

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});