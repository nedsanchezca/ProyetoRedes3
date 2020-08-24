pragma solidity >=0.4.21 <0.7.0;

contract Pagos {
    // Modelamos nuestro servicio
    struct Servicio {
        uint id;
        string name;
        uint saldo;
    }

    // Guarda a los clientes que han pagado por los servicios
    mapping(address => bool) public usuarios;
    // Guarda a los servicios
    // Añade el servicio
    mapping(uint => Servicio) public servicios;
    // Store pagos Count
    uint public contServicio;
    uint public disponible;

    constructor () public {
        disponible = 200000;
        agregarServicio("Acueducto", 10000);
        agregarServicio("Mercado del mes", 20000);
        agregarServicio("Luz", 15000);
        agregarServicio("Tarjeta de credito", 30000);
        agregarServicio("Netflix", 10000);
        agregarServicio("Spotify", 10000);
    }


    function agregarServicio (string memory name, uint saldo) private {
        contServicio ++;
        servicios[contServicio] = Servicio(contServicio, name, saldo);
    }

    function pagar (uint _pagoId, uint pago) public {
        // require that they haven't voted before
        require(!usuarios[msg.sender]);

        // Verificamos que el cliente sea valido 
        require(_pagoId > 0 && _pagoId <= contServicio);

        // hacemos el pago del servicio correspondiente
        servicios[_pagoId].saldo = servicios[_pagoId].saldo - pago;

        //Se resta la cantidad del pago dado a el saldo disponible
        disponible = disponible - pago;

    }



    event votedEvent (
        uint indexed _candidateId
    );
}