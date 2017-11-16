// Array of numbers to validate time
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

// Inialize database
const config = {
  apiKey: "AIzaSyCPvZTavp6MmsbPb_rf0708V-AlLiMBIMY",
  authDomain: "test-1379e.firebaseapp.com",
  databaseURL: "https://test-1379e.firebaseio.com",
  projectId: "test-1379e",
  storageBucket: "test-1379e.appspot.com",
  messagingSenderId: "367144901744"
};
firebase.initializeApp(config);

const database = firebase.database();

let inputName = "";						// Name holder
let inputDestination = "";		// Destination holder
let inputFrequency = "";			// Frequency holder
let inputTime = "";						// Time holder

// Click event to add train to schedule
$("#addTrain").on("click", function(event) {
	// Prevent page reloading on click
	event.preventDefault();

	// Get input values
	inputName = $("#train-name").val().trim();
	inputDestination = $("#train-destination").val().trim();
	inputFrequency = $("#train-frequency").val().trim();
	inputTime = $("#train-time").val().trim();

	// Check input time
	let valid = 0;
	// Loop through each char of inputTime
	for (let i = 0; i < inputTime.length; i++) {
		// Checks if third char is :
		if (i === 2) {
			if (inputTime[2] === ":") {
				valid++;
			}
		}
		// Handles rest of string
		else {
			for (let j = 0; j < numbers.length; j++) {
				// Check if number
				if (inputTime[i] === numbers[j]) {
					valid++;
				}
			}
		}
	}

	// Check if frequency input is number
	let freq = 0;
	for (let i = 0; i < inputFrequency.length; i++) {
		for (let j = 0; j < numbers.length; j++) {
			if (inputFrequency[i] === numbers[j]) {
				freq++;
			}
		}
	}

	// Validation and displays error corresponding error message
	if (inputName === ""){
		$("#message").html(" Enter Name");
	}
	else if (inputDestination === "") {
		$("#message").html(" Enter Destination");
	}
	else if (inputTime === "") {
		$("#message").html(" Enter First Time");
	}
	else if (inputTime.length !== 5) {
		$("#message").html(" Invalid Time");
	}
	else if (valid !== 5) {
		$("#message").html(" Invalid Time");
	}
	else if (inputFrequency === "") {
		$("#message").html(" Enter Frequency");
	}
	else if (freq !== inputFrequency.length) {
		$("#message").html(" Invalid Frequency");
	}
	// Valid input
	else {
		// Add information to database
		database.ref().push({
    name: inputName,
    destination: inputDestination,
    frequency: inputFrequency,
    firstTime: inputTime,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });

		// Clears input fields
		$("#train-name").val("");
		$("#train-destination").val("");
		$("#train-frequency").val("");
		$("#train-time").val("");
	}
});

// Calculates next incoming train
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

// Adds new row to table
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

// Calculates next train and displays on table
database.ref().orderByChild("dateAdded").on("child_added", function(snapshot) {
  // storing the snapshot.val() in a variable for convenience
  var sv = snapshot.val();

  incomingTrain(sv.firstTime, sv.frequency);
	addRow(sv.name, sv.destination, sv.frequency);

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});