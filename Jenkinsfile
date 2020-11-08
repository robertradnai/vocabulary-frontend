pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'ls -la'
                sh 'pwd'
                sh 'npm install @angular/cli'
                sh 'npm run-script ng build --prod'
            }
        }
    }
}