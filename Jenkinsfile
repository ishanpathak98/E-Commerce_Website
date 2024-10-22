pipeline {
    agent any
    environment {
        DOCKER_REGISTRY = 'your-docker-registry'   // Example: docker.io/username
        DOCKER_CREDENTIALS_ID = 'docker-credentials' // Jenkins credentials ID
        GITHUB_REPO = 'https://github.com/ishanpathak98/E-Commerce_Website.git'
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/ecom-frontend"
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/ecom-backend"
    }
    stages {
        stage('Checkout Code') {
            steps {
                git url: "${env.GITHUB_REPO}", branch: 'main'
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        sh 'npm install' // Install frontend dependencies
                        sh 'npm run build' // Build the React app
                        sh "docker build -t ${FRONTEND_IMAGE}:${env.BUILD_ID} ." // Build Docker image for frontend
                    }
                }
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        sh 'npm install' // Install backend dependencies
                        sh "docker build -t ${BACKEND_IMAGE}:${env.BUILD_ID} ." // Build Docker image for backend
                    }
                }
            }
        }

        stage('SonarQube Code Quality Check') {
            steps {
                script {
                    withSonarQubeEnv('SonarQube') {
                        // Analyze both frontend and backend
                        sh 'sonar-scanner -Dsonar.projectKey=msla-backend'
                        sh 'sonar-scanner -Dsonar.projectKey=msla-frontend'
                    }
                }
            }
        }

        stage('Security Scan with Trivy') {
            steps {
                script {
                    // Security scan with Trivy
                    sh "trivy image ${FRONTEND_IMAGE}:${env.BUILD_ID}"
                    sh "trivy image ${BACKEND_IMAGE}:${env.BUILD_ID}"
                }
            }
        }

        stage('Run Frontend & Backend Tests') {
            steps {
                parallel {
                    stage
