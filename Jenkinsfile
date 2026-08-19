pipeline {
  agent any

  options {
    timestamps()
  }

  stages {
    stage('Install') {
      steps {
        sh 'npm ci'
      }
    }

    stage('Run comment') {
      steps {
        sh 'npm run comment'
      }
    }
  }
}
