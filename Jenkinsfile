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

    stage('Verify session') {
      steps {
        sh 'npm run verify'
      }
    }
  }
}
