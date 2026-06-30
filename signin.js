// this function adds user to the user_data.json by calling the server using fetch().
function addUser(username, password, membership) {
    //alert message if any of the fields arent present
    if (!username || !password || !membership) {
        alert("Please fill in all fields");
        return;
    }
    //makeing object user to push into json
    const user = {
        name: username,
        password: password,
        membership: membership,
        umeals: [],
        uexercises: []
    };
    // making a call to the server to add_user, boy includes the object user
    fetch('/add_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    // this part makes sure that the user has been added by getting a response back from the server, the status is the flag which tells if it got added or no
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('User added successfully!');
        } else {
            alert('Error: ' + data.message);
        }
    })
    // redirects from sign up page to login page
    window.location.href = "login_page.html";
}
