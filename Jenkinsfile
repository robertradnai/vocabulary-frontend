pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'ls -la'
                sh 'pwd'
                sh 'ng build --prod'
            }
        }
    }
}