App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    ethereum.enable();
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Pagos.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Pagos = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Pagos.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Pagos.deployed().then(function(instance) {
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Volver a cargar la página cuando se registre un evento
        App.render();
      });
    });
  },

  render: function() {
    var pagoInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Cuenta #: " + account);
      }
    });
    // Cargar saldo del usuario
    App.contracts.Pagos.deployed().then(function(instance) {
      saldoInstance = instance;
      return saldoInstance.disponible();
    }).then(function(disponible){
      var saldo = $("#saldoUsuario");
      var plantillaSaldo = "Presupuesto de la cuenta " + disponible;
      saldo.append(plantillaSaldo);
    });
    // Load contract data
    App.contracts.Pagos.deployed().then(function(instance) {
      pagoInstance = instance;
      return pagoInstance.contServicio();
    }).then(function(contServicio) {
      var saldoCancelar = $("#saldoCancelar");
      saldoCancelar.empty();

      var seleccionServicios = $('#seleccionServicios');
      seleccionServicios.empty();

      var pago = $("#pago");
      pago.empty();

      for (var i = 1; i <= contServicio; i++) {
        pagoInstance.servicios(i).then(function(pago) {
          var id = pago[0];
          var nombre = pago[1];
          var saldo = pago[2];

          // Render candidate Result
          var plantillaPago = "<tr><th>" + id + "</th><td>" + nombre + "</td><td>" + saldo + "</td></tr>"
          saldoCancelar.append(plantillaPago);

          // Render candidate ballot option
          var opcionServicio = "<option value='" + id + "' >" + nombre + "</ option>"
          seleccionServicios.append(opcionServicio);
        });
      }
      return pagoInstance.usuarios(App.account);
    }).then(function(hapagado) {
      if(hapagado) {
        $('form').hide();
      }
      loader.hide();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  hacerPago: function() {
    var servicioId = $('#seleccionServicios').val();
    var pago = $('#pago').val();
    App.contracts.Pagos.deployed().then(function(instance) {
      return instance.pagar(servicioId, pago);
    }).then(function(result) {
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
