$.getJSON("/articles", function (data) {
    for (let i = 0; i < data.length; i++) {
        $("#articles").append("<div class='row'><div class='col-md-8'><a href='" + data[i].link + "' target='_blank'>" + data[i].title + "</a><br /><p>" + data[i].summary + "</p></div><div class='col-md-4'><button id='comment' class='btn btn-primary' data-id='" + data[i]._id + "'>Add a comment</button><hr><button class='btn btn-primary' id='getComments' data-id='" + data[i]._id + "'>View comments</button></div></div><hr>");
    }
});

$(document).on("click", "#scrape", function () {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function (data) {
        location.reload()
    })
})

$(document).on("click", "#comment", function () {
    $('#noteModal').modal("show")
    $("#notes").empty();
    let thisId = $(this).attr("data-id");
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<textarea id='bodyinput' class='form-control' name='body'></textarea>");
            $("#saveNote").attr("data-id", data._id);
            if (data.note) {
                $("#saveNote").attr("data-note", data.note._id)
            }
            else {
                $("#saveNote").attr("data-note", "false")
            }
        });
});

$(document).on("click", "#saveNote", function () {
    let noteExists = $(this).attr("data-note")
    if (noteExists === "false") {
        $('#noteModal').modal("hide")
        let thisId = $(this).attr("data-id");
        let noteBody = $("#bodyinput").val()
        console.log("note:" + noteBody)
        $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                body: $("#bodyinput").val()
            }
        })
            .then(function (data) {
                console.log(data);
                $("#notes").empty();
            });
    }
    else {
        $('#noteModal').modal("hide")
        let thisId = $(this).attr("data-note");
        let noteBody = $("#bodyinput").val()
        console.log("note:" + noteBody)
        $.ajax({
            method: "POST",
            url: "/note/" + thisId,
            data: {
                body: $("#bodyinput").val()
            }
        })
            .then(function (data) {
                console.log(data);
                $("#notes").empty();
            });
    }
    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$(document).on("click", "#getComments", function () {
    let thisId = $(this).attr("data-id");
    $("#comments").empty();
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    }).then(function (data) {
        console.log(data)
        $("#commentModal").modal("show")
        if (data.note) {
            for (let i = 0; i < data.note.body.length; i++) {
                $("#comments").append("<div>" + data.note.body[i] + "<br><button type='button' class='btn btn-primary btn-sm' data-id='" + data.note._id + "' data-location='" + data.note.body[i] + "' id='deleteNote'>Delete</button></div><hr>")
            }
        }
    })
})

$(document).on("click", "#deleteNote", function () {
    let thisId = $(this).attr("data-id");
    let thisLocation = $(this).attr("data-location");
    $("#commentModal").modal("hide")
    $.ajax({
        method: "DELETE",
        url: "/articles/" + thisId + "/" + thisLocation,
    }).then(function (data) {
        console.log(data)
    })
})