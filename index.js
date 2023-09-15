const http = require("http");
const { exec } = require("child_process");
const config = require("./config.json");
const server = http.createServer(async (req, res) => {
    let route = req.url.split('/')[1];
    if (route !== "check") return res.end('Cannot get ' + req.url);
    let username = req.url.split('/')[2];
    if (!username) return res.end('Param username pending');

    let count_connections;
    let limit_connections;
    let expiration_date;
    let expiration_days;

    const count_connections_promisse = new Promise((resolve) => {
        exec(`ps -u ${username} | grep sshd | wc -l`, (error, stdout, stderr) => {
            if (error) count_connections = 0;
            if (stderr) count_connections = 0;

            resolve(parseInt(stdout?.trim().replace("\n", "") || 0));
        });
    });

    const limit_connections_promisse = new Promise((resolve) => {
        exec(`grep "^${username} " "/root/usuarios.db" | cut -d' ' -f2`, (error, stdout, stderr) => {
            if (error) connection_limit = 0;
            if (stderr) connection_limit = 0;

            resolve(parseInt(stdout?.trim().replace("\n", "") || 0));
        });
    });

    const expiration_date_promisse = new Promise((resolve) => {
        exec(`clear\nusuario="${username}"\ndatauser=$(chage -l $usuario | grep -i co | awk -F : '{print $2}')\ndatabr="$(date -d "$datauser" +"%Y%m%d")"\nhoje="$(date -d today +"%Y%m%d")"\nif [ $hoje -ge $databr ]; then\ndata="-1"\nelse\ndat="$(date -d"$datauser" '+%Y-%m-%d')"\ndata=$(date -d "$dat" +"%d/%m/%Y")\nfi\necho -e "$data"`, (error, stdout, stderr) => {
            if (error) expiration_date = "00/00/0000";
            if (stderr) expiration_date = "00/00/0000";

            const string = stdout;
            const regex = /(\d{2}\/\d{2}\/\d{4})/;
            const match = string.match(regex);
            const date = match ? match[1] : null;

            resolve(date?.trim().replace("\n", "") || "00/00/0000");
        });
    });

    const expiration_days_promisse = new Promise((resolve) => {
        exec(`clear\nusuario="${username}"\ndatauser=$(chage -l $usuario |grep -i co |awk -F : '{print $2}')\nif [ $datauser = never ] 2> /dev/null\nthen\ndata="-1"\nelse\ndatabr="$(date -d "$datauser" +"%Y%m%d")"\nhoje="$(date -d today +"%Y%m%d")"\nif [ $hoje -ge $databr ]\nthen\ndata="-1"\nelse\ndat="$(date -d"$datauser" '+%Y-%m-%d')"\ndata=$(echo -e "$((($(date -ud $dat +%s)-$(date -ud $(date +%Y-%m-%d) +%s))/86400))")\nfi\nfi\necho -e "$data"`, (error, stdout, stderr) => {
            if (error) expiration_days = 0;
            if (stderr) expiration_days = 0;

            const string = stdout;
            const regex = /-e (\d+)/;
            const match = string.match(regex);
            const number = match ? parseInt(match[1]) : null;

            resolve(number || 0);
        });
    });

    count_connections = await count_connections_promisse;
    limit_connections = await limit_connections_promisse;
    expiration_date = await expiration_date_promisse;
    expiration_days = await expiration_days_promisse;

    res.end(JSON.stringify({
        username,
        limit_connections,
        count_connections,
        expiration_date,
        expiration_days
    }));
});

try {
    server.listen(config.listen_port)
} catch (err) {
    console.log(`A porta ${config.listen_port} está em uso.`);
};