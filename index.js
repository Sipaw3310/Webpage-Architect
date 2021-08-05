const readline = require('readline');
const express = require('express');
const ejs = require('ejs');
const os = require('os');
const app = express();
const port = 8000;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

app.use(express.static('src'));
app.set('view engine', 'ejs')
app.listen(port, '0.0.0.0');
console.log(`Listening on port ${port}`);

app.get('/', (req, res) => {
    const hostname = req.ip == '127.0.0.1' ? os.hostname() : false;
    console.log(hostname);
    res.render('index.ejs', {host: hostname});
});
app.get('/exit', (res) => {
    console.log('process exited by /exit request');
    process.exit(0);
});

askCommand();
function askCommand() {
    rl.question('> ', function(command) {
        if(command == 'exit') {
            rl.close();
        }
        else {
            console.error('!! Wrong command !!');
            askCommand();
            return 0;
        }
    });
};

rl.on('close', function () {
   console.log('Server closed');
   process.exit(0); 
});