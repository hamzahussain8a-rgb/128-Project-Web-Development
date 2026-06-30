// this is the server of the webiste. The responsibilites of the server are:
// to supply the requested webpages, json files, js file, and css files by the webiste
// handle post methods, which include adding meals, exercises to users data. Adding comments to database so they can be stored.
// more over fetching data from all_data.json file for loading comments, meals & exercises 
const http = require('http');
const fs = require('fs');
const path = require('path');

// this is the creation of server 
const server = http.createServer((req, res) => {
    // this if else is used to check what requests the server will possibiliy be getting
    if (req.method === 'GET') { // gGET request means the client is asking for files
        let filePath = '.' + req.url;
        if (filePath === './') filePath = './index.html'; // this checks if its asking for root file which is HomePage or for any other file

        const ext = path.extname(filePath); // this dictionary adn file path is used to see what type of file it requested as content type depends on that
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json'
        };
        // here the file is being read 
        fs.readFile(filePath, (err, content) => {
            if (err) { // this checks if while reading the file file threw an error, whcih means it doesnt exist
                res.writeHead(404);
                res.end('File not found');
            } else { // if no error then it will be sent to the client
                res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
                res.end(content);
            }
        });
    }

    // this check for a post method which means client wants to write smthg
    else if (req.method === 'POST' && req.url === '/all_data') { // client wants to write onto all_data json this is for the comments
        //  we prepare an empty varable for the data incoming so that it can be joined in this body 
        let body = '';
        req.on('data', chunk => body += chunk); //  chunks are nothing but the data packs coming fromt he client side
        req.on('end', () => {
            // after those end coming, the body is parsed
            const newComment = JSON.parse(body);
            // a new variable is made called data, this is used to check if the json file is empty so the variable is used or if 
            // data is in there then the files data would be appended by first copying it to body then adding data then adding body back to the data
            let data = { comments: [] };
            const raw = fs.readFileSync('all_data.json', 'utf8');
            if(raw) data = JSON.parse(raw);
            // adds data to json structure
            data.comments.push(newComment);
            fs.writeFileSync('all_data.json', JSON.stringify(data, null, 2));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        });
    }

    // this one is the for adding meal
    else if (req.method === 'POST' && req.url === '/add_mealprep') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newMeal = JSON.parse(body);
            const username = newMeal.username;
            let data = { users: [] };
            const raw = fs.readFileSync('user_data.json', 'utf8');
            if (raw) data = JSON.parse(raw);
            // same process but here we find the user, so the meals they chose are added to their records.
            // here we are trying the find the user by username.
            const user = data.users.find(u => u.name === username);
            if (!user) {
                res.writeHead(404);
                res.end(JSON.stringify({ status: 'error', message: 'User not found' }));
                return;
            }
            user.umeals = user.umeals || [];
            user.umeals.push({
                title: newMeal.title,
                recipe: newMeal.recipe,
                calories: newMeal.calories,
                image: newMeal.image
            });
            fs.writeFileSync('user_data.json', JSON.stringify(data, null, 2));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        });
    }

    // this is for adding exercis same process as adding meal
    else if (req.method === 'POST' && req.url === '/add_exerciseprep') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newexercise = JSON.parse(body);
            const username = newexercise.username; 
            let data = { users: [] };
            try {
                const raw = fs.readFileSync('user_data.json', 'utf8');
                if (raw) data = JSON.parse(raw);
            } catch (err) {
                console.log('user_data.json not found, creating new one.');
            }
            const user = data.users.find(u => u.name === username);
            if (!user) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'error', message: 'User not found' }));
                return;
            }
            user.uexercises = user.uexercises || [];
            user.uexercises.push({
                title: newexercise.title,
                description: newexercise.description,
                reps: newexercise.reps,
                image: newexercise.image
            });
            fs.writeFileSync('user_data.json', JSON.stringify(data, null, 2));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        });

    }

    // this is for adding a user, this is also same as adding comments
    else if (req.method === 'POST' && req.url === '/add_user') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            const newuser = JSON.parse(body);
            let data = { users: [] };
            const raw = fs.readFileSync('user_data.json', 'utf8');
            if (raw) data = JSON.parse(raw);
            data.users.push(newuser);
            fs.writeFileSync('user_data.json', JSON.stringify(data, null, 2));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'success' }));
        });
    }

    // this for an unknown method or url if not found an erro will be shown
    else {
        res.writeHead(404);
        res.end('Not found');
    }
});
// this allows the server to start listeing at port 8080
server.listen(8080);
