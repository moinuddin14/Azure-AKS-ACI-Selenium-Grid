let sh = require('shelljs');

console.log(
  '####### Deleting the resource groups myResourceGroup & MC_myResourceGroup_myAKSCluster_westus #######'
);

sh.exec('az group delete --name myResourceGroup --yes', {
  silent: false,
}).stdout;

sh.exec('az group delete --name MC_myResourceGroup_myAKSCluster_westus --yes', {
  silent: false,
}).stdout;

// console.log('####### Not deleting NetworkWatcherRG #######');

sh.exec('az group delete --name NetworkWatcherRG', {
  silent: false,
}).stdout;

console.log(
  '####### Deleted the resource groups myResourceGroup & MC_myResourceGroup_myAKSCluster_westus #######'
);
