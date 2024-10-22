pipeline {
    agent any
    environment {
        DOCKER_REGISTRY = 'your-docker-registry'   // Example: docker.io/username
        DOCKER_CREDENTIALS_ID = 'docker-credentials' // Jenkins credentials ID
        GITHUB_REPO = 'https://github.com/your-repo/MSLA.git'
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/msla-frontend"
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/msla-backend"
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
                        sh 'npm install' // Install dependencies
                        sh 'npm run build' // Build the frontend app
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
                        sh 'sonar-scanner -Dsonar.projectKey=msla-backend'
                        sh 'sonar-scanner -Dsonar.projectKey=msla-frontend'
                    }
                }
            }
        }

        stage('Security Scan with Trivy') {
            steps {
                script {
                    // Trivy scans for vulnerabilities in Docker images
                    sh "trivy image ${FRONTEND_IMAGE}:${env.BUILD_ID}"
                    sh "trivy image ${BACKEND_IMAGE}:${env.BUILD_ID}"
                }
            }
        }

        stage('Run Frontend & Backend Tests') {
            steps {
                parallel {
                    stage('Frontend Unit Tests') {
                        steps {
                            dir('frontend') {
                                sh 'npm test' // Run frontend tests
                            }
                        }
                    }
                    stage('Backend Unit Tests') {
                        steps {
                            dir('backend') {
                                sh 'npm 
