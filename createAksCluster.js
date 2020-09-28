let sh = require('shelljs');
let appId;
let displayName;
let name;
let password;
let tenant;

console.log(
  '####### Setting up RegistrationState of ContainerInstance #######'
);

sh.exec('az provider register --namespace Microsoft.ContainerInstance', {
  silent: false,
}).stdout;

let containerInstanceOutputStatus = sh.exec(
  `az provider list --query "[?contains(namespace,'Microsoft.ContainerInstance')]" -o table`,
  {
    silent: false,
  }
).stdout;

console.log(
  '####### Done Setting of RegistrationState of ContainerInstance #######'
);

console.log('####### Create a resource group #######');

sh.exec(`az group create --name myResourceGroup --location westus`, {
  silent: false,
}).stdout;

console.log('####### Created a resource group #######');

console.log('####### Create a virtual network #######');

sh.exec(
  `az network vnet create \
--resource-group myResourceGroup \
--name myVnet \
--address-prefixes 10.0.0.0/8 \
--subnet-name myAKSSubnet \
--subnet-prefix 10.240.0.0/16`,
  {
    silent: false,
  }
).stdout;

sh.exec(
  `az network vnet subnet create \
  --resource-group myResourceGroup \
  --vnet-name myVnet \
  --name myVirtualNodeSubnet \
  --address-prefixes 10.241.0.0/16`,
  {
    silent: false,
  }
).stdout;

console.log('####### Created a virtual network #######');

console.log(
  '####### Create a service principal or use a managed identity #######'
);

let servicePrincipalOutput = sh.exec(
  `az ad sp create-for-rbac --skip-assignment`,
  {
    silent: false,
  }
).stdout;

let projectJSON = JSON.parse(servicePrincipalOutput);

appId = projectJSON.appId;
displayName = projectJSON.displayName;
name = projectJSON.name;
password = projectJSON.password;
tenant = projectJSON.tenant;

console.log(
  '####### Created a service principal or use a managed identity #######'
);

console.log('####### Assign permissions to the virtual network #######');

let vnetID = sh.exec(
  `az network vnet show --resource-group myResourceGroup --name myVnet --query id -o tsv`,
  {
    silent: false,
  }
).stdout;

vnetID = vnetID.replace(/\s+/g, ' ').trim();

console.log('####### Assigned permissions to the virtual network #######');

console.log(`############ Create a role assignment ############`);

console.log(`app Id : ${appId}`);
console.log(`vnet Id : ${vnetID}`);

let roleAssignment = sh.exec(
  `az role assignment create --assignee ${appId} --scope ${vnetID} --role Contributor`,
  {
    silent: false,
  }
).stdout;

let roleAssignmentJSON = JSON.parse(roleAssignment);

let principalId = roleAssignmentJSON.principalId;
let principalType = roleAssignmentJSON.principalType;
let resourceGroup = roleAssignmentJSON.resourceGroup;

console.log(`############ Created a role assignment ############`);

console.log(`############ Create a subnet Id ############`);

let subnetId = sh.exec(
  `az network vnet subnet show --resource-group myResourceGroup --vnet-name myVnet --name myAKSSubnet --query id -o tsv`,
  {
    silent: false,
  }
).stdout;

subnetId = subnetId.replace(/\s+/g, ' ').trim();

console.log(`############ Created a subnet Id ############`);

console.log(`############ Create an AKS cluster ############`);

let aksClusterDetails = sh.exec(
  `az aks create \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --node-count 1 \
  --network-plugin azure \
  --service-cidr 10.0.0.0/16 \
  --dns-service-ip 10.0.0.10 \
  --docker-bridge-address 172.17.0.1/16 \
  --vnet-subnet-id ${subnetId} \
  --service-principal ${appId} \
  --client-secret ${password}`,
  {
    silent: false,
  }
).stdout;

console.log(`############ Created an AKS cluster ############`);
console.log(`############ Enable virtual nodes addon ############`);

let enableAddonsOutput = sh.exec(
  `az aks enable-addons \
  --resource-group myResourceGroup \
  --name myAKSCluster \
  --addons virtual-node \
  --subnet-name myVirtualNodeSubnet`,
  {
    silent: false,
  }
).stdout;

console.log(`############ Enabled virtual nodes addon ############`);
console.log(`############ Connect to the cluster ############`);

let getCredentialsOutput = sh.exec(
  `az aks get-credentials --resource-group myResourceGroup --name myAKSCluster --overwrite-existing`,
  {
    silent: false,
  }
).stdout;

console.log(`############ Connected to the cluster ############`);
console.log(`############ Fetch Node Details ############`);

let getNodes = sh.exec(`kubectl get nodes`, { silent: false }).stdout;

console.log(`############ Successsfully fetched Node Details ############`);
