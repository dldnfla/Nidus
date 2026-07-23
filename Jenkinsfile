pipeline {
  agent {
    docker {
      image 'node:20-bookworm'
      args '-u root:root'
    }
  }

  options {
    timestamps()
    // 오래된 빌드는 30개까지만 남기고 정리 (원치 않으면 이 줄 삭제)
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }

  stages {
    stage('Install deps') {
      steps {
        sh 'npm ci || npm install'
        // package.json에 명시된 버전과 항상 맞는 브라우저를 설치 (지금은 chromium 하나만 사용)
        sh 'npx playwright install --with-deps chromium'
      }
    }

    stage('Run tests') {
      steps {
        // 테스트가 실패해도 다음 단계(리포트 발행)는 진행되도록 catchError 사용
        catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
          sh 'npx playwright test'
        }
      }
    }
  }

  post {
    always {
      script {
        // playwright.config.ts가 방금 만든 results/<날짜>_<파일명들>[_build번호] 폴더 이름을 찾아옴
        env.REPORT_DIR = sh(
          script: "ls -td results/*/ 2>/dev/null | head -1 | xargs -r basename",
          returnStdout: true
        ).trim()
      }

      // results 폴더는 워크스페이스에 계속 쌓이지만(=젠킨스 Workspace 화면에서 전체 이력 확인 가능),
      // 이번 빌드의 리포트만 별도로 아카이빙해서 백업 + 빠른 접근용으로 남김
      archiveArtifacts artifacts: "results/${env.REPORT_DIR}/**", allowEmptyArchive: true

      // HTML Publisher 플러그인 필요 — 이번 빌드 리포트를 젠킨스 화면에서 바로 열람
      publishHTML(target: [
        reportName: 'Nidus Playwright Report',
        reportDir: "results/${env.REPORT_DIR}",
        reportFiles: 'index.html',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])
    }
  }
}