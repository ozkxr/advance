import { Injectable } from "@angular/core";

export interface Employee {
	registry: string;
	fullName: string;
}

const EMPLOYEES_MOCK: Employee[] = [
	{ registry: "20101242", fullName: "Vilma Leticia Ramos López" },
	{ registry: "20150001", fullName: "Carlos Eduardo Pérez Gómez" },
	{ registry: "20080045", fullName: "María del Rosario Jiménez Fuentes" },
];
@Injectable({
	providedIn: "root",
})
export class Employees {
	findByRegistry(registry: string): Employee {
		return EMPLOYEES_MOCK.find((em) => em.registry === registry.trim()) ?? null;
	}
}
