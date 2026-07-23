pipeline {
  agent any

  options {
    timestamps()
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }

  stages {
    stage('home') {
      steps {
        build job: '2-nidus-home', wait: true, propagate: false
      }
    }
    stage('vote') {
      steps {
        build job: '3-nidus-vote', wait: true, propagate: false
      }
    }
    stage('map') {
      steps {
        build job: '4-nidus-map', wait: true, propagate: false
      }
    }
    stage('calendar') {
      steps {
        build job: '5-nidus-calendar', wait: true, propagate: false
      }
    }
  }
}