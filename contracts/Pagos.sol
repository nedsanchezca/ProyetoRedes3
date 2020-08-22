pragma solidity >=0.4.21 <0.7.0;

contract Pagos {
    // Model a Candidate
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
    // Store Candidates Count
    uint public contServicio;
    uint public disponible;

    // voted event
    event votedEvent (
        uint indexed _candidateId
    );

    constructor () public {
        disponible = 10000;
        agregarServicio("Acueducto", 10000);
        agregarServicio("Algo mas", 20000);
    }

    function agregarServicio (string memory name, uint saldo) private {
        contServicio ++;
        servicios[contServicio] = Servicio(contServicio, name, saldo);
    }

    function pagar (uint _candidateId, uint pago) public {
        // require that they haven't voted before
        require(!usuarios[msg.sender]);

        // require a valid candidate
        require(_candidateId > 0 && _candidateId <= contServicio);

        // record that voter has voted
        //voters[msg.sender] = true;

        // update candidate vote Count
        servicios[_candidateId].saldo = servicios[_candidateId].saldo - pago;

        // trigger voted event
        //emit votedEvent(_candidateId);
    }
}