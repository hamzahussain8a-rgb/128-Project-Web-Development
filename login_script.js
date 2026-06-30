// fetch calls to the server so they can get all the meals and exercises into the select on user_page,so user can add the available meals and exercises
fetch('all_data.json')
.then(response => response.json())
.then(data => {
const mealSelect = document.getElementById('mealName');
data.meals.forEach(meal => {
    const option = document.createElement('option');
    option.value = meal.title;
    option.textContent = meal.title;
    mealSelect.appendChild(option);
});
});

fetch('all_data.json')
.then(response => response.json())
.then(data => {
const exerciseSelect = document.getElementById('exerciseName');
data.exercises.forEach(exercise => {
    const option = document.createElement('option');
    option.value = exercise.title;
    option.textContent = exercise.title;
    exerciseSelect.appendChild(option);
});
});
//###########################################################################


// function to getdata from the json files whichreturns a callback so that the ata can be used further
function getData(file = "user_data.json", callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var result = processResult(xhttp);
            callback(result);
        }
    };
    xhttp.open("GET", file, true);
    xhttp.send();
};


// this function is part of the getdata function makes the json text parsed so it can be used with notations
function processResult(xhttp) {
    var jsonText = xhttp.responseText;
    var result = JSON.parse(jsonText);
    return result;
};

// this function handles the logins, allows the user to enter username and password then checks for the username if it exists and then checks their password, if matches redirects them to user_page 
function login() {
    getData(undefined, function(data) {
        let uname = document.getElementById("uname").value;
        let pass = document.getElementById("password").value;
        let username = data.users.find(m => m.name === uname);
        if (username && username.password == pass) {
            localStorage.setItem("loggedUser", uname);
            window.location.href = "user_page.html";
        }
        else {
            alert("incorrect password");
        }
    });
}

// function called on the loading of page, loads all teh data of the respective user, to make their page more personalized.
function loadUserData() {
    let uname = localStorage.getItem("loggedUser");
    document.getElementById("user_name").innerHTML += "<span>" + uname + "</span>";
    getData(undefined, function(data) {
        let username = data.users.find(m => m.name === uname);
        for (let i=0; i < username.umeals.length ; i++) {
            showMeal(username.umeals[i].title, username.umeals[i].recipe, username.umeals[i].calories, username.umeals[i].image, 'obju');
        }
    });
    getData(undefined, function(data) {
        let username = data.users.find(m => m.name === uname);
        for (let i=0; i < username.uexercises.length ; i++) {
            showExercises(username.uexercises[i].title, username.uexercises[i].description, username.uexercises[i].reps, username.uexercises[i].image, 'obju2');
        };
    });
}

// this function adds meals to the users data, so they can add meals which they prefer
function addMealPrep() {
    let uname = localStorage.getItem("loggedUser");
    const selectedMeal = document.getElementById('mealName').value;
    const container = "obju";
    getData("all_data.json",function(data) {
        const meal = data.meals.find(m => m.title === selectedMeal);
        showMeal(meal.title, meal.recipe, meal.calories, meal.image, container);
        fetch('/add_mealprep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: meal.title,
            recipe: meal.recipe,
            calories: meal.calories,
            image: meal.image,
            username : uname
            })
        })
    })    
}

// same like meals function, this is for exercise.
function addexercisePrep() {
    let uname = localStorage.getItem("loggedUser");
    const selectedexercise = document.getElementById('exerciseName').value;
    const container = "obju2";
    getData("all_data.json", function(data) {
        const exercise = data.exercises.find(m => m.title === selectedexercise);
        showExercises(exercise.title, exercise.description, exercise.reps, exercise.image, container);
        fetch('/add_exerciseprep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: exercise.title,
            description: exercise.description,
            reps:  exercise.reps,
            image: exercise.image,
            username : uname
            })
        })
    })
    
}

// this function loads meals onto the page
function showMeal(name, recipe, calories, image, cont) {
    const html = `
    <div style="display: flex; align-items: center; background: #f1bebeff; color: #000; padding: 10px; margin-bottom: 15px; border-radius: 8px;">
        <img src="${image}" alt="${name}" style="width:100px; height:auto; margin-right: 15px; border-radius: 8px;">
        <div>
            <div style="font-weight:bold; font-size: 1.2em; color: red; margin-bottom: 5px;">${name}</div>
            <div style="font-style: italic; margin-bottom: 5px;">${recipe}</div>
            <div style="font-style: italic;">${calories}</div>
        </div>
    </div>`;
    document.getElementById(cont).innerHTML += html;
}

// this function loads exercises onto the page
function showExercises(title, description, reps, image, cont) {
    const html = `
    <div style="display: flex; align-items: center; background: #f1bebeff; color: #000; padding: 10px; margin-bottom: 15px; border-radius: 8px;">
        <img src="${image}" alt="${title}" style="width:100px; height:auto; margin-right: 15px; border-radius: 8px;">
        <div>
            <div style="font-weight:bold; font-size: 1.2em; color: red; margin-bottom: 5px;">${title}</div>
            <div style="font-style: italic; margin-bottom: 5px;">${description}</div>
            <div style="font-style: italic;">${reps}</div>
        </div>
    </div>`;
    document.getElementById(cont).innerHTML += html;
}

// this function calculates the bmr of the person, by using the data they provide in the form
function calculateCalories() {
    let age = document.getElementById("age").value;
    let weight = document.getElementById("weight").value;
    let height = document.getElementById("height").value;
    let gender = document.getElementById("gender").value;
    let activity = document.getElementById("activity").value;

    if (!age || !weight || !height || !gender || !activity) {
        document.getElementById("result").innerHTML = "Please fill in all fields.";
        return;
    }
    let bmr;
    if (gender === "male") {
        bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
        bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }

    let calories = Math.round(bmr * activity);

    document.getElementById("result").innerHTML =
        `<strong>Your Daily Calorie Needs:</strong><br> ${calories} calories/day`;
}


