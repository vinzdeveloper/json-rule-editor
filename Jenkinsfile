pipeline {
    environment {
        BRANCH_NAME = "${BRANCH_NAME}"
        BRANCH_NAME_MODIFIED = BRANCH_NAME.replaceAll("\\/", "-")
        BUILD_VERSION = "${BRANCH_NAME_MODIFIED}-${BUILD_NUMBER}"
    }

    agent any

    stages {
        stage('checkout') {
            steps {
                sh "rm -rf *"
                checkout scm
                echo BRANCH_NAME_MODIFIED
                echo BUILD_VERSION
                echo "Code checkout one successfully"
                sh "git rev-parse --verify HEAD >> hash.txt"
            }
        }
        stage('Unit Test') {
            steps {
                echo 'Unit Testing..'
                sh "docker build -t json-rule-editor-${BRANCH_NAME_MODIFIED}:${BUILD_NUMBER} -f Dockerfile.test ."
                sh "docker run --rm json-rule-editor-${BRANCH_NAME_MODIFIED}:${BUILD_NUMBER}"
                sh "docker rmi json-rule-editor-${BRANCH_NAME_MODIFIED}:${BUILD_NUMBER}"
                echo "Unit testing passed"
            }
            post {
                success {
                    echo 'post process - sucess of unit test'
                }
                failure {
                    echo 'post process - failure of unit test'
                }
            }
        }
        stage('Build') {
            steps {
                echo 'Build....'
                sh "docker build -t json-rule-editor-${BRANCH_NAME_MODIFIED}:${BUILD_NUMBER} -f Dockerfile.build ."
                sh "docker run --rm json-rule-editor-${BRANCH_NAME_MODIFIED}:${BUILD_NUMBER}"
                sh "docker rmi json-rule-editor-${BRANCH_NAME_MODIFIED}:${BUILD_NUMBER}"
                echo "Build passed"
            }
            post {
                always {
                    echo 'post process - always of build'
                }
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying.....'
            }
        }
    }

}