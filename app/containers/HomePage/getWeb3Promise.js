/**
 * Load Blockchain Network
 */
import Web3 from 'web3';
export function loadNetworkPromise() {
    return new Promise(function (resolve, reject) {
      // Wait for loading completion to avoid race conditions with web3 injection timing.
      //window.addEventListener('load', function () {
        var results
        var web3 = window.web3
  
        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
          // Use Mist/MetaMask's provider.
          web3 = new window.Web3(web3.currentProvider)
          web3.version.getNetwork((err, netId) => {
            let netIdName, trustApiName, explorerUrl;
            console.log('netId', netId);
            switch (netId) {
              case "1":
                netIdName = 'Foundation'
                trustApiName = 'api'
                explorerUrl = 'https://etherscan.io'
                console.log('This is Foundation', netId)
                break;
              case "2":
                netIdName = 'Expanse'
                trustApiName = 'exp'
                explorerUrl = 'https://expanscout.com'
                console.log('This is Expanse', netId)
                break;
              case "3":
                netIdName = 'Ropsten'
                trustApiName = 'ropsten'
                explorerUrl = 'https://ropsten.etherscan.io'
                console.log('This is Ropsten', netId)
                break;
              case "4":
                netIdName = 'Rinkeby'
                trustApiName = 'rinkeby'
                explorerUrl = 'https://rinkeby.etherscan.io'
                console.log('This is Rinkeby', netId)
                break;
              case "42":
                netIdName = 'Kovan'
                trustApiName = 'kovan'
                explorerUrl = 'https://kovan.etherscan.io'
                console.log('This is Kovan', netId)
                break;
              case "99":
                netIdName = 'POA Core'
                trustApiName = 'poa'
                explorerUrl = 'https://poaexplorer.com'
                console.log('This is Core', netId)
                break;
              case "77":
                netIdName = 'POA Sokol'
                trustApiName = 'https://trust-sokol.herokuapp.com'
                explorerUrl = 'https://sokol.poaexplorer.com'
                console.log('This is Sokol', netId)
                break;
              default:
                netIdName = 'Unknown'
                console.log('This is an unknown network.', netId)
            }
            document.title = `${netIdName} - MultiSender dApp`
            var defaultAccount = web3.eth.defaultAccount || null;
            if(defaultAccount === null){
              reject({message: 'Please unlock your metamask and refresh the page'})
            }
            results = {
              web3Instance: web3,
              netIdName,
              netId,
              injectedWeb3: true,
              defaultAccount,
              trustApiName,
              explorerUrl
            }
            resolve(results)
          })
  
          console.log('Injected web3 detected.');
  
        } else {
          // Fallback to localhost if no web3 injection.
          const errorMsg = `Metamask is not installed. Please go to
          https://metamask.io and return to this page after you installed it`
          reject({message: errorMsg})
          console.log('No web3 instance injected, using Local web3.');
          // console.error('Metamask not found'); 
        }
      //})
    })
  }
  
  /**
   *  Finalize the web3 info for usage.
   */
  export function finalizeWeb3InfoPromise(web3Config) {
    return new Promise(function (resolve, reject) {
      //this.getUserTokens(web3Config)
      let finalWeb3Info = {
        web3: null,
        defaultAccount: null,
        userTokens: null,
        netIdName: null,
        explorerUrl: null,
      }
      const {web3Instance, defaultAccount, trustApiName, netIdName, explorerUrl } = web3Config;
      window.fetch(`https://${trustApiName}.trustwalletapp.com/tokens?address=${defaultAccount}`).then((res) => {
        return res.json()
      }).then((res) => {
        let tokens = res.docs.map(({contract}) => {
          const {address, symbol} = contract;
          return {label: `${symbol} - ${address}`, value: address}
        })
        tokens.unshift({
          value: '0x000000000000000000000000000000000000bEEF',
          label: "ETH - Ethereum Native Currency"
        })
        console.log('web3 info finalized')
        // this.loading = false;
        finalWeb3Info.userTokens = tokens;
        finalWeb3Info.defaultAccount = defaultAccount;
        finalWeb3Info.web3 = new Web3(web3Instance.currentProvider); 
        finalWeb3Info.netIdName = netIdName;
        finalWeb3Info.explorerUrl = explorerUrl;   
        resolve(finalWeb3Info);    
      }).catch((e) => {
        // this.loading = false;
        console.error(e);
        reject({message: e})
      })
    })
  
  }
