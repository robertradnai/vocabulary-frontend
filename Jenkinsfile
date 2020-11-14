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
        stage('Saving package') {
            steps {
                sh 'mkdir -p /var/jenkins_dist/vocabulary-front/$GIT_BRANCH'
                sh 'rm -f /var/jenkins_dist/vocabulary-front/$GIT_BRANCH/*'
                sh 'cp -r dist/vocabulary-front-end/* /var/jenkins_dist/vocabulary-front/$GIT_BRANCH/'
            }
        }
    }
}