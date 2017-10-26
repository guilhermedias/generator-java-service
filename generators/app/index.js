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
        configuration.defaultPackageFolder = defaultPackageFolder;
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
                name: "applicationName",
                message: "What's your application name?"
            },
            {
                type: "input",
                name: "defaultPackage",
                message: "What's the default package name?"
            },
            {
                type: "input",
                name: "timeZone",
                message: "What is the application time zone?",
                default: 'UTC'
            },
            {
                type: "list",
                name: "dbType",
                choices: ["jpa", "jdbc", "none"],
                message: "Do you want to use JPA or JDBC?"
            }
        ];

        return this
            .prompt(questions)
            .then((answers) => {
            this.configuration = this._buildConfiguration(answers);
    });}

    writing() {
        var folders = this._folders(this.configuration);

        this.fs.copyTpl(
            this.templatePath('Procfile'),
            this.destinationPath('Procfile'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('gitignore'),
            this.destinationPath('.gitignore'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('travis.yml'),
            this.destinationPath('.travis.yml'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('java/Application.java'),
            this.destinationPath(folders.main.java + 'Application.java'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('java/ClockConfiguration.java'),
            this.destinationPath(folders.main.java + '/config/ClockConfiguration.java'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('java/PropertiesConfiguration.java'),
            this.destinationPath(folders.main.java + '/config/PropertiesConfiguration.java'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('resources/application.properties'),
            this.destinationPath(folders.main.resources + 'application.properties'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('resources/application-local.properties'),
            this.destinationPath(folders.main.resources + 'application-local.properties'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('resources/application-test.properties'),
            this.destinationPath(folders.test.resources + 'application-test.properties'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('java/ApplicationTest.java'),
            this.destinationPath(folders.test.java + 'ApplicationTest.java'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('build.gradle'),
            this.destinationPath('build.gradle'),
            this.configuration
        );
        if (this.configuration['dbType'] == 'none') {
            this.fs.copyTpl(
                this.templatePath('gradle/scripts/java.gradle'),
                this.destinationPath('gradle/scripts/java.gradle'),
                this.configuration
            );
            this.fs.copyTpl(
                this.templatePath('gradle/scripts/spring-boot.gradle'),
                this.destinationPath('gradle/scripts/spring-boot.gradle'),
                this.configuration
            );
            this.fs.copyTpl(
                this.templatePath('gradle/scripts/idea.gradle'),
                this.destinationPath('gradle/scripts/idea.gradle'),
                this.configuration
            );
        } else {
            this.fs.copyTpl(
                this.templatePath('gradle/scripts/*.gradle'),
                this.destinationPath('gradle/scripts/'),
                this.configuration
            );

            this.fs.copyTpl(
                this.templatePath('resources/flyway/*.sql'),
                this.destinationPath(folders.main.resources + '/db/migration/'),
                this.configuration
            );
        }
        this.fs.copyTpl(
            this.templatePath('java/advice/*.java'),
            this.destinationPath(folders.main.java + '/advice/'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('java/GlobalExceptionHandler.java'),
            this.destinationPath(folders.main.java + '/controller/GlobalExceptionHandler.java'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('java/annotation/*.java'),
            this.destinationPath(folders.main.java + '/annotation/'),
            this.configuration
        );

        this.fs.copyTpl(
            this.templatePath('resources/logback.xml'),
            this.destinationPath(folders.main.resources + 'logback.xml'),
            this.configuration
        );
    }

    install() {
        this.log(chalk.green('Building your workspace'));
        shelljs.exec('gradle wrapper --gradle-version 4.0', {silent: true});

        shelljs.exec('git init', {silent: true});
        shelljs.exec('git add .', {silent: true});
        shelljs.exec('git commit -m "Initial commit"', {silent: true});
    }
};
