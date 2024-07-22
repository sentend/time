const { exec } = require("child_process");

function runMigrate() {
    exec("npm run migrate", (error, stdout, stderr) => {
        if (error) {
            console.error(`Ошибка при выполнении migrate: ${error}`);
            return;
        }
        console.log(`Результат выполнения migrate: ${stdout}`);
    });
}

function runGenerate() {
    exec("npm run generate", (error, stdout, stderr) => {
        if (error) {
            console.error(`Ошибка при выполнении generate: ${error}`);
            return;
        }
        console.log(`Результат выполнения generate: ${stdout}`);
        runMigrate();
    });
}

runGenerate();
