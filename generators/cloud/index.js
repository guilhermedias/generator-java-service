var Generator = require('yeoman-generator');
var GitHubApi = require('github-api');
var shelljs = require('shelljs');

module.exports = class extends Generator {
  _buildConfiguration(answers) {
    var configuration = {};

    for (var answer in answers) {
      if (answers.hasOwnProperty(answer)) {
        configuration[answer] = answers[answer];
      }
    }

    return configuration;
  }

  _createGitHubRepository(configuration) {
    var github = new GitHubApi({
      username: configuration.githubUsername,
      password: configuration.githubPassword
    });

    var user = github.getUser();

    return user.createRepo(
      {
        name: configuration.githubRepository
      }
    );
  }

  _buildAddRemoteCommand(configuration) {
    return 'git remote add origin "https://' +
      this.configuration.githubUsername + ':' +
      this.configuration.githubPassword + '@' +
      'github.com/' +
      this.configuration.githubUsername + '/' +
      this.configuration.githubRepository + '"';
  }

  prompting() {
    var questions = [
      {
        type: "input",
        name: "githubRepository",
        message: "What's the GitHub repository name?"
      },
      {
        type: "input",
        name: "githubUsername",
        message: "What's your GitHub username?",
        store: true
      },
      {
        type: "password",
        name: "githubPassword",
        message: "What's your GitHub password?",
        store: true
      }
    ];

    return this
      .prompt(questions)
      .then((answers) => {
        this.configuration = this._buildConfiguration(answers);
      });
  }

  writing() {
    this.log('Creating GitHub remote repository');
    var repoPromise = this._createGitHubRepository(this.configuration);

    repoPromise.then((response) => {
      this.log('Pushing to GitHub remote repository');
      var addRemoteCommand = this._buildAddRemoteCommand(this.configuration);
      shelljs.exec(addRemoteCommand, {silent: true});

      shelljs.exec('git push origin master', {silent: true});

    });
  }
};
