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
                    // Security scan with Trivy for both frontend and backend images
                    sh "trivy image ${FRONTEND_IMAGE}:${env.BUILD_ID}"
                    sh "trivy image ${BACKEND_IMAGE}:${env.BUILD_ID}"
                }
            }
        }

        stage('Run Frontend & Backend Tests') {
            steps {
                parallel {
                    stage('Frontend Tests') {
                        steps {
                            dir('frontend') {
                                sh 'npm test' // Run frontend tests
                            }
                        }
                    }

                    stage('Backend Tests') {
                        steps {
                            dir('backend') {
                                sh 'npm test' // Run backend tests
                            }
                        }
                    }
                }
            }
        }

        stage('Push Docker Images') {
            steps {
                script {
                    docker.withRegistry('', "${env.DOCKER_CREDENTIALS_ID}") {
                        // Push frontend image
                        sh "docker push ${FRONTEND_IMAGE}:${env.BUILD_ID}"
                        // Push backend image
                        sh "docker push ${BACKEND_IMAGE}:${env.BUILD_ID}"
                    }
                }
            }
        }

        stage('Deploy to Docker') {
            steps {
                script {
                    // Pull and run the frontend container
                    sh "docker pull ${FRONTEND_IMAGE}:${env.BUILD_ID}"
                    sh "docker run -d -p 3000:3000 ${FRONTEND_IMAGE}:${env.BUILD_ID}"

                    // Pull and run the backend container
                    sh "docker pull ${BACKEND_IMAGE}:${env.BUILD_ID}"
                    sh "docker run -d -p 4000:4000 ${BACKEND_IMAGE}:${env.BUILD_ID}"
                }
            }
        }

        stage('Setup Monitoring with Prometheus & Grafana') {
            steps {
                script {
                    // Deploy Prometheus and Grafana using Docker
                    sh 'docker run -d -p 9090:9090 --name prometheus prom/prometheus'
                    sh 'docker run -d -p 3000:3000 --name grafana grafana/grafana'
                }
            }
        }
    }

    post {
        always {
            cleanWs() // Clean the workspace after the build
        }
    }
}

