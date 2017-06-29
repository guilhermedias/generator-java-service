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
        name: "javaVersion",
        message: "What Java version are you using?",
        default: '1.8'
      },
      {
        type: "input",
        name: "springBootVersion",
        message: "What Spring Boot version are you using?",
        default: '1.5.4.RELEASE'
      }
    ];

    return this
      .prompt(questions)
      .then((answers) => {
        this.configuration = this._buildConfiguration(answers);
      });
  }

  writing() {
    var folders = this._folders(this.configuration);

    this.fs.copyTpl(
      this.templatePath('java/Application.java'),
      this.destinationPath(folders.main.java + 'Application.java'),
      this.configuration
    );

    this.fs.copyTpl(
      this.templatePath('resources/application.properties'),
      this.destinationPath(folders.main.resources + 'application.properties'),
      this.configuration
    );

    this.fs.copyTpl(
      this.templatePath('build.gradle'),
      this.destinationPath('build.gradle'),
      this.configuration
    );
  }

  install() {
    this.log(chalk.green('Building your workspace'));
    shelljs.exec('gradle wrapper --gradle-version 4.0', {silent: true});
  }
};
