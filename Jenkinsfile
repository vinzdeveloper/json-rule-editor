pipeline {
    environment {
        BRANCH_NAME = "${BRANCH_NAME}"
        BRANCH_NAME_MODIFIED = BRANCH_NAME.replaceAll("\\/", "-")
        BUILD_VERSION = "${BRANCH_NAME_MODIFIED}-${BUILD_NUMBER}"
    }

    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }

}