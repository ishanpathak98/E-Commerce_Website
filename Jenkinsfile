pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/yourusername/MSLA.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build('msla-app')
                }
            }
        }
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQubeScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
        stage('Scan with Trivy') {
            steps {
                script {
                    sh 'trivy image msla-app'
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Kubernetes deployment steps go here
                }
            }
        }
        stage('Monitoring Setup') {
            steps {
                script {
                    // Setup Prometheus and Grafana if needed
                }
            }
        }
    }
    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
