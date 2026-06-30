// Thiis the main function which gets the data from the json file
function getData(callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var result = processResult(xhttp);
            callback(result);
        }
    };
    xhttp.open("GET", "all_data.json", true);
    xhttp.send();
}

// the function is a sub funtion of getData() which helps parse the jsontext so it can be used
function processResult(xhttp) {
    var jsonText = xhttp.responseText;
    var result = JSON.parse(jsonText);
    return result;
}

//this function is used by the comments section to load comments onto the page, whent he getData function gets called a loop is generated which calls this function for each message
function showComment(name, comment_data) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comment');
    const now = new Date();
    const dateTime = now.toLocaleString();
    commentDiv.innerHTML = `<strong>${name}</strong> <span>${dateTime}</span> <i>Commented</i><hr><p>${comment_data}</p>`;
    commentsContainer.prepend(commentDiv);
}

//this function is used by comments section so that comments can be added, it sends a post call to server of /all_data which then adds the comment to the all_data.json file
function addComment(name, comment_data) {
    fetch('/all_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name: name, Comment: comment_data })
    }).then(() => {
        document.getElementById('name').value = '';
        document.getElementById('commentText').value = '';
        showComment(name, comment_data);
    });
}

// this function is used by the meals page so that the meals could be generated
function showMeal(name, recipe, calories, image, cont) {
    const html = `<div style="display: flex; align-items: center; background: #f1bebeff; color: #000; padding: 10px; margin-bottom: 15px; border-radius: 8px;"><img src="${image}" alt="${name}" style="width:100px; height:auto; margin-right: 15px; border-radius: 8px;"><div><div style="font-weight:bold; font-size: 1.2em; color: red; margin-bottom: 5px;">${name}</div><div style="font-style: italic; margin-bottom: 5px;">${recipe}</div><div style="font-style: italic;">${calories}</div></div></div>`;
    document.getElementById(cont).innerHTML += html;
}

// this function is used by the exercise page to generated exercise data onto the page
function showExercises(title, description, reps, image, cont) {
    const html = `<div style="display: flex; align-items: center; background: #f1bebeff; color: #000; padding: 10px; margin-bottom: 15px; border-radius: 8px;"><img src="${image}" alt="${title}" style="width:100px; height:auto; margin-right: 15px; border-radius: 8px;"><div><div style="font-weight:bold; font-size: 1.2em; color: red; margin-bottom: 5px;">${title}</div><div style="font-style: italic; margin-bottom: 5px;">${description}</div><div style="font-style: italic;">${reps}</div></div></div>`;
    document.getElementById(cont).innerHTML += html;
}


//call to load comments on home page
getData(function(data) {
    for (let i = 0; i < data.comments.length; i++) {
        showComment(data.comments[i].Name, data.comments[i].Comment);
    }
});

// call to generate meals on meal page
getData(function(data) {
    for (let i = 0; i < data.meals.length; i++) {
        showMeal(data.meals[i].title, data.meals[i].recipe, data.meals[i].calories, data.meals[i].image, 'obj');
    }
});

// call to load exercises on to exercise page
getData(function(data) {
    for (let i = 0; i < data.exercises.length; i++) {
        showExercises(data.exercises[i].title, data.exercises[i].description, data.exercises[i].reps, data.exercises[i].image, 'obj2');
    }
});

// call to load data for the mission adn vision and about us section
getData(function(data) {
    document.getElementById("mission-box").innerHTML = `<h3>${data.mission.title}</h3><p>${data.mission.text}</p><ul>${data.mission.tags.map(tag => `<li>${tag}</li>`).join('')}</ul>`;
    document.getElementById("vision-box").innerHTML = `<h3>${data.vision.title}</h3><p>${data.vision.text}</p>`;
    document.getElementById("abtus-box").innerHTML = `<h3>${data.AboutUs.title}</h3><hr/><p>${data.AboutUs.text}</p>`;
});

// call to add founders data to the founders page 
getData(function(data) {
    var html = '<div class="section"><h2 class="section-title">Founders Information</h2><div class="box-container">';
    for (var i = 0; i < data.founders.length; i++) {
        html += '<div class="fsmall-box"><div><b>' + data.founders[i].name + '</b></div><br><div>ID: ' + data.founders[i].id + '</div><br><div>Role: ' + data.founders[i].role + '</div><br><div>' + data.founders[i].contribution + '</div></div>';
    }
    html += '</div></div>';
    document.getElementById("fmain").innerHTML = html;
});
