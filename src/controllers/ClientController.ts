import { ClientInterface, Cliente } from "../contract/Cliente";

export class ClientController {
    cliente: ClientInterface;
    constructor(c: ClientInterface) {
        this.cliente = c;
    }

    getById(id: number): Promise<Cliente> {
        return this.cliente.getById(id);
    }

    add(c: Cliente) {
        this.cliente.add(c);
    }
}
