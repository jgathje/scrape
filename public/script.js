// Grab the articles as a json
$.getJSON("/articles", function (data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<div class='row'><div class='col-md-8'><a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a><br /><p>" + data[i].summary + "</p></div><div class='col-md-4'><button id='comment' class='btn btn-primary' data-id='" + data[i]._id + "'>Add a comment</button><hr><button class='btn btn-primary' id='getComments' data-id='" + data[i]._id + "'>View comments</button></div></div><hr>");
    }
});

$(document).on("click", "#scrape", function(){
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(data){
        location.reload()
    })
})

$(document).on("click", "#comment", function () {
    // Empty the notes from the note section
    $('#noteModal').modal("show")
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' class='form-control' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#saveNote").attr("data-id", data._id);
        });
});

// When you click the savenote button
$(document).on("click", "#saveNote", function () {
    // Grab the id associated with the article from the submit button
    $('#noteModal').modal("hide")
    var thisId = $(this).attr("data-id");
    let noteBody = $("#bodyinput").val()
    console.log("note:" + noteBody)
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            body: $("#bodyinput").val()
        }
    })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", "#getComments", function () {
    var thisId = $(this).attr("data-id");
    $("#comments").empty();
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function (data) {
        console.log(data)
        $("#commentModal").modal("show")
        if (data.note) {
            $("#comments").append("<div>" + data.note.body + "<div>")
            $("#deleteNote").attr("data-id", data.note._id);
        }
    })
})

$(document).on("click", "#deleteNote", function(){
    var thisId = $(this).attr("data-id");
    $("#commentModal").modal("hide")
    $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId,        
    }).then(function(data){
        console.log(data)
    })
})