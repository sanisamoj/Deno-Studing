import { Document } from "npm:mongodb@6.1.0"

export function mapDocument<T extends Document>(doc: T | null): T {
    if (!doc) {
        throw new Error('Documento inválido: esperado um objeto, mas recebeu null');
    }

    const { _id, ...rest } = doc.toObject ? doc.toObject() : doc;
    return { id: _id?.toString(), ...rest } as T;
}

