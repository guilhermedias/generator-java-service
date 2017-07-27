var Generator = require('yeoman-generator');
var shelljs = require('shelljs');
var chalk = require('chalk');

module.exports = class extends Generator {
    // Helper methods
    _buildConfiguration(answers) {
        var configuration = {};

        for (var answer in answers) {
            if (answers.hasOwnProperty(answer)) {
                configuration[answer] = answers[answer];
            }
        }

        return configuration;
    }

    _folders(configuration) {
        var defaultPackage = configuration.defaultPackage;
        var defaultPackageFolder = defaultPackage.replace(/\./g, '/');

        return {
            main: {
                java: 'src/main/java/' + defaultPackageFolder + '/',
                resources: 'src/main/resources/'
            },
            test: {
                java: 'src/test/java/' + defaultPackageFolder + '/',
                resources: 'src/test/resources/'
            },
        };
    }

    // Task methods
    initializing() {
        var banner = "\n" +
            "  __  __                _     _       _        \n" +
            " |  \\/  | __ _  ___ ___| |__ (_) __ _| |_ ___  \n" +
            " | |\\/| |/ _` |/ __/ __| '_ \\| |/ _` | __/ _ \\ \n" +
            " | |  | | (_| | (_| (__| | | | | (_| | || (_) |\n" +
            " |_|  |_|\\__,_|\\___\\___|_| |_|_|\\__,_|\\__\\___/ \n" +
            "                                               \n";
        this.log(chalk.green(banner));
    }

    prompting() {
        var questions = [
            {
                type: "input",
                name: "defaultPackage",
                message: "What's the package that you want to create the rest template?"
            },
            {
                type: "input",
                name: "restClassName",
                message: "What's the entity name to create the controller?"
            }

        ];

        return this
            .prompt(questions)
            .then((answers) => {
            this.configuration = this._buildConfiguration(answers);
    })
        ;
    }

    writing() {
        var folders = this._folders(this.configuration);

        this.fs.copyTpl(
            this.templatePath('RestController.java'),
            this.destinationPath(folders.main.java + this.configuration['restClassName'] +'RestController.java'),
            this.configuration
        );
    }
};