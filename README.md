### Pre-requisites

    1. Install node Js https://nodejs.org/en/download/
    2. Install Azure CLI https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest
    3. Create a Personal Access Token (PAT) https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page
    4. Apply the PAT Token https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page#use-a-pat

### Clone the repository and install the dependencies

    git clone https://github.com/moinuddin14/Azure-AKS-ACI-Selenium-Grid.git && cd Azure-AKS-ACI-Selenium-Grid && npm i

### Create a cluster with one AKS node and one Virtual node

    > npm run createCluster

### Deploy the hub deployment and service yaml files

    > kubectl apply -f hub-AKS-deployment.yaml

    > kubectl apply -f hub-AKS-service.yaml

### Creating environment variable which will hold the HUB URL .

    > export HUB_URL=$(kubectl get service | awk '{print $4}' | awk 'FNR == 2 {print}')

### Update the chrome-node-AKS-deployment.yaml and firefox-node-AKS-deployment.yaml files with the hub url

    > npm run updateHubOnChromeFirefox

### Deploy the chrome and firefox deployment and service yaml files

    > kubectl apply -f chrome-node-AKS-deployment.yaml

    > kubectl apply -f firefox-node-AKS-deployment.yaml

### Auto-scale Chrome and Firefox with Horizontal Pod Auto-Scaler (HPA)

    > kubectl autoscale deployment chrome-node-rc --cpu-percent=40 --min=1 --max=5

    > kubectl autoscale deployment firefox-node-rc --cpu-percent=40 --min=1 --max=5

### Clean up all environment created

    > npm run cleanupResourceGroups
