const {
  AwsCdkTypeScriptApp,
  DependenciesUpgradeMechanism,
  Gitpod,
  DevEnvironmentDockerImage,
} = require('projen');

const project = new AwsCdkTypeScriptApp({
  cdkVersion: '1.125.0',
  cdkVersionPinning: true,
  cdkDependencies: ['@aws-cdk/aws-s3'],
  devDeps: ['@types/js-yaml@^3.12.5'],
  deps: ['js-yaml@^3.14.1'],
  eslint: true,
  dependabot: false,
  releaseWorkflow: false,
  defaultReleaseBranch: 'main',
  jsiiFqn: 'projen.AwsCdkTypeScriptApp',
  name: '',
  authorEmail: '',
  authorName: 'Chris Yang',
  description: '',
  repository: 'https://github.com/[owner]/[repo]',
  keywords: ['CodePipeline', 'CodeBuild'],
  gitignore: ['lambda/codepipeline-event/dist', 'lambda/codebuild-event/dist'],
  releaseWorkflow: false,
});

project.eslint.addRules({
  'comma-dangle': [
    'error',
    {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    },
  ],
});

const common_exclude = [
  'cdk.out',
  'cdk.context.json',
  'yarn-error.log',
  'dependabot.yml',
  '.idea',
];

project.gitignore.exclude(...common_exclude);

// gitpod
const gitpodPrebuild = project.addTask('gitpod:prebuild', {
  description: 'Prebuild setup for Gitpod',
});
gitpodPrebuild.exec('yarn install --frozen-lockfile --check-files');
gitpodPrebuild.exec(`npm i -g aws-cdk@${project.cdkVersion}`);

let gitpod = new Gitpod(project, {
  dockerImage: DevEnvironmentDockerImage.fromFile('.gitpod.Dockerfile'),
  prebuilds: {
    addCheck: true,
    addBadge: true,
    addLabel: true,
    branches: true,
    pullRequests: true,
    pullRequestsFromForks: true,
  },
});

gitpod.addCustomTask({
  name: 'install package and check zsh and zsh plugin',
  init: `yarn gitpod:prebuild
sudo chmod +x ./.gitpod/oh-my-zsh.sh && ./.gitpod/oh-my-zsh.sh`,
});

gitpod.addCustomTask({
  name: 'run docker',
  command: 'sudo docker-up &',
});

gitpod.addCustomTask({
  name: 'change default shell to zsh and start zsh shell',
  command: 'sudo chsh -s $(which zsh) && zsh',
});

/* spellchecker: disable */
gitpod.addVscodeExtensions(
  'dbaeumer.vscode-eslint'
);

project.synth();
