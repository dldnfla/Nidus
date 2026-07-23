pipeline {
  agent {
    docker {
      image 'node:20-bookworm'
      args '-u root:root'
    }
  }

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }

  stages {
    stage('Install deps') {
      steps {
        sh 'npm ci || npm install'
        sh 'npx playwright install --with-deps chromium firefox webkit'
      }
    }

    stage('Run tests') {
      steps {
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          sh 'npx playwright test'
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'monocart-report/**', allowEmptyArchive: true
      publishHTML(target: [
        reportName: 'Nidus Playwright Report',
        reportDir: 'monocart-report',
        reportFiles: 'index.html',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])
    }
  }
}