// modelo de los datos
export class Cliente {
    apellido: string;
    nombre: string;
    cedula: number;
    id: number;

    constructor(nombre: string, apellido: string, cedula: number, id: number) {
        this.apellido = apellido;
        this.nombre = nombre;
        this.cedula = cedula;
        this.id = id;
    }
}

// TODO: anadir mas metodos de contrato e implementaciones
// interfaz para consultas sobre esos datos
export interface ClientInterface {
    getById(id: number): Promise<Cliente>;
    add(c: Cliente): void;
}
